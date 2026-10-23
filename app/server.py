"""Servidor del tablero de QA.

Local (el "cerebro"):  python app/server.py --open   → http://127.0.0.1:8765
    Lee Meta y el sheet (botón Actualizar) y es donde corre la tarea diaria.

Railway (solo lectura):  python app/server.py         → usa $PORT y escucha en 0.0.0.0
    No llama a Meta ni al sheet. Muestra el último reporte que publicó la PC con
    `python app/publicar.py` (endpoints /api/publish/*, protegidos con APP_PASSWORD).

Variables de entorno en Railway:
  APP_PASSWORD   contraseña para ver el tablero y para publicar (usuario: cualquiera)
  DATA_DIR       carpeta persistente (volumen), ej. /data
"""
import base64
import hmac
import io
import json
import mimetypes
import os
import sys
import threading
import traceback
import webbrowser
import zipfile
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from urllib.parse import urlparse

import qa_engine

APP = Path(__file__).resolve().parent
WEB = APP / "web"
DS = qa_engine.ROOT / "design-system"
VIEWER = "PORT" in os.environ  # en Railway: solo muestra lo publicado
PORT = int(os.environ.get("PORT", 8765))
HOST = "0.0.0.0" if VIEWER else "127.0.0.1"
PASSWORD = os.environ.get("APP_PASSWORD", "")

state = {"running": False, "step": "", "error": None}
lock = threading.Lock()


def refresh(use_vision=True):
    if not lock.acquire(blocking=False):
        return
    state.update(running=True, step="Iniciando", error=None)
    try:
        qa_engine.run(progress=lambda s: state.update(step=s), use_api=use_vision)
    except Exception as e:
        traceback.print_exc()
        state["error"] = str(e)
    finally:
        state["running"] = False
        lock.release()


class Handler(BaseHTTPRequestHandler):
    def log_message(self, *a):
        pass

    def _send(self, code, body, ctype="application/json; charset=utf-8", headers=()):
        data = body if isinstance(body, bytes) else body.encode("utf-8")
        self.send_response(code)
        self.send_header("Content-Type", ctype)
        self.send_header("Cache-Control", "no-store")
        for k, v in headers:
            self.send_header(k, v)
        self.end_headers()
        self.wfile.write(data)

    def _authorized(self):
        if not PASSWORD:
            return True
        auth = self.headers.get("Authorization", "")
        if auth.startswith("Basic "):
            try:
                pwd = base64.b64decode(auth[6:]).decode("utf-8").split(":", 1)[1]
                if hmac.compare_digest(pwd, PASSWORD):
                    return True
            except Exception:
                pass
        self._send(401, '{"error":"no autorizado"}', headers=[("WWW-Authenticate", 'Basic realm="QA Meta Ads"')])
        return False

    def _file(self, base, rel):
        path = (base / rel).resolve()
        if not str(path).startswith(str(base.resolve())) or not path.is_file():
            return self._send(404, '{"error":"no encontrado"}')
        self._send(200, path.read_bytes(), mimetypes.guess_type(path.name)[0] or "application/octet-stream")

    def _body(self):
        return self.rfile.read(int(self.headers.get("Content-Length", 0)))

    def do_GET(self):
        p = urlparse(self.path).path
        if p == "/health":
            return self._send(200, '{"ok":true}')
        if not self._authorized():
            return
        if p in ("/", "/index.html"):
            return self._file(WEB, "index.html")
        if p.startswith("/web/"):
            return self._file(WEB, p[5:])
        if p.startswith("/ds/"):
            return self._file(DS, p[4:])
        if p.startswith("/img/"):
            return self._file(qa_engine.IMG_DIR, p[5:])
        if p == "/api/report":
            f = qa_engine.DATA / "report.json"
            return self._send(200, f.read_bytes()) if f.exists() else self._send(404, '{"error":"sin reporte"}')
        if p == "/api/status":
            has_key = bool(qa_engine.load_env().get("ANTHROPIC_API_KEY"))
            return self._send(200, json.dumps({**state, "modo": "visor" if VIEWER else "local",
                                               "vision_disponible": has_key}, ensure_ascii=False))
        if p == "/api/publish/images":
            names = sorted(f.name for f in qa_engine.IMG_DIR.glob("*") if f.is_file()) if qa_engine.IMG_DIR.exists() else []
            return self._send(200, json.dumps(names))
        self._send(404, '{"error":"no encontrado"}')

    def do_POST(self):
        if not self._authorized():
            return
        p = urlparse(self.path)
        if p.path.startswith("/api/publish/"):
            if not PASSWORD:
                return self._send(403, '{"error":"configurá APP_PASSWORD para habilitar la publicación"}')
            if p.path == "/api/publish/images":
                # zip con imágenes nuevas (solo nombres de archivo planos, nada de rutas)
                qa_engine.IMG_DIR.mkdir(parents=True, exist_ok=True)
                n = 0
                with zipfile.ZipFile(io.BytesIO(self._body())) as z:
                    for info in z.infolist():
                        name = Path(info.filename).name
                        if name and not info.is_dir() and name == info.filename:
                            (qa_engine.IMG_DIR / name).write_bytes(z.read(info))
                            n += 1
                return self._send(200, json.dumps({"guardadas": n}))
            if p.path == "/api/publish/report":
                report = json.loads(self._body())
                if "anuncios" not in report or "issues" not in report:
                    return self._send(400, '{"error":"reporte inválido"}')
                qa_engine.DATA.mkdir(parents=True, exist_ok=True)
                tmp = qa_engine.DATA / "report.json.tmp"
                tmp.write_text(json.dumps(report, ensure_ascii=False), encoding="utf-8")
                tmp.replace(qa_engine.DATA / "report.json")
                return self._send(200, json.dumps({"ok": True, "generado": report.get("generado")}))
            return self._send(404, '{"error":"no encontrado"}')
        if p.path == "/api/refresh":
            if VIEWER:
                return self._send(403, '{"error":"este tablero solo muestra lo publicado por la tarea diaria"}')
            if not state["running"]:
                threading.Thread(target=refresh, args=("vision=0" not in p.query,), daemon=True).start()
            return self._send(202, '{"ok":true}')
        self._send(404, '{"error":"no encontrado"}')


if __name__ == "__main__":
    qa_engine.DATA.mkdir(parents=True, exist_ok=True)
    srv = ThreadingHTTPServer((HOST, PORT), Handler)
    url = f"http://{'127.0.0.1' if HOST == '127.0.0.1' else HOST}:{PORT}"
    print(f"Tablero de QA ({'visor' if VIEWER else 'local'}) en {url}  (Ctrl+C para cerrar)", flush=True)
    if "--open" in sys.argv:
        webbrowser.open(url)
    srv.serve_forever()
