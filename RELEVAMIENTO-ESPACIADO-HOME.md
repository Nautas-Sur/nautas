# Relevamiento de espaciado — Home

Solo lectura. No se modificó CSS ni componentes. Objetivo: dar números
concretos para decidir el ajuste de espaciado del Home pedido por Caro
("menos espaciado"), pendiente desde antes del 04/08.

- **HEAD:** `a96b9901f86dc7541ef69d059b861bdba1b5b3a0` (branch `main`, post-merge de `tailwind-source-explicito`)
- **Branch de este relevamiento:** `relevamiento-espaciado-home`
- Estructura de grillas ya definitiva desde PR #33 (Fase 3, paso C) — se midió sobre eso.

## Método

Build servido estáticamente (`dist/client/`) sobre un server HTTP local
mínimo, medido con Chrome headless vía Chrome DevTools Protocol (CDP)
directo — **no** se usó redimensionado de ventana real. El viewport se fijó
de forma explícita con `Emulation.setDeviceMetricsOverride` antes de cada
navegación, evitando el problema de la sesión anterior (`resize_window`
reportaba éxito pero `window.innerWidth` quedaba en ~1260px).

`innerWidth` efectivo confirmado en cada corrida, leído desde la propia
página después de navegar:

| Ancho objetivo | `window.innerWidth` efectivo |
|---|---|
| 1440 | **1440** |
| 768 | **768** |
| 375 | **375** |

Los tres coinciden exactamente con el objetivo — medición válida.

Las mediciones de sección usan `getBoundingClientRect()` sobre cada
elemento y `getComputedStyle()` para padding/margin. El ancho de línea usa
un span temporal de 100 caracteres reales del propio bloque de texto,
insertado, medido y removido en cada corrida (no estimado).

## Mapa estructural del Home

`src/pages/index.astro` → `src/components/pages/Inicio.astro` → `BaseLayout.astro`
(envuelve con `Header` fijo + `<main>` + `Footer`). Dentro de `<main>`, en
orden de aparición vertical, los hijos de primer nivel son exactamente las
7 secciones/elementos siguientes (confirmado también programáticamente:
`document.querySelector('main').children`):

| # | Sección | Archivo | Notas |
|---|---|---|---|
| 0 | **Hero** | `src/components/HeroSection.astro` (variant `"split"`, invocado desde `Inicio.astro:50`) | `<section class="... pt-32 pb-16 md:pb-24 grid md:grid-cols-2 gap-12 md:gap-16 items-center">`. Texto: `space-y-7` (eyebrow → h1 → subtítulo `ReadMore` → CTA). CTA wrapper (`Inicio.astro:59`): `gap-4 pt-4`. Bloque `<slot />` interno con `pt-2` (`HeroSection.astro:114`). Visual: sextante SVG en `hidden md:flex ... py-8` (`Inicio.astro:76`). |
| 1 | **Separador celestial** | `src/components/CelestialLine.astro` | `<div class="celestial-line max-w-4xl mx-auto my-16 md:my-24">` — 1px de alto, es 100% margen (`my-16`/`md:my-24`), no contenido. |
| 2 | **Tres Pilares** | `Inicio.astro:94-141` | `<section class="... mb-32">`. Eyebrow `mb-4` → título `mb-16` → grid `lg:grid-cols-3 gap-8`. Cada card: `p-8 md:p-10`, ícono `mb-6`, `// 0X` label `mb-2`, título `mb-4`, descripción vía `ReadMore` (`mode="paragraph"`). |
| 3 | **Producción Destacada** | `Inicio.astro:144-197` (condicional a que exista un proyecto `featured`) | `<section class="... mb-32">`. Eyebrow `mb-6` → título `mb-12` → grid `md:grid-cols-2 gap-12`. Columna derecha: `space-y-6` (kind → título → tagline → `ReadMore` clamp de 3 líneas → CTA). |
| 4 | **Grilla de Producciones** | `Inicio.astro:200-219` | `<section class="... mb-32">`, un solo hijo directo: `<div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">` de `ProjectCard` (variant `"card"`, default). Cada card: imagen `mb-5`, bloque de texto `space-y-2`, tagline `pt-1`, fila de meta `gap-2 pt-3 mt-3`. |
| 5 | **Vision Quote** | `Inicio.astro:222-243` | `<section class="... mb-20">`, un solo hijo: `GlassPanel` (`padding="xl"` → `p-12 md:p-20`, todos los lados). Eyebrow `mb-8` → comilla `mb-2` → blockquote `mb-10` → separador `gap-4`. |
| 6 | **Newsletter CTA** | `Inicio.astro:246-301` | `<section class="... mb-20 text-center py-24 md:py-32 bg-nebula rounded-3xl ...">`. Dos hijos directos: capa decorativa SVG `absolute inset-0` (fuera del flujo pero con alto igual al de la sección — ver nota metodológica) y wrapper `relative z-10` con eyebrow `mb-4` → título `mb-6` → subtítulo `mb-12` → form `gap-3`. |

Fuera del alcance de este relevamiento pero relevante como contexto: `Header`
es `position:fixed` (no ocupa espacio en el flujo — por eso el Hero
compensa con `pt-32`), y `Footer` vive fuera de `<main>` con `mt-24 pt-20
pb-10`, no es una "sección del Home" en el sentido del pedido.

## Medición renderizada (Paso 2)

**Aire = altura total − suma de alturas de los hijos directos**, según lo
pedido. Nota metodológica importante: esta fórmula asume hijos apilados
verticalmente. En dos secciones los hijos están en fila (grid) o superpuestos
(capa absoluta), y sumarlos da un "aire" negativo sin sentido — es un
artefacto de la fórmula, no un error de medición. Para esas dos secciones
se agrega una columna alternativa `aire (máx.)` = altura total − el más alto
de los hijos, que es la lectura útil ahí. Se explica por sección abajo.

### Ancho 1440px (`scrollHeight` = 5576px)

| # Sección | Alto total | padding (t+b) | margin (t+b) | Contenido (suma) | Aire (suma) | % aire | Aire (máx.) | % aire (máx.) |
|---|---|---|---|---|---|---|---|---|
| 0 Hero | 799.6 | 128+96 | 0+0 | 1759.2 | **−959.6*** | −120%* | 0.0 | 0.0% |
| 1 Separador | 1.0 | 0+0 | 96+96 | 0.0 | 1.0 | 100%** | 1.0 | 100%** |
| 2 Tres Pilares | 527.0 | 0+0 | 0+128 | 447.0 | 80.0 | 15.2% | 148.0 | 28.1% |
| 3 Prod. Destacada | 504.5 | 0+0 | 0+128 | 432.5 | 72.0 | 14.3% | 140.0 | 27.8% |
| 4 Grilla Producciones | 1550.5 | 0+0 | 0+128 | 1550.5 | 0.0 | 0.0% | 0.0 | 0.0% |
| 5 Vision Quote | 471.5 | 0+0 | 0+80 | 471.5 | 0.0 | 0.0% | 0.0 | 0.0% |
| 6 Newsletter | 517.0 | 128+128 | 0+80 | 778.0 | **−261.0*** | −50.5%* | 0.0 | 0.0% |

### Ancho 768px (`scrollHeight` = 6811px)

| # Sección | Alto total | padding (t+b) | margin (t+b) | Contenido (suma) | Aire (suma) | % aire | Aire (máx.) | % aire (máx.) |
|---|---|---|---|---|---|---|---|---|
| 0 Hero | 1047.2 | 128+96 | 0+0 | 2158.3 | **−1111.2*** | −106.1%* | 0.0 | 0.0% |
| 1 Separador | 1.0 | 0+0 | 96+96 | 0.0 | 1.0 | 100%** | 1.0 | 100%** |
| 2 Tres Pilares | 1241.0 | 0+0 | 0+128 | 1161.0 | 80.0 | 6.4% | 196.0 | 15.8% |
| 3 Prod. Destacada | 541.5 | 0+0 | 0+128 | 469.5 | 72.0 | 13.3% | 140.0 | 25.9% |
| 4 Grilla Producciones | 1758.0 | 0+0 | 0+128 | 1758.0 | 0.0 | 0.0% | 0.0 | 0.0% |
| 5 Vision Quote | 471.5 | 0+0 | 0+80 | 471.5 | 0.0 | 0.0% | 0.0 | 0.0% |
| 6 Newsletter | 517.0 | 128+128 | 0+80 | 778.0 | **−261.0*** | −50.5%* | 0.0 | 0.0% |

### Ancho 375px (`scrollHeight` = 8638px)

| # Sección | Alto total | padding (t+b) | margin (t+b) | Contenido (suma) | Aire (suma) | % aire | Aire (máx.) | % aire (máx.) |
|---|---|---|---|---|---|---|---|---|
| 0 Hero | 777.7 | 128+64 | 0+0 | 1363.4 | **−585.7*** | −75.3%* | 0.0 | 0.0% |
| 1 Separador | 1.0 | 0+0 | 64+64 | 0.0 | 1.0 | 100%** | 1.0 | 100%** |
| 2 Tres Pilares | 1411.0 | 0+0 | 0+128 | 1331.0 | 80.0 | 5.7% | 180.0 | 12.8% |
| 3 Prod. Destacada | 709.4 | 0+0 | 0+128 | 637.4 | 72.0 | 10.1% | 132.0 | 18.6% |
| 4 Grilla Producciones | 3119.8 | 0+0 | 0+128 | 3119.8 | 0.0 | 0.0% | 0.0 | 0.0% |
| 5 Vision Quote | 442.0 | 0+0 | 0+80 | 442.0 | 0.0 | 0.0% | 0.0 | 0.0% |
| 6 Newsletter | 593.0 | 96+96 | 0+80 | 994.0 | **−401.0*** | −67.6%* | 0.0 | 0.0% |

`*` Hero y Newsletter dan aire negativo con la fórmula de suma porque sus
hijos directos no se apilan: en Hero, la capa de estrellas (`absolute
inset-0`) y las dos columnas del grid (`md:grid-cols-2`) se superponen/están
en fila, no uno debajo del otro; en Newsletter, la capa decorativa SVG
(`absolute inset-0`) se superpone al contenido real (`relative z-10`). En
ambos casos, sumar sus alturas cuenta el mismo espacio vertical dos o tres
veces. La columna "aire (máx.)" — altura total menos el hijo más alto, no
la suma — da 0% en las dos: todo el alto de estas secciones es contenido
real (o capa superpuesta), sin aire de sobra al nivel del hijo directo. El
aire real de Hero, si existe, está más adentro (por ejemplo en el
`space-y-7` del bloque de texto) y no lo captura esta medición a nivel de
sección.

`**` El separador celestial es 100% aire por diseño: es un divisor de 1px,
no contenido. No es un hallazgo, es su función.

Secciones 4 y 5 dan 0% de aire porque tienen un único hijo directo (el
`div.grid` de producciones, el `GlassPanel` de la cita) — su padding vive
adentro de ese hijo (en el `GlassPanel`, `p-12 md:p-20`), no al nivel de la
`<section>`, que solo tiene `px-*` (horizontal) y `mb-*` (margen, fuera de
esta cuenta). El margen de esas secciones (`mb-32` = 128px, `mb-20` = 80px)
es real y está en la columna "margin".

## Ancho de línea e interlineado (Paso 3)

Medido empíricamente con un span de 100 caracteres reales insertado y
removido en cada bloque, en cada ancho. Referencia: 45–85 caracteres por
línea es la zona cómoda; ⚠ marca lo que se sale.

| Bloque | Ancho | font-size | line-height | ancho contenedor | caract./línea aprox. |
|---|---|---|---|---|---|
| Subtítulo Hero | 1440 | 24px | 39px | 576px | 68.7 |
| Subtítulo Hero | 768 | 24px | 39px | 304px | ⚠ 36.2 (bajo 45) |
| Subtítulo Hero | 375 | 20px | 32.5px | 327px | 46.8 |
| Pilar Arte (desc.) | 1440 | 16px | 26px | 344.7px | 46.4 |
| Pilar Arte (desc.) | 768 | 16px | 26px | 590px | 79.4 |
| Pilar Arte (desc.) | 375 | 16px | 26px | 261px | ⚠ 35.1 (bajo 45) |
| Pilar Ciencia (desc.) | 1440 | 16px | 26px | 344.7px | 47.1 |
| Pilar Ciencia (desc.) | 768 | 16px | 26px | 590px | 80.7 |
| Pilar Ciencia (desc.) | 375 | 16px | 26px | 261px | ⚠ 35.7 (bajo 45) |
| Pilar Consciencia (desc.) | 1440 | 16px | 26px | 344.7px | 45.8 |
| Pilar Consciencia (desc.) | 768 | 16px | 26px | 590px | 78.5 |
| Pilar Consciencia (desc.) | 375 | 16px | 26px | 261px | ⚠ 34.7 (bajo 45) |
| Producción Destacada (desc.) | 1440 | 16px | 26px | 648px | ⚠ 85.6 (sobre 85) |
| Producción Destacada (desc.) | 768 | 16px | 26px | 312px | ⚠ 41.2 (bajo 45) |
| Producción Destacada (desc.) | 375 | 16px | 26px | 327px | ⚠ 43.2 (bajo 45) |

8 de las 15 mediciones se salen del rango cómodo — más abajo del piso (45)
que arriba del techo (85): 7 casos bajo 45, 1 caso sobre 85.

## Inventario de la escala de espaciado (Paso 4)

Conteo por **aparición en el código fuente** de los componentes que arman
el Home (`Inicio.astro`, `HeroSection.astro` — solo rama `variant="split"` —,
`CelestialLine.astro`, `ProjectCard.astro` — solo rama `variant="card"` —,
`ReadMore.astro`), no por instancia renderizada. Por eso, por ejemplo, las
tres descripciones de pilares usan el mismo `ReadMore` y no triplican el
conteo de `mt-3`/`mt-4` del botón "leer más" — ese valor se escribió una
sola vez en el código, aunque se renderice tres veces.

Alcance: clases `py-*`, `pt-*`, `pb-*`, `my-*`, `mt-*`, `mb-*`, `space-y-*`,
`gap-*` (el filtro exacto pedido). No incluye padding "de los cuatro lados"
como `p-8 md:p-10` (cards de pilares) o `p-12 md:p-20` (`GlassPanel`), que
también aportan espacio vertical pero caen fuera de ese filtro — se
nombran en el mapa estructural, no en esta cuenta.

Ordenado de menor a mayor (equivalencia en px entre paréntesis):

| Clase | px | Usos |
|---|---|---|
| `pt-1` | 4px | 1 |
| `gap-2` | 8px | 1 |
| `mb-2` | 8px | 2 |
| `pt-2` | 8px | 1 |
| `space-y-2` | 8px | 1 |
| `gap-3` | 12px | 2 |
| `pt-3` | 12px | 1 |
| `mt-3` | 12px | 3 |
| `gap-4` | 16px | 2 |
| `pt-4` | 16px | 1 |
| `mb-4` | 16px | 3 |
| `mt-4` | 16px | 1 |
| `mb-5` | 20px | 1 |
| `space-y-6` | 24px | 1 |
| `mb-6` | 24px | 3 |
| `space-y-7` | 28px | 1 |
| `mb-8` | 32px | 1 |
| `py-8` | 32px | 1 |
| `gap-8` | 32px | 2 |
| `mb-10` | 40px | 1 |
| `mb-12` | 48px | 2 |
| `gap-12` | 48px | 2 |
| `mb-16` | 64px | 1 |
| `my-16` | 64px | 1 |
| `pb-16` | 64px | 1 |
| `md:gap-16` | 64px | 1 |
| `mb-20` | 80px | 2 |
| `py-24` | 96px | 1 |
| `md:pb-24` | 96px | 1 |
| `md:my-24` | 96px | 1 |
| `pt-32` | 128px | 1 |
| `mb-32` | 128px | 3 |
| `md:py-32` | 128px | 1 |

**33 valores de clase distintos, 48 apariciones en total.** Colapsando por
magnitud en px (ignorando de qué propiedad se trata — `mb-16`, `my-16` y
`pb-16` son tres clases distintas pero el mismo salto de 64px), quedan **14
magnitudes distintas**: 4, 8, 12, 16, 20, 24, 28, 32, 40, 48, 64, 80, 96,
128px.

## Capturas

Página completa, 1 por ancho, guardadas fuera del repo en
`../nautas-baseline/capturas-espaciado/`:

- `home-1440.png`
- `home-768.png`
- `home-375.png`

## Observaciones

Diagnóstico únicamente — no se proponen cambios.

1. **La escala de espaciado no es una escala.** 33 clases distintas para 48
   decisiones de espaciado vertical, incluso colapsando por magnitud quedan
   14 saltos diferentes. Un sistema deliberado suele manejarse con 6-8
   pasos. La hipótesis del pedido (valores elegidos de a uno, no como
   sistema) queda confirmada por el número, no solo por impresión visual.

2. **El aire medible a nivel de sección está concentrado en dos lugares:**
   Tres Pilares y Producción Destacada — ambas tienen exactamente la misma
   estructura interna (eyebrow → título → grid, cada uno con su propio
   `mb-*`) y por eso el mismo patrón de aire (~80px y ~72px respectivamente,
   siempre, en los tres anchos — esos valores no cambian con el viewport
   porque son valores fijos, no responsive). En términos relativos
   (% de la sección), quién "gana" depende del ancho: a 1440px Tres Pilares
   tiene más aire relativo (15.2%/28.1% según la métrica); a 768px y 375px
   se invierte y Producción Destacada pasa a tener más (13.3%/25.9% y
   10.1%/18.6%) porque la sección de Pilares crece mucho más en alto al
   angostarse (las tres cards apiladas) sin que su aire fijo crezca con
   ella, diluyendo el porcentaje.

3. **La Grilla de Producciones es la que más scroll se lleva, y no tiene
   nada de aire medible a nivel de sección.** Pasa de 1550px (1440px) a
   3120px (375px) — más del doble — simplemente por el reflow de la grilla
   (`lg:grid-cols-3` → `sm:grid-cols-2` → 1 columna) apilando cards. Todo
   ese crecimiento es contenido real (cards), no aire de contenedor: si se
   quiere reducir el scroll total en mobile, el margen de acción no está en
   el padding de esta sección (no tiene) sino en el tamaño/densidad de las
   cards mismas o en cuántos proyectos se listan.

4. **Hero y Newsletter no se pueden leer con la fórmula pedida.** Ambas
   tienen hijos directos superpuestos o en fila, así que "aire = total −
   suma de hijos" da negativo sin significado. El aire real de esas dos
   secciones (si lo hay) está un nivel más adentro: en Hero, dentro del
   `space-y-7` que separa eyebrow/título/subtítulo/CTA; en Newsletter,
   dentro del wrapper `relative z-10` que envuelve eyebrow/título/subtítulo/
   form. Esta medición no lo captura — haría falta bajar un nivel más en el
   árbol para esas dos secciones específicamente.

5. **El total de scroll crece fuerte al angostar:** 5576px (1440) → 6811px
   (768) → 8638px (375), +55% de 1440 a 375. Es principalmente la Grilla de
   Producciones (punto 3) y el Hero (que también crece: 800px → 1047px →
   778px — no monótono, sube a 768 y baja a 375 porque a 768 el grid del
   Hero ya apiló pero el subtítulo todavía no gana suficiente alto extra
   por wrap para compensar, y a 375 el h1 más chico junto con menos padding
   (`pb-16` en vez de `md:pb-24`) achica la sección de nuevo).

6. **Ancho de línea: el problema es mayormente "muy angosto", no "muy
   ancho".** De las 8 mediciones fuera de rango, 7 son por debajo de 45
   caracteres por línea (columnas que se angostan demasiado en mobile o en
   tablet — los tres pilares a 375px rondan 35 caracteres, prácticamente
   una palabra por línea en algunos casos) y solo 1 se pasa del techo de 85
   (la descripción de Producción Destacada a 1440px, con `max-w-2xl`
   efectivo de 648px — su único caso problemático es justamente el ancho de
   escritorio, no mobile). El subtítulo del Hero y la descripción de
   Producción Destacada comparten el mismo patrón: cómodos en desktop,
   estrechos en tablet — la columna se angosta más de lo que compensa la
   baja en tamaño de fuente entre 1440 y 768px (ninguno de los dos cambia
   de `text-xl`/`md:text-2xl` ni de `text-base` entre esos dos anchos, solo
   cambia el contenedor).
