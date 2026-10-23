@echo off
cd /d "%~dp0"
set PYTHONUTF8=1
if not exist ".venv\Scripts\python.exe" (
  echo Instalando dependencias por unica vez...
  python -m venv .venv
  ".venv\Scripts\python.exe" -m pip install -q anthropic
)
".venv\Scripts\python.exe" app\server.py --open
