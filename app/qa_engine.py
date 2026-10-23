"""Motor de QA: cruza el sheet de planificación (Estructura / Creatividad 2027)
con los anuncios de Meta de las campañas 2027 y devuelve un reporte JSON."""
import csv
import datetime as dt
import io
import json
import os
import re
import time
import unicodedata
import urllib.error
import urllib.parse
import urllib.request
from collections import defaultdict
from concurrent.futures import ThreadPoolExecutor
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
DATA = Path(os.environ.get("DATA_DIR") or ROOT / "data")
IMG_DIR = DATA / "img"
SHEET_ID = "1zLZYqlRMpLiTZhsZIVwFC-4T3SezFE6HqMUcQO0ZmKY"
CAMPAIGN_PREFIX = "2027"
UA = {"User-Agent": "Mozilla/5.0 (QA anuncios NODS)"}

MESES = {"enero": 1, "febrero": 2, "marzo": 3, "abril": 4, "mayo": 5, "junio": 6, "julio": 7,
         "agosto": 8, "septiembre": 9, "setiembre": 9, "octubre": 10, "noviembre": 11, "diciembre": 12}

# Nombres en español (como aparecen en Ads Manager) de las mejoras automáticas
ENHANCEMENT_LABELS = {
    "standard_enhancements": "Mejoras estándar",
    "reveal_details_over_time": "Mostrar detalles progresivamente",
    "show_destination_blurbs": "Fragmentos del sitio de destino",
    "product_extensions": "Agregar elementos del catálogo",
    "image_brightness_and_contrast": "Ajustar brillo y contraste",
    "inline_comment": "Comentarios relevantes",
    "show_summary": "Mostrar resumen",
    "translate_voiceover": "Traducir voz en off",
    "ads_with_benefits": "Mostrar beneficios",
    "image_uncrop": "Expandir imagen",
    "image_touchups": "Retoques de imagen",
    "image_animation": "Animación de imagen",
    "image_templates": "Plantillas de imagen",
    "text_optimizations": "Optimizaciones de texto",
    "text_translation": "Traducción de texto",
    "enhance_cta": "Mejorar CTA",
    "video_auto_crop": "Recorte automático de video",
    "video_uncrop": "Expandir video",
    "music_generation": "Música generada",
    "advantage_plus_creative": "Advantage+ creative",
    "site_extensions": "Extensiones del sitio",
    "contextual_multi_ads": "Anuncios de varios anunciantes",
}


# ---------------------------------------------------------------- utilidades
ENV_KEYS = ("META_ACCESS_TOKEN", "META_API_VERSION", "META_AD_ACCOUNT_ID", "ANTHROPIC_API_KEY")


def load_env():
    """Variables del archivo .env (uso local) y, por encima, las del entorno (Railway)."""
    env = {}
    f = ROOT / ".env"
    if f.exists():
        for line in f.read_text(encoding="utf-8-sig").splitlines():
            line = line.strip()
            if line and not line.startswith("#") and "=" in line:
                k, v = line.split("=", 1)
                env[k.strip()] = v.strip().strip('"').strip("'")
    env.update({k: os.environ[k] for k in ENV_KEYS if os.environ.get(k)})
    return env


def norm(s):
    s = unicodedata.normalize("NFC", s or "").replace("’", "'").replace(" ", " ")
    return re.sub(r"\s+", " ", s).strip()


def strip_discount(copy):
    """Saca la frase de descuento del copy para comparar el resto contra el sheet."""
    parts = [p for p in re.split(r"(?<=[.!?¡])\s+|\n+", copy or "") if p.strip()]
    keep = [p for p in parts if not re.search(r"\d{1,2}\s*%", p)]
    return norm(" ".join(keep))


def digits(s):
    return re.sub(r"\D", "", s or "")


class Meta:
    def __init__(self, env):
        self.tok = env["META_ACCESS_TOKEN"]
        self.ver = env.get("META_API_VERSION", "v24.0")
        self.acct = env["META_AD_ACCOUNT_ID"]

    def _get(self, url, tries=4):
        for attempt in range(tries):
            try:
                with urllib.request.urlopen(url, timeout=120) as r:
                    return json.load(r)
            except urllib.error.HTTPError as e:
                body = e.read().decode("utf-8", "replace").replace(self.tok, "<TOKEN>")
                if e.code >= 500 and attempt < tries - 1:
                    # "reduce the amount of data": reintentar pidiendo páginas más chicas
                    m = re.search(r"([?&]limit=)(\d+)", url)
                    if m and int(m.group(2)) > 10:
                        url = url.replace(m.group(0), f"{m.group(1)}{max(10, int(m.group(2)) // 2)}")
                    time.sleep(3 * (attempt + 1))
                    continue
                limited = ("too many calls" in body.lower() or "request limit" in body.lower()
                           or '"is_transient":true' in body)
                if limited and attempt < tries - 1:
                    time.sleep(90 * (attempt + 1))  # límite de llamadas de Meta: esperar y reintentar
                    continue
                raise RuntimeError(f"Meta API {e.code}: {body[:400]}") from None

    def get(self, path, **params):
        params["access_token"] = self.tok
        return self._get(f"https://graph.facebook.com/{self.ver}/{path}?" + urllib.parse.urlencode(params))

    def get_all(self, path, **params):
        params["access_token"] = self.tok
        url = f"https://graph.facebook.com/{self.ver}/{path}?" + urllib.parse.urlencode(params)
        out = []
        while url:
            r = self._get(url)
            out += r.get("data", [])
            url = r.get("paging", {}).get("next")
        return out


SHEET_TABS = {"Estructura 2027": "1013302865", "Creatividad 2027": "781640815"}


def read_sheet(tab, header_col, header_text="Sigla"):
    """Exporta la pestaña completa (ignora filtros aplicados en el sheet) y devuelve las
    filas desde el encabezado (la fila cuya columna header_col dice 'Sigla')."""
    url = f"https://docs.google.com/spreadsheets/d/{SHEET_ID}/export?format=csv&gid={SHEET_TABS[tab]}"
    with urllib.request.urlopen(url, timeout=60) as r:
        rows = list(csv.reader(io.StringIO(r.read().decode("utf-8"))))
    for i, row in enumerate(rows[:10]):
        if len(row) > header_col and row[header_col].strip() == header_text:
            return rows[i:]
    raise RuntimeError(f"No encontré el encabezado '{header_text}' en la pestaña {tab}")


def download(url, dest):
    if dest.exists():
        return dest
    req = urllib.request.Request(url, headers=UA)
    with urllib.request.urlopen(req, timeout=60) as r:
        dest.write_bytes(r.read())
    return dest


def video_frames(mp4_url, video_id):
    """Descarga el video y arma una lámina con 6 fotogramas (inicio → cierre) para leerla."""
    import subprocess
    import imageio_ffmpeg
    out = IMG_DIR / f"frames_{video_id}.jpg"
    if out.exists():
        return out
    vdir = DATA / "video"
    vdir.mkdir(exist_ok=True)
    mp4 = download(mp4_url, vdir / f"{video_id}.mp4")
    ffmpeg = imageio_ffmpeg.get_ffmpeg_exe()
    _, dur = imageio_ffmpeg.count_frames_and_secs(str(mp4))
    tmp = vdir / f"{video_id}_f"
    tmp.mkdir(exist_ok=True)
    times = [dur * f for f in (0.08, 0.25, 0.42, 0.6, 0.78)] + [max(dur - 0.6, 0)]
    for n, t in enumerate(times, 1):
        subprocess.run([ffmpeg, "-y", "-loglevel", "error", "-ss", f"{t:.2f}", "-i", str(mp4),
                        "-frames:v", "1", "-vf", "scale=480:-2", str(tmp / f"f{n}.jpg")], check=True)
    subprocess.run([ffmpeg, "-y", "-loglevel", "error", "-i", str(tmp / "f%d.jpg"),
                    "-vf", "tile=3x2:padding=8:color=white", "-frames:v", "1", str(out)], check=True)
    return out


def preview_mp4(meta, ad_id, placement):
    """URL del MP4 tomada de la vista previa del anuncio (para videos que no están en la biblioteca)."""
    fmt = "INSTAGRAM_STORY" if placement == "Stories y Reels" else "MOBILE_FEED_STANDARD"
    body = (meta.get(f"{ad_id}/previews", ad_format=fmt).get("data") or [{}])[0].get("body", "")
    m = re.search(r'src="([^"]+)"', body)
    if not m:
        return None
    req = urllib.request.Request(m.group(1).replace("&amp;", "&"), headers=UA)
    page = urllib.request.urlopen(req, timeout=60).read().decode("utf-8", "replace")
    found = []
    for raw in re.findall(r'https:(?:\\/|/)(?:[^"\s\\]|\\.)+?\.mp4(?:[^"\s\\]|\\.)*', page):
        try:
            found.append(json.loads(f'"{raw}"').replace("&amp;", "&"))
        except ValueError:
            continue
    found.sort(key=lambda u: "dash" in u)  # preferir el MP4 progresivo (audio + video) al segmento DASH
    return found[0] if found else None


def check_landing(url):
    try:
        req = urllib.request.Request(url, headers=UA)
        with urllib.request.urlopen(req, timeout=20) as r:
            return {"status": r.status, "final_url": r.geturl()}
    except urllib.error.HTTPError as e:
        return {"status": e.code, "final_url": url}
    except Exception as e:  # timeout, DNS, SSL
        return {"status": 0, "final_url": url, "error": str(e)[:120]}


# ---------------------------------------------------------------- planificación
def load_plan():
    est, cre = read_sheet("Estructura 2027", 0), read_sheet("Creatividad 2027", 4)
    m = re.search(r"(\d{1,2})\s*%", " ".join(cre[0]))
    discount = m.group(1) if m else "35"
    programs = {}
    for r in est[1:]:
        sig = r[0].strip().upper()
        if not sig:
            continue
        inicio = None
        if re.match(r"\d{2}/\d{2}/\d{4}", r[4].strip()):
            d, mo, y = r[4].strip().split("/")
            inicio = f"{y}-{mo}-{d}"
        programs[sig] = {
            "sigla": sig, "programa": r[1].strip(), "estado_estructura": r[6].strip(),
            "modalidad": r[7].strip(), "inicio": inicio, "landing": r[8].strip(),
            "paises": [c for c, ok in (("CL", r[9] == "TRUE"), ("PE", r[10] == "TRUE")) if ok],
            "creatividad": None,
        }
    for r in cre[1:]:
        sig = r[4].strip().upper()
        if not sig:
            continue
        row = {"version": r[3].strip(), "estado": r[13].strip(), "check_px": r[14].strip(),
               "precio_lista": r[6].strip(), "precio_dcto": r[7].strip(),
               "usd_lista": r[8].strip(), "usd_dcto": r[9].strip(), "copy": r[15].strip(),
               "url_base": r[17].strip(), "ref": r[18].split("=", 1)[-1].strip(),
               "utm_source": r[19].split("=", 1)[-1].strip(), "utm_medium": r[20].split("=", 1)[-1].strip(),
               "utm_campaign": r[21].split("=", 1)[-1].strip(), "link_final": r[23].strip(),
               "observaciones": r[12].strip()}
        programs.setdefault(sig, {"sigla": sig, "programa": r[2].strip(), "estado_estructura": "",
                                  "modalidad": r[5].strip(), "inicio": None, "landing": "",
                                  "paises": [], "creatividad": None})
        programs[sig]["creatividad"] = row
    for p in programs.values():
        c = p["creatividad"]
        listo = (p["estado_estructura"] == "Pauta Activa" and bool(c)
                 and c["estado"].lower().startswith("implementad"))
        # sin landing en Estructura todavía no nos compartieron la URL: no se puede activar
        p["esperando_url"] = listo and not p["landing"]
        p["debe_correr"] = listo and bool(p["landing"])
    return programs, discount


# ---------------------------------------------------------------- anuncios
CREATIVE_FIELDS = ("id,body,title,object_type,thumbnail_url,image_url,image_hash,video_id,"
                   "object_story_spec,asset_feed_spec,degrees_of_freedom_spec,contextual_multi_ads")


def ad_sigla(name, campaign, programs):
    for txt in (name, campaign):
        for tok in re.split(r"[\s\-–|_]+", (txt or "").upper()):
            if tok.strip() in programs:
                return tok.strip()
    return None


def ad_format(name):
    n = name.lower()
    if "video" in n:
        return "video"
    if "img" in n or "imagen" in n:
        return "img"
    return "?"


def placement_of(rule):
    spec = rule.get("customization_spec", {})
    pos = (spec.get("facebook_positions", []) + spec.get("instagram_positions", []))
    if any(p in ("story", "reels", "facebook_reels", "profile_reels") for p in pos):
        return "Stories y Reels"
    return "Feed y resto"


def build_variants(cr):
    """Versiones del anuncio: [{ubicacion, copy, titulo, url, image_hash, video_id, thumb}]"""
    out = []
    oss = cr.get("object_story_spec") or {}
    afs = cr.get("asset_feed_spec")
    if afs:
        by_label = {}
        for kind, items in (("body", afs.get("bodies", [])), ("title", afs.get("titles", [])),
                            ("link", afs.get("link_urls", [])), ("image", afs.get("images", [])),
                            ("video", afs.get("videos", []))):
            for it in items:
                for lab in it.get("adlabels", []) or []:
                    by_label[lab["id"]] = (kind, it)
        rules = afs.get("asset_customization_rules") or []
        if rules:
            for rule in sorted(rules, key=lambda r: r.get("priority", 99)):
                def pick(key):
                    lab = rule.get(key) or {}
                    return by_label.get(lab.get("id"), (None, {}))[1]
                img, vid = pick("image_label"), pick("video_label")
                out.append({"ubicacion": placement_of(rule), "copy": pick("body_label").get("text", ""),
                            "titulo": pick("title_label").get("text", ""),
                            "url": pick("link_url_label").get("website_url"),
                            "image_hash": img.get("hash"), "video_id": vid.get("video_id"),
                            "thumb": vid.get("thumbnail_url")})
        else:
            bodies = afs.get("bodies") or [{}]
            links = afs.get("link_urls") or [{}]
            media = (afs.get("images") or []) + (afs.get("videos") or []) or [{}]
            for i, m in enumerate(media):
                out.append({"ubicacion": "Todas" if len(media) == 1 else f"Versión {i + 1}",
                            "copy": bodies[min(i, len(bodies) - 1)].get("text", ""),
                            "titulo": ((afs.get("titles") or [{}])[0]).get("text", ""),
                            "url": links[min(i, len(links) - 1)].get("website_url"),
                            "image_hash": m.get("hash"), "video_id": m.get("video_id"),
                            "thumb": m.get("thumbnail_url")})
    for key in ("link_data", "video_data"):
        d = oss.get(key)
        if not d:
            continue
        cta_link = ((d.get("call_to_action") or {}).get("value") or {}).get("link")
        children = d.get("child_attachments") or []
        if children:
            for i, ch in enumerate(children):
                out.append({"ubicacion": f"Tarjeta {i + 1}", "copy": d.get("message", ""), "titulo": ch.get("name", ""),
                            "url": ch.get("link"), "image_hash": ch.get("image_hash"),
                            "video_id": ch.get("video_id"), "thumb": ch.get("picture")})
        else:
            out.append({"ubicacion": "Todas", "copy": d.get("message", ""),
                        "titulo": d.get("name") or d.get("title", ""), "url": d.get("link") or cta_link,
                        "image_hash": d.get("image_hash"), "video_id": d.get("video_id"),
                        "thumb": d.get("image_url") or d.get("picture")})
    if not out:
        out.append({"ubicacion": "Todas", "copy": cr.get("body", ""), "titulo": cr.get("title", ""),
                    "url": None, "image_hash": cr.get("image_hash"), "video_id": cr.get("video_id"),
                    "thumb": cr.get("thumbnail_url")})
    return out


def enhancements(cr):
    res = []
    for f, v in ((cr.get("degrees_of_freedom_spec") or {}).get("creative_features_spec") or {}).items():
        if v.get("enroll_status") == "OPT_IN":
            res.append({"key": f, "label": ENHANCEMENT_LABELS.get(f, f.replace("_", " "))})
    if (cr.get("contextual_multi_ads") or {}).get("enroll_status") == "OPT_IN":
        res.append({"key": "contextual_multi_ads", "label": ENHANCEMENT_LABELS["contextual_multi_ads"]})
    return res


def promo_deadline(text, today):
    """Detecta 'hasta el 30 de noviembre' y devuelve la fecha (año actual o siguiente)."""
    m = re.search(r"hasta el (\d{1,2}) de (\w+)", (text or "").lower())
    if not m or m.group(2) not in MESES:
        return None
    day, month = int(m.group(1)), MESES[m.group(2)]
    for year in (today.year, today.year + 1):
        try:
            d = dt.date(year, month, day)
        except ValueError:
            return None
        if (d - today).days > -200:
            return d
    return None


# ---------------------------------------------------------------- reporte
def run(progress=lambda msg: None, use_api=True):
    env = load_env()
    meta = Meta(env)
    am = f"https://www.facebook.com/adsmanager/manage/ads/edit?act={meta.acct}&selected_ad_ids="
    camp_link = f"https://www.facebook.com/adsmanager/manage/campaigns?act={meta.acct}&selected_campaign_ids="
    today = dt.date.today()
    IMG_DIR.mkdir(parents=True, exist_ok=True)

    progress("Leyendo el sheet de planificación")
    programs, discount = load_plan()

    progress("Leyendo anuncios de Meta")
    ads = meta.get_all(
        f"act_{meta.acct}/ads", limit=40,
        fields=("id,name,effective_status,created_time,campaign{id,name,effective_status},"
                "adset{id,name,effective_status,targeting,end_time},"
                f"creative.thumbnail_width(600).thumbnail_height(600){{{CREATIVE_FIELDS}}}"),
        filtering=json.dumps([{"field": "campaign.name", "operator": "CONTAIN", "value": CAMPAIGN_PREFIX}]))
    ads = [a for a in ads if a["campaign"]["name"].strip().startswith(CAMPAIGN_PREFIX)]

    progress("Leyendo gasto de los últimos 7 días")
    spend = {x["ad_id"]: float(x.get("spend", 0)) for x in meta.get_all(
        f"act_{meta.acct}/insights", level="ad", fields="ad_id,spend", date_preset="last_7d", limit=500,
        filtering=json.dumps([{"field": "campaign.name", "operator": "CONTAIN", "value": CAMPAIGN_PREFIX}]))}

    # imágenes por hash
    hashes = set()
    for a in ads:
        for v in build_variants(a.get("creative") or {}):
            if v["image_hash"]:
                hashes.add(v["image_hash"])
    img_urls = {}
    hl = sorted(hashes)
    for i in range(0, len(hl), 50):
        for im in meta.get_all(f"act_{meta.acct}/adimages", hashes=json.dumps(hl[i:i + 50]), fields="hash,url"):
            img_urls[im["hash"]] = im["url"]

    progress("Revisando landings")
    urls = set()
    for a in ads:
        if a["effective_status"] == "ACTIVE":
            for v in build_variants(a.get("creative") or {}):
                if v["url"]:
                    urls.add(v["url"])
    with ThreadPoolExecutor(8) as ex:
        landing = dict(zip(urls, ex.map(check_landing, urls)))

    issues = []

    def issue(control, sev, ad, sigla, detalle, campo=None):
        issues.append({"control": control, "severidad": sev, "ad_id": ad["id"] if ad else "",
                       "ad_name": ad["name"] if ad else "", "sigla": sigla or "",
                       "detalle": detalle, "campo": campo,
                       "link": am + ad["id"] if ad else "",
                       "gasto7d": round(spend.get(ad["id"], 0)) if ad else 0})

    out_ads = []
    by_sigla = defaultdict(list)
    progress("Aplicando controles")
    for a in ads:
        cr = a.get("creative") or {}
        sig = ad_sigla(a["name"], a["campaign"]["name"], programs)
        fmt = ad_format(a["name"])
        active = a["effective_status"] == "ACTIVE"
        geo = (a["adset"].get("targeting") or {}).get("geo_locations") or {}
        variants = build_variants(cr)
        for v in variants:
            v["image_url"] = img_urls.get(v["image_hash"]) if v["image_hash"] else None
            if not v["image_url"] and v.get("video_id"):
                v["image_url"] = cr.get("thumbnail_url") if len(variants) == 1 else v.get("thumb")
            if not v["image_url"]:
                v["image_url"] = cr.get("thumbnail_url")
            v["local_img"] = None
            if v["image_url"]:
                key = re.sub(r"\W", "", v["image_hash"] or f"{a['id']}_{variants.index(v)}")
                try:
                    v["local_img"] = "img/" + download(v["image_url"], IMG_DIR / f"{key}.jpg").name
                except Exception:
                    pass
        row = {"id": a["id"], "name": a["name"], "sigla": sig, "formato": fmt,
               "estado": a["effective_status"], "campana": a["campaign"]["name"],
               "campana_id": a["campaign"]["id"], "estado_campana": a["campaign"].get("effective_status", ""),
               "conjunto": a["adset"]["name"], "paises": geo.get("countries", []),
               "creado": a.get("created_time", "")[:10], "gasto7d": round(spend.get(a["id"], 0)),
               "link": am + a["id"], "variantes": variants, "mejoras": enhancements(cr),
               "checks": {}}
        out_ads.append(row)
        if sig:
            by_sigla[sig].append(row)
        if not active:
            if a["effective_status"] in ("DISAPPROVED", "WITH_ISSUES"):
                issue("Alertas", "error", a, sig, f"Anuncio {a['effective_status']} en Meta")
            continue

        p = programs.get(sig) if sig else None
        c = (p or {}).get("creatividad") or {}
        ck = row["checks"]

        # 1. programa
        if not sig:
            ck["programa"] = "error"
            issue("Programas", "error", a, None, "No se reconoce la sigla del programa en el nombre del anuncio")
        elif not p["debe_correr"]:
            ck["programa"] = "error"
            issue("Programas", "error", a, sig,
                  f"Activo pero no debería: Estructura = '{p['estado_estructura'] or '—'}', "
                  f"Creatividad = '{(c.get('estado') or 'sin fila')}'")
        else:
            ck["programa"] = "ok"

        # 2. país (por conjunto: no puede segmentar países fuera del plan)
        if p:
            got, exp = set(row["paises"]), set(p["paises"])
            extra = got - exp
            ck["pais"] = "ok"
            if extra:
                ck["pais"] = "error"
                issue("País", "error", a, sig, f"Segmenta {', '.join(sorted(extra))} y el plan no lo incluye "
                                               f"(conjunto '{row['conjunto']}')")
            if not got and geo:
                ck["pais"] = "warn"
                issue("País", "warn", a, sig, f"Segmentación por regiones/ciudades, revisar: {list(geo)}")

        # 3. contenido
        if c:
            exp_copy = norm(c["copy"])
            ck["copy"] = ck["url"] = ck["descuento"] = "ok"
            for v in variants:
                body = v["copy"] or ""
                where = f" ({v['ubicacion']})" if len(variants) > 1 else ""
                if exp_copy and strip_discount(body) != strip_discount(exp_copy):
                    if exp_copy not in norm(body):
                        ck["copy"] = "error"
                        issue("Copy", "error", a, sig, f"El copy{where} no coincide con Creatividad 2027", "copy")
                if f"{discount}%" not in body.replace(" %", "%"):
                    ck["descuento"] = "error"
                    issue("Descuento", "error", a, sig, f"El copy{where} no menciona el {discount}% de descuento")
                dl = promo_deadline(body, today)
                if dl and dl < today:
                    ck["descuento"] = "error"
                    issue("Descuento", "error", a, sig, f"El copy{where} promete un plazo vencido ({dl:%d/%m/%Y})")
                url = v["url"]
                if not url:
                    ck["url"] = "error"
                    issue("URL", "error", a, sig, f"Sin URL de destino{where}")
                    continue
                u = urllib.parse.urlparse(url)
                q = dict(urllib.parse.parse_qsl(u.query))
                errs, warns = [], []
                base_got = f"{u.scheme}://{u.netloc}{u.path}".rstrip("/")
                if c["url_base"] and base_got != c["url_base"].rstrip("/"):
                    errs.append(f"landing {base_got} (esperada {c['url_base']})")
                for k in ("ref", "utm_source", "utm_medium", "utm_campaign"):
                    if c[k] and q.get(k) != c[k]:
                        errs.append(f"{k}={q.get(k) or '—'} (esperado {c[k]})")
                term = q.get("utm_term") or ""
                if fmt == "img" and term != "img":
                    errs.append(f"utm_term={term or '—'} (esperado img)")
                elif fmt == "video" and not term.startswith("video"):
                    errs.append(f"utm_term={term or '—'} (esperado video)")
                elif fmt == "video" and term != "video":
                    warns.append(f"utm_term={term} (el sheet usa 'video')")
                lnd = landing.get(url)
                if lnd and (lnd["status"] >= 400 or lnd["status"] == 0):
                    errs.append(f"la landing responde {lnd['status'] or 'sin conexión'}")
                elif lnd and urllib.parse.urlparse(lnd["final_url"]).path.rstrip("/") != u.path.rstrip("/"):
                    warns.append(f"la landing redirige a {lnd['final_url'][:90]}")
                if errs:
                    ck["url"] = "error"
                    issue("URL", "error", a, sig, f"URL{where}: " + "; ".join(errs), "url")
                if warns:
                    ck["url"] = ck["url"] if ck["url"] == "error" else "warn"
                    issue("URL", "warn", a, sig, f"URL{where}: " + "; ".join(warns), "url")
            # consistencia entre ubicaciones: mismo programa, copy y landing en Stories/Reels y Feed
            if len(variants) > 1:
                ck["ubicaciones"] = "ok"
                paths = {urllib.parse.urlparse(v["url"] or "").path.rstrip("/") for v in variants}
                copies = {strip_discount(v["copy"]) for v in variants}
                titles = {norm(v["titulo"]) for v in variants}
                for label, vals in (("landing", paths), ("copy", copies), ("título", titles)):
                    if len(vals) > 1:
                        ck["ubicaciones"] = "error"
                        issue("Ubicaciones", "error", a, sig,
                              f"El {label} no es el mismo en todas las ubicaciones "
                              f"({' / '.join(v['ubicacion'] for v in variants)})")
            if not any(v["ubicacion"] == "Stories y Reels" for v in variants) and len(variants) == 1:
                issue("Alertas", "warn", a, sig, "Sin pieza específica para Stories y Reels (una sola versión para todo)")

        # 4. mejoras automáticas
        ck["mejoras"] = "error" if row["mejoras"] else "ok"
        if row["mejoras"]:
            issue("Mejoras automáticas", "error", a, sig, ", ".join(m["label"] for m in row["mejoras"]))

        # alertas de entrega
        created = a.get("created_time", "")[:10]
        if created and (today - dt.date.fromisoformat(created)).days >= 3 and spend.get(a["id"], 0) == 0:
            issue("Alertas", "warn", a, sig, "Activo hace 3 días o más y sin gasto en los últimos 7 días")

    # fotogramas de los videos activos
    progress("Extrayendo fotogramas de los videos")
    video_jobs = [(a, v) for a in out_ads if a["estado"] == "ACTIVE" for v in a["variantes"] if v.get("video_id")]
    if any(not (IMG_DIR / f"frames_{v['video_id']}.jpg").exists() for _, v in video_jobs):
        sources = {x["id"]: x.get("source") for x in meta.get_all(f"act_{meta.acct}/advideos", fields="id,source", limit=100)}
    else:
        sources = {}
    if video_jobs:

        def frames(job):
            a, v = job
            try:
                if not (IMG_DIR / f"frames_{v['video_id']}.jpg").exists():
                    url = sources.get(v["video_id"]) or preview_mp4(meta, a["id"], v["ubicacion"])
                    if not url:
                        return
                    video_frames(url, v["video_id"])
                v["frames_img"] = f"img/frames_{v['video_id']}.jpg"
            except Exception as e:
                v["frames_error"] = str(e)[:120]

        with ThreadPoolExecutor(4) as ex:
            list(ex.map(frames, video_jobs))

    # lectura de piezas (precio y programa): cache + API si hay key; lo demás queda pendiente
    progress("Leyendo piezas")
    import vision
    vision_info = vision.apply(out_ads, programs, discount, issue,
                               api_key=env.get("ANTHROPIC_API_KEY") if use_api else None)

    # programas
    out_programs = []
    for sig, p in sorted(programs.items()):
        rows = by_sigla.get(sig, [])
        act = [r for r in rows if r["estado"] == "ACTIVE"]
        if not p["debe_correr"] and not act and not p["esperando_url"]:
            continue
        if p["esperando_url"] and not act:
            estado = "sin_landing"
        else:
            estado = "ok" if (p["debe_correr"] and act) else ("pausado" if p["debe_correr"] and rows else
                                                            "sin_anuncios" if p["debe_correr"] else "sobra")
        got = sorted({c for r in act for c in r["paises"]})
        if p["debe_correr"]:
            if not act and rows:
                camps = {}
                for r in rows:
                    camps.setdefault(r["campana_id"], r)
                for cid, r in camps.items():
                    estado = {"PAUSED": "pausada", "CAMPAIGN_PAUSED": "pausada", "ARCHIVED": "archivada",
                              "ADSET_PAUSED": "activa pero con los conjuntos pausados"}.get(
                        r["estado_campana"] if r["estado_campana"] != "ACTIVE" else r["estado"], "sin anuncios activos")
                    issues.append({"control": "Programas", "severidad": "error", "ad_id": "", "ad_name": "",
                                   "campaign_id": cid, "campaign_name": r["campana"], "sigla": sig,
                                   "detalle": f"El programa debería estar en pauta y la campaña está {estado}",
                                   "campo": None, "link": camp_link + cid, "gasto7d": 0})
            elif not rows:
                issues.append({"control": "Programas", "severidad": "error", "ad_id": "", "ad_name": "", "sigla": sig,
                               "detalle": "Debería estar activo y no tiene anuncios 2027 creados", "campo": None,
                               "link": "", "gasto7d": 0})
            missing = sorted(set(p["paises"]) - set(got))
            if act and missing:
                for r in act:
                    issues.append({"control": "País", "severidad": "error", "ad_id": r["id"], "ad_name": r["name"],
                                   "sigla": sig, "detalle": f"El programa debe salir también en {', '.join(missing)} "
                                                            f"y ningún conjunto activo lo segmenta",
                                   "campo": None, "link": r["link"], "gasto7d": r["gasto7d"]})
                    r["checks"]["pais"] = "error"
            if p["inicio"] and p["inicio"] < today.isoformat():
                issues.append({"control": "Alertas", "severidad": "warn", "ad_id": "", "ad_name": "", "sigla": sig,
                               "detalle": f"La fecha de inicio del sheet ({p['inicio']}) ya pasó", "campo": None,
                               "link": "", "gasto7d": 0})
        out_programs.append({**{k: p[k] for k in ("sigla", "programa", "estado_estructura", "inicio", "paises",
                                                  "debe_correr", "esperando_url", "landing")},
                             "estado": estado, "paises_meta": got, "anuncios": len(act),
                             "anuncios_total": len(rows), "gasto7d": sum(r["gasto7d"] for r in act),
                             "creatividad": p["creatividad"]})

    seen, uniq = set(), []
    for i in issues:
        k = (i["control"], i["ad_id"], i.get("campaign_id"), i["sigla"], i["detalle"])
        if k not in seen:
            seen.add(k)
            uniq.append(i)
    report = {"generado": dt.datetime.now().isoformat(timespec="seconds"), "cuenta": meta.acct,
              "descuento_vigente": discount, "programas": out_programs,
              "anuncios": out_ads, "issues": uniq, "vision": vision_info}
    (DATA / "report.json").write_text(json.dumps(report, ensure_ascii=False, indent=1), encoding="utf-8")
    progress("Listo")
    return report


if __name__ == "__main__":
    import sys
    r = run(progress=print, use_api="--sin-api" not in sys.argv)
    v = r["vision"]
    print(f"{len(r['anuncios'])} anuncios, {len(r['issues'])} observaciones; "
          f"piezas leídas {v['leidas']}, pendientes {v['pendientes']} (ver data/pending_vision.json)")
