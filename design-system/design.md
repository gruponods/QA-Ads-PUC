# NODS — design.md

Especificación de diseño portátil de **NODS — Technology for Education**, escrita para pegar en **Google Stitch** (o cualquier generador de UI por prompt).

Los bloques marcados **PROMPT** están en inglés a propósito: Stitch interpreta mejor las instrucciones de estilo en inglés. El resto es referencia para vos.

---

## 1. Style prompt base (pegá esto primero)

> **PROMPT — Style**
>
> Design style: premium EdTech, flat and minimal, generous white space.
> Background: pure white `#FFFFFF` only — never dark backgrounds, gradients, or textures.
> Text: near-black `#0A0A0A`. Secondary text: gray `#6B7280`. Faint captions: `#9CA3AF`.
> Accent color: blue `#1946E3`, used ONLY for accents — one keyword inside a heading, big numbers, icons, thin accent lines, one highlighted table column or card border. Never use blue for paragraph text. Blue must cover less than 15% of the screen.
> Typography: **Space Grotesk** for everything (weights 300/400/500/700). No other font. Hierarchy comes from weight and size only.
> Shapes: always rounded — 16px radius on cards, 12px on small cards and inputs, fully rounded pills for buttons and tags.
> **No shadows anywhere.** Separate surfaces with 1px hairline borders in `#E5E7EB`.
> Icons: Tabler Icons, outline style, uniform 2px stroke, monochrome (black, gray, or blue). No emoji.
> Layout: 12-column grid, strict alignment, wide margins. One idea per screen.

---

## 2. Color

| Rol | Hex | Uso |
|---|---|---|
| Fondo | `#FFFFFF` | Siempre. Único fondo permitido. |
| Texto | `#0A0A0A` | Texto por defecto. |
| Texto secundario | `#6B7280` | Bajadas, microcopy. |
| Texto tenue | `#9CA3AF` | Captions, footers. |
| **Azul NODS** | `#1946E3` | Solo acento (ver regla del 15%). |
| Azul hover | `#1238B5` | Hover de botones/links. |
| Azul press | `#0E2B8C` | Estado presionado. |
| Azul tinte | `#EEF2FE` | Chips de ícono, columna destacada. |
| Hairline | `#E5E7EB` | Todos los bordes y divisores. |
| Superficie apagada | `#F3F4F6` | Placeholders de imagen, logo walls. |
| Superficie sutil | `#F9FAFB` | Barras de herramientas, encabezados de tabla. |
| Divisor oscuro | `#0A0A0A` / `#0B1B4D` | Solo 1–2 pantallas/slides de capítulo. |

**Estados de dato (apagados, solo para ↑↓ en gráficos y métricas):** verde `#12A16B`, ámbar `#F2A516`, rojo `#E5484D`. Nunca como relleno ni fuera de datos.

> **PROMPT — Colors**
>
> Use only this palette: white `#FFFFFF` background, text `#0A0A0A`, secondary text `#6B7280`, hairline borders `#E5E7EB`, muted surface `#F3F4F6`, and a single accent blue `#1946E3` with tint `#EEF2FE`. Data trends use green `#12A16B`, amber `#F2A516`, red `#E5484D` for up/down and status. Charts with several series use a vivid categorical palette in order: #1946E3, #FF6B57, #06B6D4, #8B5CF6, #FFB020, #E64980, #22C55E, #0B1B4D. Heat maps use a cyan→blue→violet ramp (#CFF5FB, #5FD4EA, #2E8BEF, #1946E3, #5B2BC9).

---

## 3. Tipografía

Una sola familia: **Space Grotesk** (Google Fonts).

| Rol | Peso | Tamaño | Notas |
|---|---|---|---|
| Display / portada | Bold 700 | 40–56px | line-height 1.3, tracking -0.01em |
| Título de pantalla | Bold 700 | 28–34px | line-height 1.2 |
| Subtítulo / bajada | Regular 400 | 18–20px | color `#6B7280` |
| Cuerpo | Regular 400 | 14–16px | line-height 1.5–1.6 |
| Kicker / tag | Medium 500 | 12–13px | MAYÚSCULAS, tracking 0.16em |
| Big number | Bold 700 | 64–120px | azul `#1946E3`, line-height 1.02 |

> **PROMPT — Type**
>
> Use Space Grotesk for all text. Headings Bold 700 (28–34px screens, 40–56px hero), body Regular 400 (14–16px, line-height 1.55), subtitles Regular 400 18–20px in gray `#6B7280`. Eyebrow labels and tags: Medium 500, 12–13px, UPPERCASE, letter-spacing 0.16em. Big metric numbers: Bold 700, 64–120px, in blue `#1946E3`.

---

## 4. Forma, espacio y estados

- **Radios:** 8px chico · **12px** tarjetas compactas/inputs · **16px** tarjetas y contenedores de foto · 24px paneles grandes · **pill (999px)** botones y tags.
- **Bordes:** 1px `#E5E7EB`. Es el único separador (más una barra de acento azul de 2–3px bajo titulares).
- **Sombras:** ninguna, nunca. `box-shadow: none`.
- **Espaciado:** escala de 4px → 4, 8, 12, 16, 24, 32, 48, 64, 96, 128. Márgenes amplios (64–88px en pantallas grandes).
- **Hover:** solo cambio de color/borde en 150ms (relleno azul → `#1238B5`; borde gris → azul). Sin elevación, sin escala.
- **Press:** color más oscuro (`#0E2B8C`). Sin encogimiento.
- **Imágenes:** dentro de contenedores redondeados (16px) o a sangre parcial. Tratamiento consistente; sin filtros salvo grayscale en logos de clientes.

> **PROMPT — Shape & interaction**
>
> Rounded corners everywhere: 16px cards, 12px inputs, pill-shaped buttons and tags. Absolutely no shadows — use 1px `#E5E7EB` hairline borders to separate surfaces. Hover states only shift color or border (blue fill darkens to `#1238B5`, gray border turns blue) over 150ms; no elevation, no scaling. Spacing on a 4px scale with generous margins.

---

## 5. Componentes

| Componente | Descripción |
|---|---|
| **Botón** | Pill. Primario: relleno azul `#1946E3`, texto blanco. Secundario: transparente con borde hairline, texto negro → azul en hover. Ghost: sin borde, hover gris `#F3F4F6`. Tamaños 14/16/18px. |
| **Tarjeta** | Fondo blanco, radio 16px, borde hairline, sin sombra. Arriba un chip redondeado de 46px en `#EEF2FE` con un ícono azul; luego título Medium 20px y microcopy 15px gris. |
| **Tag / chip** | Pill, 12px Medium MAYÚSCULAS. Variantes: outline (borde hairline), soft (`#EEF2FE` + texto `#1238B5`), solid (azul + blanco), neutral (gris). |
| **Kicker** | Barra azul de 24×2px + label 13px Medium MAYÚSCULAS tracking 0.16em en gris. Va arriba de los títulos. |
| **Divisor** | Línea hairline 1px, o barra de acento azul de 56×3px redondeada. |
| **Big number** | Cifra Bold 64–120px en azul, con prefijo/sufijo a mitad de tamaño y label gris debajo. |
| **Delta de dato** | Ícono de tendencia + valor, en verde/ámbar/rojo apagado. Único uso de color no azul. |
| **Gráfico de barras** | Barras azules con top redondeado 8px, ejes y gridlines hairline, labels en Space Grotesk. Sin 3D, sin sombra, sin gradiente. Varias series usan la **paleta de gráficos** en orden: azul `#1946E3`, coral `#FF6B57`, cian `#06B6D4`, violeta `#8B5CF6`, sol `#FFB020`, rosa `#E64980`, verde `#22C55E` y navy `#0B1B4D`. Una sola serie va siempre en azul. Las tramas son opcionales, como segunda codificación. |
| **Paso / timeline** | Badge circular de 48px con borde azul 1.5px y número o ícono azul, unido por línea conectora gris de 2px. |
| **Logo wall** | Grilla hairline con logos de clientes en grayscale al 50% de opacidad. |
| **Tabla** | Encabezados 13px Medium MAYÚSCULAS grises, filas separadas por hairline, columna NODS con fondo `#EEF2FE` y radio 14px arriba/abajo. |

> **PROMPT — Components**
>
> Buttons are pill-shaped: primary is a solid `#1946E3` fill with white text, secondary is transparent with a 1px `#E5E7EB` border. Cards are white with 16px radius and a 1px `#E5E7EB` border, no shadow, and start with a 46px rounded square icon chip in `#EEF2FE` holding a blue outline icon, then a Medium 20px title and 15px gray body text. Tags are uppercase pills. Section labels are uppercase 13px Medium with wide letter-spacing, preceded by a small 24×2px blue bar. Charts use blue bars with hairline gray axes.

---

## 6. Contenido y tono

- Idioma: **español neutro (LatAm)**.
- Voz: cálida y directa. **"Nosotros"** para NODS, **"tu/tu aula"** para la audiencia. *"Llevemos la tecnología a tu aula."*
- Primero el beneficio para el docente/escuela, después la capacidad. *"…para que cada docente enseñe con datos, no con supuestos."*
- Sentence case en títulos y cuerpo. **Kickers y tags en MAYÚSCULAS.** Los títulos suelen cerrar con punto.
- Una palabra clave en azul por titular. Nunca colorear párrafos.
- Números concretos y redondeados: *"3.2M alumnos", "+40 países", "128%"*.
- **Nunca emoji.** El significado lo cargan los íconos Tabler outline.

> **PROMPT — Content**
>
> All copy in neutral Latin American Spanish. Warm, direct, benefit-first voice: "we" for the company, "tu/tu aula" for the audience. Sentence case headings that often end with a period; UPPERCASE eyebrow labels and tags. Exactly one keyword per heading highlighted in blue. Concrete rounded numbers. Never use emoji.

---

## 7. Patrones de pantalla / slide

Layouts ya definidos en el sistema, útiles como pedido directo a Stitch:

1. **Portada** — kicker + titular 56px con una palabra azul + bajada, mucho aire.
2. **Agenda / índice** — lista numerada en dos columnas, numerales azules, divisores hairline.
3. **Problema / solución** — dos tarjetas lado a lado: problema en gris con ✕, solución con borde y checks azules.
4. **Grid de tarjetas** — 2/3/4/6 celdas, cada una con chip de ícono, título y microcopy.
5. **Producto / screenshot** — callouts de features a la izquierda, mock de app en ventana de navegador a la derecha.
6. **Texto + gráfico** — big number y takeaway a la izquierda, gráfico de barras a la derecha.
7. **Big number + foto** — métrica gigante azul (54%) + imagen a sangre parcial (46%).
8. **Timeline / proceso** — 4 pasos horizontales con badges y línea conectora.
9. **Comparativa** — tabla con la columna NODS destacada en `#EEF2FE`.
10. **Roadmap** — track horizontal de fases con hitos (hecho / actual / futuro).
11. **Pricing** — 3 planes en tarjetas planas, el recomendado con borde azul y tag "Recomendado".
12. **Logos de clientes** — grilla grayscale.
13. **Equipo** — avatares circulares de 150px, nombre y rol.
14. **Divisor de capítulo (oscuro)** — fondo `#0A0A0A`, titular blanco con palabra azul, índice gigante translúcido. Solo 1–2 por deck.
15. **Cierre / CTA** — titular fuerte + botones pill + fila de contacto con íconos azules.

---

## 8. Reglas que no se negocian

1. Fondo **siempre blanco**. Excepción: 1–2 divisores de capítulo oscuros.
2. El azul es **acento, no protagonista** — menos del ~15% de la superficie. Nunca en párrafos.
3. **Una sola tipografía**: Space Grotesk. Ni para datos.
4. **Cero sombras.** Separación con hairlines.
5. **Todo redondeado**: 12–16px en tarjetas, pill en tags y botones.
6. **Un solo set de íconos**: Tabler outline. Sin emoji, sin mezclar librerías.
7. **Una idea por pantalla.** El espacio en blanco es parte del diseño.

---

## 9. Assets

- Logo principal: `assets/logo-nods-blue.png` (azul, para fondo claro).
- Logo reverso: `assets/logo-nods-white.png` (blanco, para fondo oscuro).
- El lockup completo es **NODS / TECHNOLOGY FOR EDUCATION™**. No existe un ícono aislado: usá el wordmark donde haga falta una marca.
- En slides el wordmark va arriba a la derecha (32px de alto) en negro sobre claro, blanco sobre oscuro.

---

## 10. Aplicaciones web

Mismas reglas de marca, más estas convenciones para producto:

- **Shell:** sidebar blanca de 248px + topbar blanca de 64px, separadas por hairlines. Contenido con ancho máximo 1240px y padding 32px. Fondo siempre blanco; los paneles llevan borde hairline, nunca sombra ni fondo gris.
- **Navegación:** ítem activo con tinte `#EEF2FE` + ícono y texto azul; hover `#F9FAFB`. Breadcrumbs en la topbar.
- **Encabezado de página:** kicker + título Bold 28–30px con una sola palabra en azul + bajada gris; acción primaria arriba a la derecha.
- **Controles:** alturas 36 (toolbars) / 44 (formularios) / 52 (login). Inputs con radio 12px; botones pill. Foco = borde azul, sin anillo.
- **Datos:** valores de KPI en negro (el azul queda para íconos y acentos). Estado = punto de 8px en color apagado + texto negro; nunca badges rellenos de color.
- **Gráficos:** para comparar series usá tramas en azul (sólido, diagonal, puntos…) con leyenda de muestras; la serie principal siempre sólida, máximo ~4.
- **Mapas:** países de América con fronteras reales (Natural Earth, nunca dibujadas a mano). Escala de 5 azules (#DCE4FC → #0E2B8C) para valores, o tramas azules sobre tinte para categorías. Bordes blancos de 1px entre países; gris #E5E7EB sin datos; gris #F3F4F6 para lo que queda fuera de América. Nombres en español solo donde entran dentro del país; los chicos se nombran en el tooltip.
- **Tablas:** marco hairline radio 16px, encabezado 12px MAYÚSCULAS gris sobre `#F9FAFB`. Las filas siempre tienen que distinguirse claramente: **cebra** por defecto (`#F5F7FA` alternado), **líneas** hairline, o **separadas** (cada fila es una tarjeta redondeada). Hover de fila en `#EEF2FE`. Columnas ordenables.
- **Alertas de fila:** las filas con problema se tiñen de rojo/ámbar suave (`#F9E9E7` / `#FAF1E1`) y llevan un ícono de alerta en la primera columna; el color nunca va solo.
- **Formato condicional:** números que cruzan un umbral pasan a rojo `#A8433A` / ámbar `#8A6114`, en bold y con ícono (texto o píldora suave); barras de dato en la celda (azul → ámbar/rojo); celdas de calor con la escala de 5 azules. El verde es opcional y escaso.
- **Chips de categoría:** 6 tonos vivos (azul, cian, violeta, rosa, verde, naranja), con fondo suave o en outline con punto. Es la única paleta multicolor y es solo para categorías (materia, área, tipo); nunca para estados ni datos.
- **Cumplimiento / presupuesto:** número grande en azul + delta de GAP en rojo apagado + gauge semicircular plano (pista gris, relleno azul; si pasa del 100%, un arco fino rojo por fuera y un aviso). Tabla real vs budget con conmutador Semanal / Acumulado, píldoras de resumen, píldoras de cumplimiento y barras de ejecución, y total fijo abajo. Evolución semanal: barra de budget gris con contorno detrás, real en azul (ámbar si queda bajo budget), semanas futuras rayadas, y anillos de ejecución debajo (verde ≤100%, ámbar 100–125%, rojo >125%).
- **Mapas de calor (grillas):** celdas redondeadas de 6px con 3px de separación. Escala secuencial de 5 azules para volúmenes (leads por día × hora). Escala divergente para metas: rojo apagado debajo del 100%, gris alrededor y azul arriba. Al pasar el mouse se resaltan la fila y la columna. Celdas vacías con borde punteado, leyenda siempre visible y texto legible en cada tono. Nunca mezclar escalas en una misma grilla.
- **Semanas ISO:** siempre "S35" con el rango de fechas ("24–30 ago"), nunca el código "352026". Tabla pivote programa × semana con costo por lead (ámbar > $9, rojo > $11) y leads, primera columna fija, cebra y fila de total. Semana actual en azul.
- **Comparar dos opciones (Instagram vs Facebook):** filas tipo "mariposa", con la métrica al centro, una barra azul sólida a la izquierda y una barra azul rayada a la derecha. El ganador de cada fila va en negrita con su ventaja en verde apagado. En costos gana el menor; la inversión no tiene ganador. Los logos de las redes van como íconos outline azules, nunca con sus colores de marca.
- **Buyer persona:** foto o avatar, nombre y edad, rol y ciudad. Cita grande con una frase en azul y chips de rasgos en contorno. Datos clave en recuadros (edad, género, formación, ingreso, dispositivo, días hasta decidir). Motivaciones (íconos azules) y objeciones (íconos ámbar). Canales con barras, distribución por edad y recorrido de decisión en pasos con el "Día N". Al final, mensajes que funcionan y qué evitar.
- **Animaciones:** solo de entrada, sutiles. Las secciones aparecen con un fundido y suben 12px (420ms, escalonado de 70ms). Los números grandes cuentan hacia arriba y las barras crecen desde la base. Al cambiar de pantalla hay un fundido de 360ms. Nada de rebotes, escalas, desenfoques ni loops (salvo el tagline animado). Se respeta "reducir movimiento".
- **Funnel de marketing:** una barra centrada por etapa, con colores de violeta a azul, cian y verde azulado. El volumen va a la derecha y el porcentaje del total, debajo del nombre. Entre etapas, un chip rojo suave con el porcentaje de caída; la mayor caída va en rojo sólido. Al pasar el mouse se ve el volumen, el porcentaje del total, la conversión desde la etapa anterior y la caída (en porcentaje y en cantidad perdida).
- **Paleta de mapas de calor:** Aurora, de cian a azul y violeta (o todo azul). La versión divergente va de coral a gris y a azul.
- **Dark mode (solo apps):** tres opciones — **Grafito** `#0E0F12` (recomendada), **Navy** `#081230` (azul profundo de marca), **Negro** `#000` (solo líneas). Mismas reglas planas. El azul de texto/íconos se aclara (`#6283FF`) para contraste; los rellenos sólidos con texto blanco usan `#2A55F0`. Logo en blanco. Las presentaciones siempre quedan en blanco.
- **Overlays:** scrim `rgba(10,10,10,.4)` sin blur; diálogo blanco radio 16px con borde hairline, sin sombra. Toasts abajo a la derecha.

> **PROMPT — Web app**
>
> Build a web app for teachers in the same style: white 248px sidebar and 64px top bar separated by 1px `#E5E7EB` lines, white page background, content max-width 1240px. Active nav item has a `#EEF2FE` background with blue `#1946E3` icon and text. Page titles are Space Grotesk Bold 30px with one word in blue, with an uppercase eyebrow label above. Panels are white with 16px radius and 1px `#E5E7EB` border — no shadows, no gray fills. Inputs are 44px tall with 12px radius; focus shows a blue border, no glow. KPI numbers in near-black; status shown as a small colored dot (muted green/amber/red) next to black text. Tables have uppercase gray 12px headers, hairline rows, no zebra stripes. Charts with multiple series use the vivid palette in order (blue, coral, cyan, violet, sun, pink, green, navy) with a swatch legend; a marketing funnel uses a violet→blue→cyan→teal ramp with red drop-% chips between stages. Modals use a flat dark scrim and a white rounded panel with a hairline border. Table rows must be clearly distinguishable: zebra striping (#F5F7FA) by default, or hairline rows, or each row as a separate rounded card; problem rows get a soft red/amber tint plus an alert icon; values crossing thresholds turn muted red/amber, bold, with an icon; in-cell data bars and blue heat cells for activity. Category chips use six muted tones (blue, teal, violet, plum, olive, slate) only for categories. For dark mode, offer: graphite #0E0F12 background with #15171B surfaces and #2C3038 hairlines, text #F2F3F5, accent text #6283FF, solid buttons #2A55F0 — still flat, no shadows, white logo. Maps of the Americas use accurate country boundaries (Natural Earth), a 5-step blue sequential scale (#DCE4FC to #0E2B8C) or blue patterns for categories, 1px white borders between countries, light gray for no data, and Spanish country names placed only where they fit inside each country.

Pantallas de referencia en `ui_kits/web-app/`: Inicio (KPIs + gráfico + alertas), Aulas (tabla filtrable), Detalle de aula, Contenidos (grid de tarjetas), Seguimiento (tablas con alertas, formato condicional y chips), Rendimiento (cumplimiento, real vs budget, evolución semanal, pivote por semana ISO), Red regional (mapa de América), Ajustes (con Apariencia: claro / grafito / navy / negro), Login y diálogo "Nueva tarea".

**Referencia completa:** `readme.md` en este proyecto (foundations, iconografía, componentes y plantillas).
