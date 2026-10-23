# QA Ads PUC — Tablero de control de calidad Meta Ads

Tablero que cruza los anuncios de Meta de las campañas **2027** de Educación Profesional
Ingeniería UC (cuenta `act_106326206432820`) con el sheet de planificación
(*Estructura 2027* y *Creatividad 2027*) y marca cada error con el ID del anuncio o de
la campaña y su link a Ads Manager. Diseño: sistema NODS (`design-system/`).

## Controles

| Control | Qué revisa |
|---|---|
| Programas en pauta | Activo en Meta vs. *Pauta Activa* (Estructura) + *Implementado* (Creatividad) + landing asignada. Sin landing = "Esperando URL". Errores por campaña. |
| País | Países del conjunto de anuncios vs. Chile / Perú tildados en Estructura |
| Copy | Texto de cada versión (Feed, Stories/Reels) vs. Creatividad 2027 |
| Descuento | El copy menciona el descuento vigente y el plazo no está vencido |
| URL y UTM | Landing, ref y UTMs vs. Creatividad 2027; la landing responde |
| Pieza | Programa y precio sobre la imagen / fotogramas del video vs. Creatividad 2027 |
| Ubicaciones | Stories/Reels y Feed con el mismo programa, copy, título y landing |
| Mejoras automáticas | Mejoras de Advantage+ creative activadas |
| Alertas | Sin gasto, sin pieza vertical, fechas de inicio pasadas, anuncios rechazados |

## Estructura

```
app/qa_engine.py   motor: lee sheet + Meta, aplica controles, escribe data/report.json
app/vision.py      lectura de piezas (cache por imagen; API de Anthropic o lectura manual)
app/server.py      servidor HTTP del tablero + actualización diaria automática
app/web/           interfaz (HTML/CSS/JS, tokens NODS)
app/seed/          lecturas de piezas ya hechas (arranque de un servidor nuevo)
design-system/     sistema de diseño NODS (estilos, íconos, logos)
```

## Variables de entorno

| Variable | Obligatoria | Descripción |
|---|---|---|
| `META_ACCESS_TOKEN` | Sí | Token de usuario del sistema de Meta (solo lectura: `ads_read`) |
| `META_AD_ACCOUNT_ID` | Sí | `106326206432820` |
| `META_API_VERSION` | No | Default `v24.0` |
| `ANTHROPIC_API_KEY` | No | Lee automáticamente las piezas nuevas (precio y programa) |
| `APP_PASSWORD` | Recomendada | Pide contraseña para ver el tablero (usuario: cualquiera) |
| `DATA_DIR` | En Railway | Carpeta persistente para reporte, imágenes y lecturas (ej. `/data`) |
| `REFRESH_TIME` | No | Hora de la actualización diaria, `HH:MM` (default `07:30`) |
| `TZ_NAME` | No | Zona horaria (default `America/Santiago`) |

Localmente se leen de un archivo `.env` en la raíz (no se sube al repo).

## Uso local

```bash
python -m venv .venv
.venv/Scripts/python -m pip install -r requirements.txt
.venv/Scripts/python app/server.py --open
```

O doble clic en `Abrir tablero QA.bat`. Para correr solo el motor: `python app/qa_engine.py`.

## Deploy en Railway

1. Conectar el repo al servicio (Railway detecta Python por `requirements.txt`; el arranque está en `railway.json`).
2. Agregar un **Volume** montado en `/data` y la variable `DATA_DIR=/data`.
3. Cargar las variables de la tabla de arriba.
4. Generar un dominio en *Settings → Networking*.

El servidor actualiza el reporte al arrancar (si no hay uno) y todos los días a `REFRESH_TIME`.
También se puede actualizar con el botón **Actualizar** del tablero.

## Lectura de piezas (sin API key en Railway)

Las piezas nuevas (imágenes y láminas de 6 fotogramas de cada video) las lee la tarea diaria
local de Claude y se envían al tablero publicado:

```bash
python app/qa_engine.py            # deja data/pending_vision.json
python app/vision.py dividir 4     # lotes para leer en paralelo
python app/vision.py guardar-lotes # suma las lecturas al cache
python app/vision.py aplicar       # las aplica al reporte local
python app/sync_railway.py         # las envía a Railway (POST /api/vision-cache)
```

`sync_railway.py` necesita en el `.env` local `RAILWAY_URL` (dominio del servicio) y
`APP_PASSWORD` (la misma configurada en Railway). Railway aplica las lecturas recibidas al
reporte sin volver a consultar Meta. El endpoint solo funciona si `APP_PASSWORD` está configurada.
