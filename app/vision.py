"""Lectura de piezas: verifica que la imagen (o los fotogramas del video) sea del
programa y que el precio sobre la pieza sea el de Creatividad 2027.

Los resultados se guardan en data/vision_cache.json por imagen + sigla. Cada pieza
se lee una sola vez, de dos formas posibles:
  · con la API de Anthropic, si hay ANTHROPIC_API_KEY en .env;
  · si no, queda en data/pending_vision.json y la lee Claude (tarea diaria):
      python app/vision.py dividir 4        → data/vision_batch_<i>.json
      (Claude escribe data/vision_batch_<i>_result.json)
      python app/vision.py guardar-lotes    → suma los resultados al cache
"""
import base64
import json
import re
import sys
from concurrent.futures import ThreadPoolExecutor
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
from qa_engine import DATA, digits  # noqa: E402

MODEL = "claude-opus-5-5"
CACHE = DATA / "vision_cache.json"
PENDING = DATA / "pending_vision.json"

SCHEMA = {
    "type": "object",
    "properties": {
        "programa_en_pieza": {"type": "string", "description": "Nombre del programa tal como aparece en la pieza, o '' si no aparece"},
        "coincide_programa": {"type": "boolean"},
        "precios": {"type": "array", "items": {"type": "string"}, "description": "Todos los precios visibles, tal cual"},
        "descuentos": {"type": "array", "items": {"type": "string"}, "description": "Porcentajes de descuento visibles, ej. '35%'"},
        "fechas_o_plazos": {"type": "array", "items": {"type": "string"}},
        "texto_principal": {"type": "string", "description": "Texto principal de la pieza, resumido"},
        "observaciones": {"type": "string", "description": "Problemas visibles: errores de tipeo, textos cortados, otro programa, etc."},
    },
    "required": ["programa_en_pieza", "coincide_programa", "precios", "descuentos",
                 "fechas_o_plazos", "texto_principal", "observaciones"],
    "additionalProperties": False,
}

PROMPT = """Sos el control de calidad de anuncios de Educación Profesional de Ingeniería UC.
{tipo}
Extraé lo que se ve escrito en ella.

Programa que debería promocionar: «{programa}» (sigla {sigla}).
Respondé coincide_programa=true solo si la pieza promociona ese programa (el nombre puede estar
abreviado o partido en líneas). Transcribí los precios y porcentajes exactamente como aparecen.
Si un dato no aparece en la pieza, dejá la lista vacía o el texto vacío; no lo inventes."""
TIPO_IMG = "Mirá la pieza publicitaria (imagen)."
TIPO_VIDEO = ("La imagen es una lámina con 6 fotogramas del video publicitario, en orden de izquierda a "
              "derecha y de arriba abajo; el último es el cierre del video. Tomá en cuenta todos los fotogramas. "
              "Los videos son generales: no llevan precio ni fecha, así que no lo reportes como problema.")


SEED = Path(__file__).resolve().parent / "seed" / "vision_cache.json"


def load_cache():
    """Cache de lecturas; en un servidor nuevo arranca con las piezas ya leídas (seed)."""
    for f in (CACHE, SEED):
        try:
            return json.loads(f.read_text(encoding="utf-8"))
        except Exception:
            continue
    return {}


def _jobs(ads, programs):
    for ad in ads:
        if (ad["estado"] != "ACTIVE" and not ad.get("preparacion")) or not ad["sigla"] or ad["sigla"] not in programs:
            continue
        p = programs[ad["sigla"]]
        for v in ad["variantes"]:
            if v.get("ubicacion") == "Audience Network":
                continue  # la cuenta tiene Audience Network deshabilitado: esa pieza no se publica
            es_video = bool(v.get("video_id"))
            img = v.get("frames_img") if es_video else v.get("local_img")
            if img:
                yield ad, v, f"{img}|{ad['sigla']}", p, img, es_video


def _api_analyzer(api_key):
    import anthropic
    client = anthropic.Anthropic(api_key=api_key, max_retries=3)

    def analyze(path, programa, sigla, es_video):
        raw = Path(path).read_bytes()
        resp = client.beta.messages.create(
            model=MODEL,
            max_tokens=4000,
            betas=["server-side-fallback-2026-07-01"],
            fallbacks="default",
            output_config={"effort": "medium", "format": {"type": "json_schema", "schema": SCHEMA}},
            messages=[{"role": "user", "content": [
                {"type": "image", "source": {"type": "base64",
                                             "media_type": "image/png" if raw[:4] == b"\x89PNG" else "image/jpeg",
                                             "data": base64.standard_b64encode(raw).decode()}},
                {"type": "text", "text": PROMPT.format(tipo=TIPO_VIDEO if es_video else TIPO_IMG,
                                                       programa=programa, sigla=sigla)},
            ]}],
        )
        if resp.stop_reason == "refusal":
            raise RuntimeError("La IA no pudo analizar esta pieza")
        return json.loads(next(b.text for b in resp.content if b.type == "text"))

    def work(item):
        key, args = item
        try:
            return key, analyze(*args)
        except anthropic.AuthenticationError:
            return key, None
        except (anthropic.APIStatusError, anthropic.APIConnectionError, RuntimeError):
            return key, None

    return work


def apply(ads, programs, discount, issue, api_key=None):
    """Lee lo que falta (API) o lo deja pendiente, y aplica los resultados a los anuncios."""
    cache = load_cache()
    jobs = list(_jobs(ads, programs))
    todo = {key: (DATA / img, p["programa"], ad["sigla"], es_video)
            for ad, v, key, p, img, es_video in jobs if key not in cache}
    if api_key and todo:
        with ThreadPoolExecutor(4) as ex:
            for key, res in ex.map(_api_analyzer(api_key), todo.items()):
                if res:
                    cache[key] = res
        CACHE.write_text(json.dumps(cache, ensure_ascii=False, indent=1), encoding="utf-8")

    pending = {}
    for ad, v, key, p, img, es_video in jobs:
        res = cache.get(key)
        if not res:
            v["vision"] = {"pendiente": True}
            ad["checks"]["pieza"] = "na"
            c = p.get("creatividad") or {}
            pending[key] = {"key": key, "imagen": str(DATA / img), "tipo": "video" if es_video else "imagen",
                            "sigla": ad["sigla"], "programa": p["programa"],
                            "precios_sheet": [c.get("precio_lista"), c.get("precio_dcto")]}
            continue
        v["vision"] = res
        _evaluate(ad, v, res, p, discount, issue, es_video)
    _cross_placements(ads, issue)
    PENDING.write_text(json.dumps(list(pending.values()), ensure_ascii=False, indent=1), encoding="utf-8")
    return {"leidas": len({key for _, _, key, *_ in jobs if key in cache}), "pendientes": len(pending)}


def _evaluate(ad, v, res, p, discount, issue, es_video):
    c = p.get("creatividad") or {}
    discount = p.get("descuento") or discount  # descuento propio del programa (p. ej. DEIA 25%)
    dcto_txt = c.get("precio_dcto") or p.get("precio_dcto_calc") or ""
    ref = {"id": ad["id"], "name": ad["name"]}
    where = f" ({v['ubicacion']})" if len(ad["variantes"]) > 1 else ""
    fuente = "el video" if es_video else "la pieza"
    state = ad["checks"].get("pieza") if ad["checks"].get("pieza") in ("warn", "error") else "ok"
    # Messenger, Marketplace, columna derecha…: se marca para revisar, no como error
    grave = "warn" if secundaria(v) else "error"
    peor = lambda st: "error" if "error" in (st, grave) else "warn"
    if not res["coincide_programa"]:
        state = peor(state)
        issue("Pieza", grave, ref, ad["sigla"],
              f"{fuente.capitalize()}{where} no parece ser de {p['programa']} (dice: «{res['programa_en_pieza'] or '—'}»)", "pieza")
    esperados = {digits(c.get(k)) for k in ("precio_lista", "precio_dcto", "usd_lista", "usd_dcto")} | {digits(dcto_txt)}
    esperados -= {""}
    vistos = {digits(x) for x in res["precios"]} - {""}
    if vistos and esperados and vistos - esperados:
        state = peor(state)
        issue("Pieza", grave, ref, ad["sigla"],
              f"Precio en {fuente}{where}: {', '.join(res['precios'])}. En Creatividad 2027: "
              f"{c.get('precio_lista')} lista / {dcto_txt or '—'} con {discount}%", "pieza")
    elif not vistos and esperados and not es_video:
        state = "warn" if state == "ok" else state
        issue("Pieza", "warn", ref, ad["sigla"], f"No se ve el precio en {fuente}{where}", "pieza")
    otros = sorted({re.sub(r"\D", "", d) for d in res["descuentos"]} - {"", discount})
    if otros:
        state = peor(state)
        issue("Pieza", grave, ref, ad["sigla"],
              f"{fuente.capitalize()}{where} muestra {', '.join(o + '%' for o in otros)} y el descuento vigente es {discount}%", "pieza")
    obs = res.get("observaciones", "").strip()
    if es_video:
        obs = sin_precio_fecha(obs)
    if obs:
        state = "warn" if state == "ok" else state
        issue("Pieza", "warn", ref, ad["sigla"], f"Revisar {fuente}{where}: {obs}", "pieza")
    ad["checks"]["pieza"] = state


def secundaria(v):
    """Ubicación de bajo alcance (la pieza por defecto cuando hay regla de Feed, u otras sin Feed)."""
    return v.get("ubicacion", "").startswith("Otras ubicaciones")


def sin_precio_fecha(obs):
    """Los videos son generales: no llevan precio ni fecha. Quita de la observación las
    frases que solo dicen que faltan."""
    frases = re.split(r"(?<=[.;])\s+", obs)
    keep = [f for f in frases
            if not (re.search(r"precio|fecha|inicio|descuento", f, re.I)
                    and re.search(r"\b(sin|no (se )?(ve|ven|muestra|muestran|aparece|aparecen|hay))\b|ni ", f, re.I))]
    return " ".join(keep).strip()


def _cross_placements(ads, issue):
    """La pieza de Stories/Reels y la de Feed tienen que ser del mismo programa."""
    from difflib import SequenceMatcher
    simple = lambda s: re.sub(r"[^a-záéíóúñü0-9]", "", (s or "").lower())
    for ad in ads:
        read = [v for v in ad["variantes"] if isinstance(v.get("vision"), dict) and "coincide_programa" in v["vision"]]
        if len(read) < 2:
            continue
        ref = {"id": ad["id"], "name": ad["name"]}
        def distinto(vs):
            flags = {v["vision"]["coincide_programa"] for v in vs}
            names = [simple(v["vision"]["programa_en_pieza"]) for v in vs]
            return len(flags) > 1 or any(
                a and b and a not in b and b not in a and SequenceMatcher(None, a, b).ratio() < 0.6
                for i, a in enumerate(names) for b in names[i + 1:])
        if distinto(read):
            # si la diferencia está solo en ubicaciones secundarias, queda para revisar
            sev = "error" if distinto([v for v in read if not secundaria(v)]) else "warn"
            detalle = " / ".join(f"{v['ubicacion']}: «{v['vision']['programa_en_pieza'] or '—'}»" for v in read)
            issue("Ubicaciones", sev, ref, ad["sigla"], f"Las ubicaciones muestran programas distintos — {detalle}", "pieza")
            ad["checks"]["ubicaciones"] = sev


def merge(results):
    """Suma lecturas {key: resultado} al cache; devuelve cuántas eran nuevas."""
    cache = load_cache()
    nuevas = 0
    for key, r in results.items():
        if key.startswith("_") or not isinstance(r, dict) or not all(k in r for k in SCHEMA["required"]):
            continue
        if key not in cache:
            nuevas += 1
        cache[key] = {k: r[k] for k in SCHEMA["required"]}
    CACHE.parent.mkdir(parents=True, exist_ok=True)
    CACHE.write_text(json.dumps(cache, ensure_ascii=False, indent=1), encoding="utf-8")
    return nuevas


def guardar(path):
    """Suma al cache los resultados leídos por Claude: lista de {key, ...campos del SCHEMA}."""
    cache = load_cache()
    nuevos = json.loads(Path(path).read_text(encoding="utf-8"))
    ok = 0
    for r in nuevos:
        key = r.pop("key", None)
        if key and all(k in r for k in SCHEMA["required"]):
            cache[key] = {k: r[k] for k in SCHEMA["required"]}
            ok += 1
    CACHE.write_text(json.dumps(cache, ensure_ascii=False, indent=1), encoding="utf-8")
    print(f"{ok} resultados guardados ({len(nuevos) - ok} descartados por formato)")


def aplicar_offline():
    """Aplica el cache de lecturas al último data/report.json sin volver a consultar Meta."""
    path = DATA / "report.json"
    report = json.loads(path.read_text(encoding="utf-8"))
    report["issues"] = [i for i in report["issues"] if i["control"] != "Pieza" and i.get("campo") != "pieza"]
    programs = {p["sigla"]: p for p in report["programas"]}
    spend = {a["id"]: a["gasto7d"] for a in report["anuncios"]}
    links = {a["id"]: a["link"] for a in report["anuncios"]}

    prep = {a["id"]: a for a in report["anuncios"] if a.get("preparacion")}

    def issue(control, sev, ad, sigla, detalle, campo=None):
        if ad["id"] in prep:  # anuncio pausado en preparación: va a su checklist
            prep[ad["id"]].setdefault("preparacion_obs", []).append(
                {"control": control, "severidad": sev, "detalle": detalle})
            return
        report["issues"].append({"control": control, "severidad": sev, "ad_id": ad["id"], "ad_name": ad["name"],
                                 "sigla": sigla or "", "detalle": detalle, "campo": campo,
                                 "link": links.get(ad["id"], ""), "gasto7d": spend.get(ad["id"], 0)})

    for a in prep.values():
        a["preparacion_obs"] = [o for o in a.get("preparacion_obs", []) if o["control"] != "Pieza"]
    for ad in report["anuncios"]:
        ad["checks"].pop("pieza", None)
        if ad["checks"].get("ubicaciones") in ("warn", "error") and not any(
                i["ad_id"] == ad["id"] and i["control"] == "Ubicaciones" for i in report["issues"]):
            ad["checks"]["ubicaciones"] = "ok"
    report["vision"] = apply(report["anuncios"], programs, report["descuento_vigente"], issue)
    # recalcular "listo en Meta" de los programas pausados con las lecturas nuevas
    import datetime as dt
    import qa_engine
    today = dt.date.today()
    for p in report["programas"]:
        if p.get("meta_listo") is None:
            continue
        rows = [a for a in report["anuncios"] if a["sigla"] == p["sigla"]]
        ml = p["meta_listo"] = qa_engine.preparacion(rows, p, today)
        texto = (f" En Meta está todo listo: solo falta prender ({', '.join(ml['prender']) or 'activar'})." if ml["listo"]
                 else f" En Meta falta: {'; '.join(ml['falta'][:4])}{' …' if len(ml['falta']) > 4 else ''}.")
        for i in report["issues"]:
            if i["control"] == "Programas" and i["sigla"] == p["sigla"] and " En Meta " in i["detalle"]:
                i["detalle"] = i["detalle"].split(" En Meta ")[0] + texto
    seen, uniq = set(), []
    for i in report["issues"]:
        k = (i["control"], i["ad_id"], i.get("campaign_id"), i["detalle"])
        if k not in seen:
            seen.add(k)
            uniq.append(i)
    report["issues"] = uniq
    path.write_text(json.dumps(report, ensure_ascii=False, indent=1), encoding="utf-8")
    print(f"Reporte actualizado: {report['vision']}")


def dividir(n):
    """Parte data/pending_vision.json en n lotes data/vision_batch_<i>.json para leerlos en paralelo."""
    pend = json.loads(PENDING.read_text(encoding="utf-8")) if PENDING.exists() else []
    for old in DATA.glob("vision_batch_*.json"):
        old.unlink()
    size = -(-len(pend) // n) if pend else 0
    lotes = [pend[i * size:(i + 1) * size] for i in range(n)] if size else []
    for i, lote in enumerate((l for l in lotes if l), 1):
        (DATA / f"vision_batch_{i}.json").write_text(json.dumps(lote, ensure_ascii=False, indent=1), encoding="utf-8")
        print(DATA / f"vision_batch_{i}.json", len(lote))
    if not pend:
        print("No hay piezas pendientes")


def guardar_lotes():
    """Guarda todos los data/vision_batch_<i>_result.json y limpia los lotes."""
    for res in sorted(DATA.glob("vision_batch_*_result.json")):
        guardar(res)
    for f in DATA.glob("vision_batch_*.json"):
        f.unlink()


if __name__ == "__main__":
    if len(sys.argv) == 3 and sys.argv[1] == "guardar":
        guardar(sys.argv[2])
    elif len(sys.argv) == 3 and sys.argv[1] == "dividir":
        dividir(int(sys.argv[2]))
    elif len(sys.argv) == 2 and sys.argv[1] == "guardar-lotes":
        guardar_lotes()
    elif len(sys.argv) == 2 and sys.argv[1] == "aplicar":
        aplicar_offline()
    else:
        print(__doc__)
