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
| Descuento | El copy menciona el descuento vigente y el plazo no está vencido |
| URL y UTM | Landing, ref y UTMs vs. Creatividad 2027 (`video2`, `img2`… son piezas diferenciadas, válidas); la landing responde |
| Pieza | Programa y precio sobre la imagen / fotogramas del video vs. Creatividad 2027 |
| Ubicaciones | Stories/Reels y Feed con el mismo programa y la misma landing |
| Mejoras automáticas | Mejoras de Advantage+ creative activadas |
| Alertas | Sin gasto, sin pieza vertical, fechas de inicio pasadas, anuncios rechazados |

El copy puede variar respecto de Creatividad 2027 (variaciones de paid media): no es error; la
comparación se ve en el detalle de cada anuncio. Los errores y puntos a revisar se exportan en CSV
para importar en Jira (botón **Exportar para Jira**).

## Estructura

```
app/qa_engine.py   motor: lee sheet + Meta, aplica controles, escribe data/report.json
app/vision.py      lectura de piezas (cache por imagen; API de Anthropic o lectura manual)
app/server.py      servidor HTTP del tablero + actualización diaria automática
app/web/           interfaz (HTML/CSS/JS, tokens NODS)
app/seed/          lecturas de piezas ya hechas (arranque de un servidor nuevo)
design-system/     sistema de diseño NODS (estilos, íconos, logos)
```

## Cómo funciona

- **La PC es el cerebro.** La tarea diaria de Claude (7:30) corre `app/qa_engine.py`, lee las
  piezas nuevas y publica el resultado con `app/publicar.py`.
- **Railway solo muestra.** No llama a Meta ni al sheet: guarda y sirve el último reporte
  publicado (y sus imágenes). En Railway no hay botón *Actualizar*.

## Variables

Local (`.env` en la raíz, no se sube al repo):

| Variable | Descripción |
|---|---|
| `META_ACCESS_TOKEN` | Token de usuario del sistema de Meta (lectura) |
| `META_AD_ACCOUNT_ID` | `106326206432820` |
| `META_API_VERSION` | Default `v24.0` |
| `ANTHROPIC_API_KEY` | Opcional: lee las piezas por API en vez de la tarea de Claude |
| `RAILWAY_URL` | Dominio del tablero publicado |
| `APP_PASSWORD` | La misma contraseña configurada en Railway |

Railway:

| Variable | Descripción |
|---|---|
| `APP_PASSWORD` | Contraseña para ver el tablero y para publicar (usuario: cualquiera) |
| `DATA_DIR` | `/data` (volumen persistente) |

## Uso local

```bash
python -m venv .venv
.venv/Scripts/python -m pip install -r requirements.txt
.venv/Scripts/python app/server.py --open
```

O doble clic en `Abrir tablero QA.bat`.

## Rutina diaria (la corre la tarea programada)

```bash
python app/qa_engine.py            # lee sheet + Meta → data/report.json y data/pending_vision.json
python app/vision.py dividir 4     # lotes de piezas pendientes para leer en paralelo
python app/vision.py guardar-lotes # suma las lecturas al cache
python app/vision.py aplicar       # las aplica al reporte
python app/publicar.py             # publica reporte + imágenes nuevas en Railway
```

## Deploy en Railway

1. Conectar el repo al servicio (Python por `requirements.txt`; arranque en `railway.json`).
2. Volume montado en `/data` y `DATA_DIR=/data`.
3. Variable `APP_PASSWORD`.
4. Dominio en *Settings → Networking*.
