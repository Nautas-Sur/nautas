# Relevamiento de espaciado — fuera del Home (deuda 14)

Solo lectura. No se modificó código, solo este documento. Objetivo: saber
exactamente qué hay hoy en Institucional, Proyectos, Archivo y Contacto
antes de extender la escala de espaciado que ya se aplicó al Home.

- **Branch:** `relevamiento-espaciado`, creada sobre `main` en `817b7bc`.
- El Home (`Inicio.astro`) es la referencia canónica. No se toca en este
  relevamiento ni se tocará en la implementación.

## Paso 0 — Qué trajo el pull

`git pull` sobre `main` trajo 9 commits nuevos desde la base anterior
(`ba62f1b` → `817b7bc`), todos del 2026-08-11:

| Commit | Autor | Qué tocó |
|---|---|---|
| `9b5ec6b` | Merge PR #52 | Merge de `cms-strings-inicio` (10 strings de Inicio al panel) |
| `fc2e880` | keystatic-cloud[bot] | `src/content/projects/pulso-terrestre.yaml` + `heroImage.jpg` (reemplaza `.webp`) |
| `a7973aa` | keystatic-cloud[bot] | `src/content/projects/voces-de-la-tierra.yaml` + `heroImage.jpg` |
| `0a5e5e1`, `77a21d6` | keystatic-cloud[bot] | `src/content/projects/hermanita-sudamerica.yaml` + `heroImage.jpg` nueva |
| `f4e0dc9` | keystatic-cloud[bot] | `src/content/projects/el-nexo.yaml` + `heroImage.jpg` |
| `afda8e2` | keystatic-cloud[bot] | `src/content/team/carolina-maren.yaml` + `photo.jpg` (reemplaza a `equipo-direccion.yaml`) |
| `b4ae9ee`, `817b7bc` | keystatic-cloud[bot] | `src/content/team/santos-tiscornia.yaml` + `photo.jpg` (reemplaza a `curaduria-editorial.yaml`) |

Ningún commit de esta sesión tocó `global.css`, ningún componente de layout
ni ninguna clase de Tailwind — todo es contenido (yaml + imágenes) de
proyectos y equipo. No hay conflicto de ningún tipo con este relevamiento.

**Nota aparte, no bloqueante:** al arrancar esta tarea había cambios sin
commitear en el árbol de trabajo (imágenes nuevas de `el-nexo`,
`pulso-terrestre`, `voces-de-la-tierra`, `hermanita-sudamerica` y dos fotos
de equipo) que no son míos ni de este pedido. Los guardé en
`git stash` (`trabajo en progreso previo a relevamiento-espaciado`) para no
perderlos — su contenido parece haber quedado superado por la sesión de
Keystatic Cloud del pull de arriba (mismos archivos, mismo propósito), pero
no lo doy por sentado: queda en el stash para que lo revises vos.

Baseline regenerado desde `817b7bc` en `../nautas-baseline/dist` (no se usa
para este relevamiento, que no construye nada, pero queda listo si hace
falta comparar en la implementación).

## Paso 1 — La escala de espaciado

### Dónde está definida

**No está en `@theme`.** `src/styles/global.css` define tokens de color,
tipografía y radios, pero ningún `--spacing-*`. La escala es una
**convención de valores de clase**, no un token de Tailwind — vive
documentada en `AVANCES-2026-08-06.md` (sección "Fase 3, paso D") y se
aplica escribiendo directamente las clases utilitarias correspondientes en
`Inicio.astro` y en la rama `variant="split"` de `HeroSection.astro`. No hay
enforcement automático: nada impide escribir `mb-14` mañana y que pase el
build.

### Los seis escalones

| Paso | Clase (ejemplo `mb-*`) | Valor |
|---|---|---|
| 1 | `-2` | 8px |
| 2 | `-4` | 16px |
| 3 | `-6` | 24px |
| 4 | `-8` | 32px |
| 5 | `-12` | 48px |
| 6 | `-20` | 80px |

Más **una excepción única**: `pt-32` (128px), reservada exclusivamente para
el padding-top del Hero del Home, que compensa el `Header` fijo
(`position: fixed`, no ocupa espacio en el flujo). No es un séptimo
escalón de uso general — la regla registrada en `AVANCES-2026-08-06.md` es
"cualquier espaciado vertical **nuevo** debe ser uno de esos seis valores",
y el `pt-32` ya existía como caso especial antes de esa regla.

### Cómo se aplica hoy en el Home (verificado contra el código actual, no contra el changelog)

`src/components/pages/Inicio.astro` + rama `split` de
`src/components/HeroSection.astro`:

| Sección | Clase concreta | Valor | Archivo:línea |
|---|---|---|---|
| Hero — apertura | `pt-32` | 128px (excepción) | `HeroSection.astro:34` |
| Hero — cierre | `pb-12 lg:pb-12` | 48px (igual en ambos breakpoints) | `HeroSection.astro:34` |
| Hero — grid | `gap-12 lg:gap-12` | 48px (igual en ambos breakpoints) | `HeroSection.astro:34` |
| Hero — bloque de texto | `space-y-6` | 24px | `HeroSection.astro:86` |
| Hero — wrapper de CTA (slot) | `pt-2` | 8px | `HeroSection.astro:114` |
| Hero — fila de botones CTA | `gap-4 pt-4` | 16px | `Inicio.astro:59` |
| Separador tras Hero | `my-12 md:my-12` (override vía prop `class`) | 48px (igual en ambos breakpoints) | `Inicio.astro:91` |
| Tres Pilares — margen de sección | `mb-20` | 80px | `Inicio.astro:94` |
| Tres Pilares — eyebrow | `mb-4` | 16px | `Inicio.astro:95` |
| Tres Pilares — título | `mb-12` | 48px | `Inicio.astro:98-100` |
| Tres Pilares — grid | `gap-8` | 32px | `Inicio.astro:102` |
| Producción Destacada — margen de sección | `mb-20` | 80px | `Inicio.astro:145` |
| Producción Destacada — eyebrow | `mb-6` | 24px | `Inicio.astro:146` |
| Producción Destacada — título | `mb-12` | 48px | `Inicio.astro:149-151` |
| Producción Destacada — grid | `gap-12` | 48px | `Inicio.astro:152` |
| Producción Destacada — columna de texto | `space-y-6` | 24px | `Inicio.astro:172` |
| Grilla de Producciones — margen de sección | `mb-20` | 80px | `Inicio.astro:200` |
| Grilla de Producciones — grid | `gap-8` | 32px | `Inicio.astro:201` |
| Vision Quote — margen de sección | `mb-20` | 80px | `Inicio.astro:222` |
| Vision Quote — panel (`GlassPanel padding="xl"`) | `p-12` (4 lados, sin variante responsive) | 48px | `GlassPanel.astro:10` |
| Vision Quote — eyebrow | `mb-8` | 32px | `Inicio.astro:225` |
| Vision Quote — comilla | `mb-2` | 8px | `Inicio.astro:228` |
| Vision Quote — blockquote | `mb-8` | 32px | `Inicio.astro:231` |
| Vision Quote — separador inferior | `gap-4` | 16px | `Inicio.astro:234` |
| Newsletter — margen de sección | `mb-20` | 80px | `Inicio.astro:246` |
| Newsletter — padding vertical | `py-20 md:py-20` | 80px (igual en ambos breakpoints) | `Inicio.astro:246-247` |
| Newsletter — eyebrow | `mb-4` | 16px | `Inicio.astro:256` |
| Newsletter — título | `mb-6` | 24px | `Inicio.astro:260` |
| Newsletter — subtítulo | `mb-12` | 48px | `Inicio.astro:264` |
| Newsletter — form | `gap-4` | 16px | `Inicio.astro:268` |

**Las 30 clases verificadas hoy resuelven, sin excepción, a uno de los seis
valores {8,16,24,32,48,80} o a la excepción única de 128px del Hero.**
Confirma que la unificación del 06/08 sigue vigente en el código actual —
ningún commit posterior tocó estos archivos con cambios de espaciado (ver
`git log` en la sección de método, abajo).

### Variantes por breakpoint

Patrón consistente en todo el Home: cuando hay variante responsive, el
valor de escritorio (`lg:` o `md:`) es **igual** al de mobile, nunca crece
(`pb-12 lg:pb-12`, `gap-12 lg:gap-12`, `my-12 md:my-12`, `py-20 md:py-20`).
No hay un solo caso en el Home donde el espaciado vertical entre/dentro de
secciones aumente en desktop. La única variación real de layout por
breakpoint es de grid (`lg:grid-cols-2`, `lg:grid-cols-3`), no de espaciado.

### Método de verificación

`git log --oneline --all -- <archivos del Home>` confirma que el último
commit que tocó espaciado en estos archivos es `1d15e47`/`4b9aaff` (PR #37
y #38, 06/08). Los commits posteriores que sí tocaron `Inicio.astro`
(`5b4135c`, `19abfbd`, `0d2c7ca`, etc.) son sobre énfasis con asteriscos y
extracción de strings al CMS — ninguno cambia una clase de espaciado. La
tabla de arriba se armó leyendo el archivo actual línea por línea, no
copiando la del changelog.

## Paso 2 — Inventario del estado actual

Filtro: clases `py-*`, `pt-*`, `pb-*`, `my-*`, `mt-*`, `mb-*`, `space-y-*`,
`gap-*` **y también `p-*` (4 lados)** cuando aporta espaciado vertical
significativo — el relevamiento anterior había excluido `p-*` y esa
exclusión quedó registrada como error de método en `AVANCES-2026-08-06.md`
(el `md:p-20` de `GlassPanel` eran 160px verticales que el filtro anterior
no vio). Acá no se repite ese error.

Estados: **OK** (valor ∈ {8,16,24,32,48,80}px, o 128px si cumple la misma
función que la excepción del Hero) · **CAMBIAR** (valor arbitrario, hay
equivalente razonable en la escala) · **SIN CLASIFICAR** (no encaja, se
explica por qué).

### Institucional

| Sección | Clase hoy | Valor | Paso equiv. | ¿Coincide? | Componente compartido |
|---|---|---|---|---|---|
| Hero (`variant="centered"`) — apertura | `pt-40` | 160px | `pt-32` (128px, la excepción del Hero — misma función: compensar el header fijo) | **CAMBIAR** | Sí — `HeroSection.astro:137`, rama `centered`. Esta rama es exclusiva de Institucional (ninguna otra página usa `variant="centered"`), así que el cambio no arrastra otras páginas. |
| Hero — cierre | `pb-20` | 80px | — | **OK** | ídem |
| Hero — título | `mb-8` | 32px | — | **OK** | ídem |
| Hero — wrapper CTA (slot) | `mt-8` | 32px | — | **OK** | ídem |
| Separador tras Hero (×4: tras Hero, Misión, Visión, Equipo) | `my-16 md:my-24` (default del componente) | 64px / 96px | `my-12 md:my-12` (48px, igual al override que ya usa el Home) | **CAMBIAR** | **Sí — `CelestialLine.astro:12`, default.** Usado también en Proyectos (1×), Contacto (1×) y `ProyectoDetalle.astro` (1×, 7 proyectos × 2 idiomas = 14 páginas). Arreglar el default arregla las 4 instancias de Institucional Y arrastra Proyectos, Contacto y las 14 páginas de detalle — **NO** arrastra el Home porque el Home ya tiene su propio override (`class="my-12 md:my-12"`) que reemplaza el default en vez de sumarse a él. |
| Misión — margen de sección | `mb-32` | 128px | `mb-20` (80px, el margen uniforme entre secciones del Home) | **CAMBIAR** | No |
| Misión — eyebrow | `mb-6` | 24px | — | **OK** | No |
| Misión — título | `mb-8` | 32px | — | **OK** | No |
| Misión — círculo decorativo | `p-8` | 32px | — | **OK** | No |
| Misión — columna derecha | `space-y-8` | 32px | — | **OK** | No |
| Misión — dentro del `GlassPanel` (default, sin prop `padding`) | `space-y-6` | 24px | — | **OK** | Sí — `GlassPanel.astro` variante `lg` (`p-8 md:p-12` = 32/48px, ambos en escala). El default del componente no diverge del Home (el Home solo usa la variante `xl`, exclusiva de Vision Quote). |
| Misión — primer párrafo | `mb-8` | 32px | — | **OK** | No |
| Visión — margen de sección | `mb-32` | 128px | `mb-20` (80px) | **CAMBIAR** | No |
| Visión — eyebrow | `mb-6` | 24px | — | **OK** | No |
| Visión — paneles internos (×2) | `p-8 md:p-16 lg:p-20` | 32/64/80px | `p-8 md:p-12 lg:p-20`, o unificar a `p-12` fijo como el Home | **CAMBIAR** (el valor de `md:` es el problema: 64px no está en la escala) | No |
| Visión — título | `mb-10` | 40px | `mb-12` (48px — el Home usa `mb-12` para todos sus títulos de sección h2) | **CAMBIAR** | No |
| Visión — glifo decorativo | `mb-6` | 24px | — | **OK** | No |
| Visión — bloque decorativo (wrapper) | `mb-10` | 40px | `mb-12` (48px, misma razón) | **CAMBIAR** | No |
| Visión — blockquote | `mb-6` | 24px | — | **OK** | No |
| Visión — párrafos finales | `space-y-6` | 24px | — | **OK** | No |
| Equipo — margen de sección | `mb-32` | 128px | `mb-20` (80px) | **CAMBIAR** | No |
| Equipo — eyebrow | `mb-6` | 24px | — | **OK** | No |
| Equipo — fila título+subtítulo | `mb-14` | 56px | `mb-12` (48px, más cerca) | **CAMBIAR** | No |
| Equipo — título | `mb-4` | 16px | — | **OK** | No |
| Equipo — grid de tarjetas | `gap-8` | 32px | — | **OK** | Sí — `TeamCard.astro`, exclusivo de esta sección (no se usa en otra página) |
| CTA — margen de sección | `mb-20` | 80px | — | **OK** (ya coincide) | No |
| CTA — padding vertical | `py-24 md:py-32` | 96px / 128px | `py-20 md:py-20` (80px, igual al Newsletter del Home — mismo patrón visual: banner `bg-nebula rounded-3xl`) | **CAMBIAR** | No |
| CTA — eyebrow | `mb-6` | 24px | — | **OK** | No |
| CTA — título | `mb-8` | 32px | — | **OK** | No |
| CTA — subtítulo | `mb-10` | 40px | `mb-12` (48px, mismo motivo que Visión) | **CAMBIAR** | No |
| CTA — fila de botones | `gap-4` | 16px | — | **OK** | No |

**Institucional: 18 OK, 9 CAMBIAR, 0 sin clasificar.**

### Proyectos

| Sección | Clase hoy | Valor | Paso equiv. | ¿Coincide? | Componente compartido |
|---|---|---|---|---|---|
| Hero (`variant="default"`) — apertura | `pt-40` | 160px | `pt-32` (128px, misma razón que Institucional) | **CAMBIAR** | Sí — `HeroSection.astro:169`, rama `default`/`minimal`. Compartida con Archivo (ver abajo): arreglar esta rama cambia Proyectos **y** Archivo a la vez. |
| Hero — cierre | `pb-20` | 80px | — | **OK** | ídem |
| Hero — título | `mb-8` | 32px | — | **OK** | ídem |
| Hero — wrapper CTA (slot) | `mt-8` | 32px | — | **OK** | ídem |
| Separador tras Hero | `my-16 md:my-24` (default) | 64px / 96px | `my-12 md:my-12` (48px) | **CAMBIAR** | Sí — mismo caso que Institucional, ver nota ahí. |
| Grilla de Producciones — margen de sección | `mb-20` | 80px | — | **OK** (ya coincide exacto con el Home) | No |
| Grilla de Producciones — grid | `gap-8` | 32px | — | **OK** (idéntico al Home) | Sí — `ProjectCard.astro`, usado también en Home y Archivo. Su espaciado interno (`mb-5`, `space-y-2`, `pt-1`, `pt-3 mt-3`) es **idéntico en las tres páginas** — no diverge de nada, así que no hay "arrastre" que temer: tocar `ProjectCard` tocaría al Home también, pero no hace falta tocarlo porque ya es consistente. Nota aparte, no clasificado: esos valores internos (4px, 8px, 12px, 20px) tampoco están en la escala de 6 pasos — quedaron fuera del alcance de la unificación del 06/08 en las tres páginas por igual. |

**Proyectos: 4 OK, 2 CAMBIAR, 0 sin clasificar.** Es la página que menos se
aparta del Home — su sección de contenido ya es prácticamente idéntica.

### Archivo

| Sección | Clase hoy | Valor | Paso equiv. | ¿Coincide? | Componente compartido |
|---|---|---|---|---|---|
| Hero (`variant="default"`) — apertura | `pt-40` | 160px | `pt-32` (128px) | **CAMBIAR** | Sí — misma rama de `HeroSection.astro` que Proyectos. Un solo cambio arregla ambas páginas. |
| Hero — cierre | `pb-20` | 80px | — | **OK** | ídem |
| Hero — título | `mb-8` | 32px | — | **OK** | ídem |
| Hero — wrapper CTA (slot) | `mt-8` | 32px | — | **OK** | ídem |
| Grid de proyectos — margen de sección | `mb-20` | 80px | — | **OK** | No |
| Grid de proyectos — grid | `gap-6` | 24px | — | **OK** (levemente distinto de `gap-8` en Proyectos, pero ambos están en la escala) | Sí — `ProjectCard.astro`, ver nota en Proyectos. |

**Archivo: 4 OK, 1 CAMBIAR, 0 sin clasificar.** Es la única de las 4 sin
`CelestialLine` — **no importa** el separador ni lo usa en ningún punto de
la página (confirmado: no está en los imports de `Archivo.astro`). Por eso
no hereda el problema del default de `CelestialLine`.

### Contacto

| Sección | Clase hoy | Valor | Paso equiv. | ¿Coincide? | Componente compartido |
|---|---|---|---|---|---|
| Bloque hero-like (no usa `HeroSection`, es un `<section>` a mano) — apertura | `pt-32` | 128px | — | **OK** — coincide ya, por casualidad, con la excepción del Hero del Home | No |
| Bloque hero-like — cierre | `pb-16` | 64px | `pb-12` (48px, iguala el `pb-12` del Hero del Home) | **CAMBIAR** | No |
| Grid de 2 columnas (info / formulario) | `gap-16` | 64px | `gap-12` (48px, iguala el `gap-12` del grid del Hero del Home) | **CAMBIAR** | No |
| Eyebrow | `mb-6` | 24px | — | **OK** | No |
| Título (h1) | `mb-4` | 16px | — | **OK** | No |
| Tagline | `mb-12` | 48px | — | **OK** | No |
| Bloque de datos de contacto | `space-y-8` | 32px | — | **OK** | No |
| Cada dato (email/youtube/ubicación/respuesta, ×4) | `mb-2` | 8px | — | **OK** | No |
| Separador antes de redes sociales | `my-16 md:my-24` (default) | 64px / 96px | `my-12 md:my-12` (48px) | **CAMBIAR** | Sí — mismo caso que Institucional y Proyectos, ver nota ahí. |
| Panel del formulario (escrito a mano: `class="glass-panel rounded-2xl p-8 md:p-12"`, no usa el componente `GlassPanel`) | `p-8 md:p-12` | 32px / 48px | — | **OK** (coincide exacto con la variante `lg` del componente `GlassPanel`, aunque no lo use) | No — pero **observación**: podría simplificarse a `<GlassPanel>` sin prop `padding`, ya que el resultado es idéntico. Fuera de alcance de este relevamiento (es refactor, no espaciado), lo dejo anotado. |
| Título del formulario | `mb-8` | 32px | — | **OK** | No |
| `ContactForm.astro` — form | `space-y-6` | 24px | — | **OK** | No — exclusivo de Contacto |
| `ContactForm.astro` — fila de checkboxes/tags | `gap-2` | 8px | — | **OK** | No — exclusivo de Contacto |

**Contacto: 9 OK, 3 CAMBIAR, 0 sin clasificar.**

### Sin clasificar

**Ninguno.** Los 15 valores CAMBIAR de las 4 páginas tienen todos un
equivalente razonable en la escala de 6 pasos (o en la excepción de 128px),
sea por proximidad numérica o por analogía directa con un patrón que el
Home ya resolvió (el CTA de Institucional con el Newsletter del Home; el
grid 2-columnas de Contacto con el Hero split del Home).

## Paso 3 — Impacto esperado

### 1. Conteo por estado

| Página | OK | CAMBIAR | Sin clasificar | Total |
|---|---|---|---|---|
| Institucional | 18 | 9 | 0 | 27 |
| Proyectos | 4 | 2 | 0 | 6 |
| Archivo | 4 | 1 | 0 | 5 |
| Contacto | 9 | 3 | 0 | 12 |
| **Total** | **35** | **15** | **0** | **50** |

### 2. Componentes compartidos involucrados

| Componente | Qué cambiaría | Páginas que arrastra |
|---|---|---|
| `HeroSection.astro`, rama `variant="centered"` | `pt-40` → `pt-32` | Solo Institucional (única que usa esta rama) |
| `HeroSection.astro`, rama `variant="default"`/`minimal` | `pt-40` → `pt-32` | Proyectos **y** Archivo a la vez (comparten la misma rama) |
| `CelestialLine.astro`, default (`my-16 md:my-24`) | → `my-12 md:my-12` | Institucional (×4), Proyectos (×1), Contacto (×1), **y `ProyectoDetalle.astro` (×1, 7 proyectos × 2 idiomas = 14 páginas)**. Esta última no está en el alcance del pedido pero comparte el componente — **no arrastra el Home**, que ya tiene su propio override. |

`GlassPanel.astro` y `ProjectCard.astro` se comparten también, pero ninguno
de sus valores actuales diverge entre páginas (ver notas en Institucional y
Proyectos) — no requieren cambio para este pedido.

### 3. Inventario de cambios esperados en `dist/`

Contado sobre el build actual (`817b7bc`), por ocurrencia literal de la
clase vieja en cada `.html`:

| Archivo | `pt-40`→`pt-32` | `my-16`(CelestialLine)→`my-12` | `mb-32`→`mb-20` | `mb-10`→`mb-12` | `mb-14`→`mb-12` | `py-24`→`py-20` | `md:py-32`→`md:py-20` | `pb-16`→`pb-12` | `gap-16`→`gap-12` |
|---|---|---|---|---|---|---|---|---|---|
| `institucional/index.html` | 1 | 4 | 3 | 3 | 1 | 1 | 1 | 0 | 0 |
| `en/institucional/index.html` | 1 | 4 | 3 | 3 | 1 | 1 | 1 | 0 | 0 |
| `proyectos/index.html` | 1 | 1 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| `en/proyectos/index.html` | 1 | 1 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| `archivo/index.html` | 1 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| `en/archivo/index.html` | 1 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| `contacto/index.html` | 0 | 1 | 0 | 0 | 0 | 0 | 0 | 1 | 1 |
| `en/contacto/index.html` | 0 | 1 | 0 | 0 | 0 | 0 | 0 | 1 | 1 |
| `proyectos/{7 slugs}/index.html` (×7) | 0 | 1 c/u (7 total) | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| `en/proyectos/{7 slugs}/index.html` (×7) | 0 | 1 c/u (7 total) | 0 | 0 | 0 | 0 | 0 | 0 | 0 |

También cambiaría, en el mismo `keystatic-page.[hash].js` que ya vimos en
los últimos dos PR, si se toca `keystatic.config.mjs` — pero este pedido no
lo requiere (es solo espaciado, no hay campos nuevos). Si la implementación
no toca ese archivo, ese chunk no debería aparecer en el diff esta vez, y
el semáforo pasaría a ser diff vacío absoluto en `dist/client` — **no** el
patrón "keystatic-page + nada más" de los últimos dos cierres.

**Total de `.html` que deberían cambiar si se implementan las 3 páginas +
el componente compartido de `CelestialLine`: 22** (8 de las 4 páginas + 14
de detalle de proyecto). Si `CelestialLine` se resuelve aparte o con
overrides por página en vez de tocar el default, ese número baja a 8.

### 4. Orden de implementación propuesto

1. **Archivo** (menor riesgo: 1 sola clase a cambiar, `pt-40`→`pt-32` en la
   rama `default` de `HeroSection`, sin `CelestialLine` de por medio — el
   cambio más chico y más aislado de los cuatro).
2. **Proyectos** (2 clases, comparte la rama `default` de `HeroSection` con
   Archivo — si el PR de Archivo ya la corrigió, este PR hereda ese arreglo
   y solo le queda el `CelestialLine`).
3. **Contacto** (3 clases, todas propias de la página, sin compartir rama
   de `HeroSection` con nadie — algo más grande que Proyectos pero
   autocontenido).
4. **Institucional, último y en un PR aparte** (9 clases, la rama
   `centered` de `HeroSection` es exclusiva suya, y es la página con más
   superficie tocada — el mayor riesgo de los cuatro, mejor dejarla para
   cuando ya haya 3 PR de este tipo validados).

**Decisión previa a la implementación, no mía:** qué hacer con el default
de `CelestialLine.astro`. Tocarlo ahí (un solo lugar) resuelve Institucional
+ Proyectos + Contacto de una vez, pero arrastra las 14 páginas de detalle
de proyecto, fuera del alcance nombrado en el pedido. La alternativa es
pasar `class="my-12 md:my-12"` como override en cada uno de los 6 call
sites de las 3 páginas (igual que ya hace el Home), sin tocar el default —
más repetitivo, pero dejaría `ProyectoDetalle.astro` exactamente como está
hasta que alguien lo pida explícitamente.
