"""Servidor del tablero de QA.

Local:    python app/server.py --open        → http://127.0.0.1:8765
Railway:  python app/server.py               → usa $PORT y escucha en 0.0.0.0

Variables de entorno opcionales:
  APP_PASSWORD   activa usuario/contraseña (usuario: cualquiera) para ver el tablero
  REFRESH_TIME   hora de la actualización diaria automática, HH:MM (default 07:30)
  TZ_NAME        zona horaria de esa hora (default America/Santiago)
"""
import base64
import datetime as dt
import hmac
import json
import mimetypes
import os
import sys
import threading
import time
import traceback
import webbrowser
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from urllib.parse import urlparse
from zoneinfo import ZoneInfo

import qa_engine

APP = Path(__file__).resolve().parent
WEB = APP / "web"
DS = qa_engine.ROOT / "design-system"
ON_SERVER = "PORT" in os.environ
PORT = int(os.environ.get("PORT", 8765))
HOST = "0.0.0.0" if ON_SERVER else "127.0.0.1"
PASSWORD = os.environ.get("APP_PASSWORD", "")
REFRESH_TIME = os.environ.get("REFRESH_TIME", "07:30")
TZ = ZoneInfo(os.environ.get("TZ_NAME", "America/Santiago"))

state = {"running": False, "step": "", "error": None, "next_run": None}
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


def apply_readings():
    """Aplica al reporte actual las lecturas de piezas recibidas, sin consultar Meta."""
    with lock:
        try:
            import vision
            vision.aplicar_offline()
        except Exception:
            traceback.print_exc()


def daily_scheduler():
    """Actualiza el reporte todos los días a REFRESH_TIME (y al arrancar si no hay reporte)."""
    for _ in range(8):  # sin reporte todavía: reintentar cada 15 min (p. ej. si Meta limita llamadas)
        if (qa_engine.DATA / "report.json").exists():
            break
        refresh()
        if not (qa_engine.DATA / "report.json").exists():
            state["next_run"] = (dt.datetime.now(TZ) + dt.timedelta(minutes=15)).isoformat(timespec="minutes")
            time.sleep(900)
    hh, mm = (int(x) for x in REFRESH_TIME.split(":"))
    while True:
        now = dt.datetime.now(TZ)
        nxt = now.replace(hour=hh, minute=mm, second=0, microsecond=0)
        if nxt <= now:
            nxt += dt.timedelta(days=1)
        state["next_run"] = nxt.isoformat(timespec="minutes")
        time.sleep((nxt - now).total_seconds())
        refresh()


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
            return self._send(200, json.dumps({**state, "vision_disponible": has_key}, ensure_ascii=False))
        self._send(404, '{"error":"no encontrado"}')

    def do_POST(self):
        if not self._authorized():
            return
        p = urlparse(self.path)
        if p.path == "/api/vision-cache":
            # Lecturas de piezas hechas por la tarea diaria local (solo con contraseña configurada)
            if not PASSWORD:
                return self._send(403, '{"error":"configurá APP_PASSWORD para habilitar la sincronización"}')
            body = json.loads(self.rfile.read(int(self.headers.get("Content-Length", 0))) or b"{}")
            import vision
            nuevas = vision.merge(body)
            if nuevas and (qa_engine.DATA / "report.json").exists():
                threading.Thread(target=apply_readings, daemon=True).start()
            return self._send(200, json.dumps({"nuevas": nuevas}))
        if p.path == "/api/refresh":
            if not state["running"]:
                threading.Thread(target=refresh, args=("vision=0" not in p.query,), daemon=True).start()
            return self._send(202, '{"ok":true}')
        self._send(404, '{"error":"no encontrado"}')


if __name__ == "__main__":
    qa_engine.DATA.mkdir(parents=True, exist_ok=True)
    if ON_SERVER:
        threading.Thread(target=daily_scheduler, daemon=True).start()
    srv = ThreadingHTTPServer((HOST, PORT), Handler)
    url = f"http://{'127.0.0.1' if HOST == '127.0.0.1' else HOST}:{PORT}"
    print(f"Tablero de QA en {url}  (Ctrl+C para cerrar)", flush=True)
    if "--open" in sys.argv:
        webbrowser.open(url)
    srv.serve_forever()
