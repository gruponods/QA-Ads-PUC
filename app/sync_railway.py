"""Envía las lecturas de piezas hechas en esta PC al tablero de Railway.

Necesita en .env:  RAILWAY_URL=https://<dominio>.up.railway.app  y  APP_PASSWORD=<la misma de Railway>
Uso:  python app/sync_railway.py
"""
import base64
import json
import sys
import urllib.error
import urllib.request

import qa_engine
import vision


def main():
    env = qa_engine.load_env()
    url, pwd = env.get("RAILWAY_URL", "").rstrip("/"), env.get("APP_PASSWORD", "")
    if not url or not pwd:
        print("Sin RAILWAY_URL o APP_PASSWORD en .env: no se sincroniza con Railway.")
        return 0
    cache = {k: v for k, v in vision.load_cache().items() if not k.startswith("_")}
    req = urllib.request.Request(
        f"{url}/api/vision-cache", data=json.dumps(cache, ensure_ascii=False).encode("utf-8"), method="POST",
        headers={"Content-Type": "application/json",
                 "Authorization": "Basic " + base64.b64encode(f"qa:{pwd}".encode()).decode()})
    try:
        with urllib.request.urlopen(req, timeout=120) as r:
            res = json.load(r)
    except urllib.error.HTTPError as e:
        print(f"Railway respondió {e.code}: {e.read().decode('utf-8', 'replace')[:200]}")
        return 1
    except urllib.error.URLError as e:
        print(f"No se pudo conectar con Railway: {e.reason}")
        return 1
    print(f"Enviadas {len(cache)} lecturas a Railway; {res.get('nuevas', 0)} eran nuevas allá.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
