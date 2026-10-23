"""Publica en Railway el reporte armado en esta PC y las imágenes que usa.

Railway no consulta Meta ni el sheet: muestra lo que se publica desde acá.
Necesita en .env:  RAILWAY_URL=https://<dominio>  y  APP_PASSWORD=<la misma de Railway>
Uso:  python app/publicar.py
"""
import base64
import io
import json
import sys
import urllib.error
import urllib.request
import zipfile

import qa_engine

LOTE_MB = 8  # tamaño máximo de cada envío de imágenes


def main():
    env = qa_engine.load_env()
    url, pwd = env.get("RAILWAY_URL", "").rstrip("/"), env.get("APP_PASSWORD", "")
    if not url or not pwd:
        print("Sin RAILWAY_URL o APP_PASSWORD en .env: no se publica en Railway.")
        return 0
    auth = {"Authorization": "Basic " + base64.b64encode(f"qa:{pwd}".encode()).decode()}

    def call(path, data=None, ctype="application/json"):
        req = urllib.request.Request(url + path, data=data, method="POST" if data is not None else "GET",
                                     headers={**auth, "Content-Type": ctype})
        with urllib.request.urlopen(req, timeout=300) as r:
            return json.load(r)

    report_path = qa_engine.DATA / "report.json"
    if not report_path.exists():
        print("No hay data/report.json para publicar.")
        return 1
    report = json.loads(report_path.read_text(encoding="utf-8"))
    try:
        # 1) imágenes que usa el reporte y que Railway todavía no tiene
        usadas = {v[k].split("/")[-1] for a in report["anuncios"] for v in a["variantes"]
                  for k in ("local_img", "frames_img") if v.get(k)}
        faltan = sorted(usadas - set(call("/api/publish/images")))
        enviadas, lote, size = 0, [], 0
        for name in faltan + [None]:
            f = qa_engine.IMG_DIR / name if name else None
            if f is not None and f.exists():
                lote.append(f)
                size += f.stat().st_size
            if lote and (name is None or size > LOTE_MB * 1e6):
                buf = io.BytesIO()
                with zipfile.ZipFile(buf, "w", zipfile.ZIP_STORED) as z:
                    for x in lote:
                        z.write(x, arcname=x.name)
                enviadas += call("/api/publish/images", buf.getvalue(), "application/zip")["guardadas"]
                lote, size = [], 0
        # 2) el reporte (al final, para que nunca apunte a imágenes que no están)
        res = call("/api/publish/report", json.dumps(report, ensure_ascii=False).encode("utf-8"))
    except urllib.error.HTTPError as e:
        print(f"Railway respondió {e.code}: {e.read().decode('utf-8', 'replace')[:200]}")
        return 1
    except urllib.error.URLError as e:
        print(f"No se pudo conectar con Railway: {e.reason}")
        return 1
    print(f"Publicado en Railway el reporte del {res.get('generado')} ({enviadas} imágenes nuevas).")
    return 0


if __name__ == "__main__":
    sys.exit(main())
