# Relevamiento de rótulos y strings — solo lectura

Sesión 13/08. Documento de diagnóstico para decidir la implementación de
deuda 22 y deuda 28 (ver `AVANCES-2026-08-12.md`, secciones 15 y 16). No
contiene propuestas de implementación: solo describe lo que hay hoy en el
código.

---

## Tarea 1 — Rótulos de sección duplicados (deuda 22)

### a) Ocurrencias de los rótulos de menú (una fila por ocurrencia)

| Rótulo ES | Rótulo EN | Archivo | Línea |
|---|---|---|---|
| Inicio | Home | `src/components/Header.astro` | 14 |
| Institucional | About | `src/components/Header.astro` | 15 |
| Producciones | Productions | `src/components/Header.astro` | 16 |
| Contacto | Contact | `src/components/Header.astro` | 17 |
| Archivo | Archive | `src/components/Header.astro` | 18 |
| Inicio | Home | `src/components/Footer.astro` | 20 |
| Institucional | About | `src/components/Footer.astro` | 21 |
| Producciones | Productions | `src/components/Footer.astro` | 22 |
| Archivo | Archive | `src/components/Footer.astro` | 23 |

`Footer.astro` no tiene link a Contacto (su `navLinks` trae 4 entradas, no
5). Los otros 4 rótulos están duplicados palabra por palabra entre Header
y Footer, cada uno con su propio array `navLinks` hardcodeado — confirma
la premisa del acta.

### b) Grep sitewide — ¿hay un tercer lugar?

Grep de cada texto (ES y EN, con comillas para evitar falsos positivos)
sobre `src/` completo. Aparte de Header y Footer, aparece un **tercer
lugar** para los 5 pares: el campo SEO `title` de cada singleton de
página en Keystatic, con el patrón `Nautas — {Rótulo}`:

| Rótulo | Campo | Archivo | Línea |
|---|---|---|---|
| Inicio / Home | `title` | `src/content/pages/inicio.yaml` | 251–253 |
| Institucional / About | `title` | `src/content/pages/institucional.yaml` | 175–177 |
| Producciones / Productions | `title` | `src/content/pages/proyectos.yaml` | 14–16 |
| Archivo / Archive | `title` | `src/content/pages/archivo.yaml` | 7–9 |
| Contacto / Contact | `title` | `src/content/pages/contacto.yaml` | 40–42 |

Esto **ya vive en el CMS** (no es un hardcodeo nuevo), pero es un cuarto
lugar semántico donde el mismo texto se repite si se cuenta junto a
Header/Footer: hoy son 2 lugares hardcodeados + 1 lugar en CMS por
rótulo (Contacto solo tiene 1 hardcodeado + 1 en CMS, al faltar en
Footer).

Además, un **cuarto lugar puntual** solo para Inicio/Home: un fallback
hardcodeado en el propio componente de página.

```
src/components/pages/Inicio.astro:46
title={t(d?.title) ?? (locale === 'en' ? 'Home' : 'Inicio')}
```

Verifiqué los otros 4 componentes de página (`Institucional.astro:21`,
`Proyectos.astro:21`, `Archivo.astro:20`, `Contacto.astro:15`): todos
usan `t(d?.title) ?? ''` — fallback vacío, sin texto hardcodeado. El caso
de Inicio.astro es aislado, no un patrón repetido en las 5 páginas.

No aparece ninguno de los 10 textos (ES/EN × 5 rótulos) en títulos SEO
de otras páginas, textos de CTA, `aria-label` ni `alt` fuera de lo ya
listado.

### c) Inventario de `ui/textos.yaml` ("Textos de interfaz")

Definido en `keystatic.config.mjs:407-498` como singleton `ui`, path
`src/content/ui/textos`. 17 campos, todos con la misma forma:

```js
campo_en_snake_case: fields.object({
  es: fields.text({ label: 'Español' }),
  en: fields.text({ label: 'Inglés' }),
}, { label: 'Grupo — Descripción corta' }),
```

Convención: clave en `snake_case` en inglés/descriptivo
(`voices_eyebrow`, `episodes_count_label`, `related_title`...), cada uno
con sub-claves `es`/`en`, y un `label` de Keystatic con el patrón
`Sección del detalle — Descripción`. Todos los campos de este singleton
son textos que aparecen en la página de detalle de proyecto (`Detalle —
...`) o en la sección de relacionados (`Relacionados — ...`) — es
exclusivamente para textos que se repiten en todas las páginas de
proyecto, según el comentario en `keystatic.config.mjs:403-406`.

Campos existentes: `back_to_archive`, `voices_eyebrow`, `voices_title`,
`phases_eyebrow`, `phases_title`, `trailer_title`, `trailer_label`,
`episodes_title`, `episodes_count_label`, `project_cta_eyebrow`,
`project_cta_title`, `project_cta_text`, `related_eyebrow`,
`related_title`, `read_more`, `read_less`, `episodes_separator`,
`episode_item_label`, `now_playing_label` (19 campos — corrijo: conté
19, no 17, al listarlos uno por uno).

Ningún campo de este singleton se refiere a los rótulos de sección del
menú (Inicio, Institucional, Producciones, Contacto, Archivo). Confirma
la premisa: no existe archivo de traducciones central para el menú.

### d) ¿Rótulo del menú y H1 son el mismo texto?

**No, son campos distintos con textos distintos en las 5 páginas.** El
H1 de cada página viene del campo `hero_title`, leído vía
`t(d?.hero_title)` y renderizado con `set:html={em(...)}` dentro de
`HeroSection`:

| Página | Rótulo de menú (ES) | H1 / `hero_title` (ES) | Archivo del H1 |
|---|---|---|---|
| Inicio | Inicio | Arte, Ciencia *y Consciencia* | `content/pages/inicio.yaml:4-6` |
| Institucional | Institucional | Una nave compartida, *un mismo destino.* | `content/pages/institucional.yaml:1-3` |
| Producciones | Producciones | Expediciones *y Producciones* | `content/pages/proyectos.yaml:4-6` |
| Archivo | Archivo | Archivo Náutico | `content/pages/archivo.yaml:1-3` |
| Contacto | Contacto | Escribinos. | `content/pages/contacto.yaml:4-6` |

Son dos campos separados en las 5 páginas (`hero_title` para el H1,
sin relación de datos con el string hardcodeado del rótulo de menú). El
único solapamiento parcial es Producciones, cuyo H1 contiene la palabra
"Producciones" dentro de una frase más larga — pero no es el mismo
campo ni el mismo string exacto.

---

## Tarea 2 — "Proyecto/Proyectos" en `keystatic.config.mjs` (deuda 28)

24 ocurrencias en 24 líneas (case-insensitive, `proyecto|proyectos|
project|projects`), clasificadas:

| Línea | Ocurrencia (resumen) | Clasificación | Nota |
|---|---|---|---|
| 11 | `project: 'nautas/nautas'` (config de Keystatic Cloud) | **ESTRUCTURA** | Falso positivo temático: "project" acá es el slug del repositorio en Keystatic Cloud, no tiene relación con la colección de Proyectos. Lo consume el servicio de Keystatic Cloud para autenticar/rutear — no se toca. |
| 257 | clave de campo `cta_button_projects` | ESTRUCTURA | Clave de schema; la consume `content.config.ts:65` (`cta_button_projects: bi.optional()`) y cualquier `institucional.yaml` ya guardado con esa clave. |
| 262 | `description: '...página de Proyectos.'` | DISPLAY | Texto de ayuda en el panel. Grep confirma que no se repite en `src/`. |
| 275 | clave `proyectos:` del singleton | **DUDOSO** | Ver nota abajo. |
| 276 | `label: 'Página: Proyectos'` | DISPLAY | Nombre del singleton en el panel. No se repite en `src/`. |
| 277 | `path: 'src/content/pages/proyectos'` | ESTRUCTURA | Determina el nombre de archivo `proyectos.yaml`, leído por `getEntry('pages', 'proyectos')` en `Proyectos.astro:12`. Cambiarlo mueve el archivo y rompe esa llamada. |
| 403 | comentario: "...páginas de proyecto..." | NO SÉ | Ver nota abajo. |
| 404 | comentario: "...afecta a todos los proyectos" | NO SÉ | Ídem. |
| 448 | clave de campo `project_cta_eyebrow` | ESTRUCTURA | La consume `content.config.ts:145` y `ProyectoDetalle.astro` (vía `ui?.data.project_cta_eyebrow`, ver Tarea 1c). |
| 452 | clave de campo `project_cta_title` | ESTRUCTURA | Ídem, `content.config.ts:146`. |
| 456 | clave de campo `project_cta_text` | ESTRUCTURA | Ídem, `content.config.ts:147`. |
| 481 | `description: '...proyectos que tienen adelanto...'` | DISPLAY | Texto de ayuda. No se repite en `src/`. |
| 501 | clave de colección `projects:` | ESTRUCTURA | Es el identificador central: `content.config.ts:82-83,160` define `projectsCollection` sobre el mismo nombre, y 6 archivos `.astro` llaman `getCollection('projects')` (`Archivo.astro:16`, `Inicio.astro:20`, `ProyectoDetalle.astro:18`, `Proyectos.astro:17`, `pages/producciones/[...slug].astro:7`, `pages/en/productions/[...slug].astro:7`). |
| 502 | `label: 'Proyectos'` | **DISPLAY** | El rótulo exacto que nombra la deuda 28. Grep confirma que la cadena `'Proyectos'` no aparece en ningún otro lugar de `src/`. |
| 504 | `path: 'src/content/projects/*'` | ESTRUCTURA | El directorio real donde viven los 7 `.yaml` de proyectos ya editados. No se toca — coincide con la advertencia explícita del pedido. |
| 507 | `description` del campo `title` (menciona "proyecto" 2 veces) | DISPLAY | Texto de ayuda genérico, no el rótulo. |
| 510 | `description` del campo `order` (menciona "proyecto"/"proyectos" 3 veces) | DISPLAY | Ídem. |
| 514 | `description` del campo `kind` ("Categoría del proyecto...") | DISPLAY | Ídem. Ver también Tarea 3. |
| 532 | `description` del campo `featured` ("el proyecto aparece...") | DISPLAY | Ídem. |
| 537 | `description` del campo `tagline` ("resume el proyecto.") | DISPLAY | Ídem. |
| 545 | `directory: 'public/images/projects'` | ESTRUCTURA | Directorio real de imágenes ya subidas por las editoras (`heroImage`). No se toca. |
| 546 | `publicPath: '/images/projects/'` | ESTRUCTURA | Prefijo de URL pública ya embebido en los YAML de proyectos existentes (`heroImage`). Cambiarlo rompe las imágenes ya cargadas. |
| 550 | `description` del campo `featuredVideoId` ("...proyecto no tiene trailer.") | DISPLAY | Texto de ayuda genérico. |
| 624 | `description` del campo `voices` (menciona "proyecto" 2 veces) | DISPLAY | Ídem. |

**Nota sobre la línea 275 (DUDOSO):** la clave `proyectos:` dentro de
`singletons: { ... }` no está acoplada de forma directa al mismo
mecanismo que la colección `projects` (línea 501) — el dato real que
lee el código (`getEntry('pages', 'proyectos')`) viene del `path`
(línea 277), no de esta clave. Pero la clave sí determina la URL del
panel de administración de Keystatic (`/keystatic/singleton/proyectos`)
y no encontré forma de confirmar, sin correr Keystatic, si algo más la
consume por nombre. La dejo en DUDOSO en vez de forzarla a DISPLAY o
ESTRUCTURA.

**Nota sobre líneas 403–404 (NO SÉ):** son comentarios de código, no
strings que se muestren en ningún lado (ni panel ni sitio). No encajan
en la definición de DISPLAY del pedido ("se muestra en la interfaz del
panel"), pero tampoco son ESTRUCTURA (no son clave/path/slug). Quedan
sin clasificar limpio.

**Resultado de la verificación pedida para cada DISPLAY:** ninguno de
los strings clasificados como DISPLAY (rótulos, `label`, ni las frases
de `description`) aparece duplicado en otro lugar de `src/`. El único
lugar acoplado a algo es la línea 502 (`label: 'Proyectos'`) por ser
exactamente el string que la deuda 28 quiere cambiar, y ese cambio no
tiene ningún otro consumidor: es display puro.

**Conclusión para deuda 28:** ningún hallazgo sugiere que cambiar el
`label` de la línea 502 rompa o mueva contenido. La colección
(`projects`, línea 501), el path (`src/content/projects/*`, línea 504)
y los directorios de imagen (líneas 545–546) son los elementos
ESTRUCTURA que efectivamente no se deben tocar, y son distintos del
`label` que se quiere cambiar.

---

## Tarea 3 — Categorías reales del campo Tipo

**Premisa a verificar, resultado: parcialmente falsa.** El acta da por
hecho que "el campo Tipo (kind) tiene una lista de opciones definida en
`keystatic.config.mjs`". No es así: es un campo de **texto libre**, no
un `fields.select` con `options`.

```js
// keystatic.config.mjs:514
kind: fields.text({ label: 'Tipo', description: 'Categoría del proyecto
  que se muestra en la tarjeta. Ej: Serie Documental, Podcast, Programa
  Educativo.', validation: { isRequired: true } }),
```

```ts
// src/content.config.ts:87
kind: z.string(),
```

`content.config.ts` tampoco declara un enum: también es `z.string()`
libre. No evalué esto como un PARÁ (el campo existe, se llama `kind`,
solo que no está restringido a opciones) — sigue el criterio del pedido
de no forzar la tabla si el hallazgo cambia el tamaño de la tarea:
adapto la comparación de "opciones declaradas" a "ejemplos mencionados
en la `description`", que es lo único que existe.

| Ejemplos en `description` de `keystatic.config.mjs` | Enum en `content.config.ts` | Valores reales en `src/content/projects/*.yaml` |
|---|---|---|
| Serie Documental | — (no declarado, `z.string()` libre) | Serie Documental *(3 proyectos: hermanita-sudamerica, pulso-terrestre, voces-de-la-tierra)* |
| Podcast | — | Podcast *(el-nexo)* |
| Programa Educativo | — | Programa Educativo *(educare)* |
| — | — | **Programa de Salud** *(holomedicina)* — no mencionado como ejemplo |
| — | — | **Programa de Educación Ambiental** *(sustento-gaia)* — no mencionado como ejemplo |

Confirmado contra los 7 archivos de contenido
(`grep -n "^kind:" src/content/projects/*.yaml`): el dato de partida del
acta es correcto — "Programa de Salud" y "Programa de Educación
Ambiental" sí están presentes en el contenido y **no** están entre los
3 ejemplos que menciona la `description` del campo en Keystatic.

Como no hay opciones "declaradas" en sentido estricto (ni en
`keystatic.config.mjs` ni en `content.config.ts`), no aplica la
categoría "opciones declaradas que ningún proyecto usa" — los 3
ejemplos del texto de ayuda sí tienen al menos un proyecto real que los
usa. Los 5 valores reales son: Serie Documental, Podcast, Programa
Educativo, Programa de Salud, Programa de Educación Ambiental — sobre
7 proyectos totales.

---

## Tarea 4 — Los 9 strings pendientes de Inicio

### a) `INVENTARIO-1c2.md`

**Existe**, en la raíz del repo. Fue rescatado a `main` el 04/08 según
su propia nota de contexto. Documenta un inventario de strings
hardcodeados hecho el 03/08, sobre la estructura de archivos anterior a
la unificación ES/EN (`src/pages/index.astro` en vez del actual
`src/components/pages/Inicio.astro`).

Identifiqué "los 9 strings pendientes de Inicio" como las filas #02,
#03, #09, #10, #11, #12, #14, #17, #19 de la tabla del documento — son
las 9 filas de `index.astro` clasificadas como **EDITORIAL** (contenido
propiamente dicho, ni CHROME —nav/UI compartida— ni TECNICO —ya en CMS
en ese momento—). El documento no usa la frase "9 strings" en ningún
lado; es una cuenta que reconstruí filtrando su propia tabla por
clasificación y archivo. La marco como interpretación, no como dato
explícito del inventario.

### b) Estado hoy de cada uno

Verificado contra `src/components/pages/Inicio.astro` y
`src/content/pages/inicio.yaml` (el componente que reemplazó a
`index.astro` tras la unificación ES/EN).

| # inventario | Texto ES (03/08) | Estado hoy | Campo CMS / motivo | Archivo y línea |
|---|---|---|---|---|
| #02 | Quiénes somos / About us | EN CMS | `hero_cta_secondary` | `inicio.yaml:59-61`, usado en `Inicio.astro:72` |
| #03 | tres caminos, un horizonte | EN CMS | `pillars_eyebrow` | `inicio.yaml:62-64`, usado en `Inicio.astro:97` |
| #09 | destacado / featured | EN CMS | `featured_eyebrow` | `inicio.yaml:213-215`, usado en `Inicio.astro:148` |
| #10 | Producción *Destacada* / Featured *Production* | EN CMS | `featured_title` | `inicio.yaml:216-218`, usado en `Inicio.astro:150-152` (antes tenía fallback hardcodeado sin campo CMS; hoy no) |
| #11 | Ver proyecto / View project | YA NO EXISTE | — | No aparece en ningún archivo de `src/`. El botón de esa sección hoy dice "Ver producciones" (`featured_cta`, `inicio.yaml:219-221`), texto distinto, no una migración 1:1 |
| #12 | archivo / archive (link) | YA NO EXISTE | — | No aparece en `Inicio.astro` ni en `inicio.yaml`. La sección que lo contenía ya no está en el diseño actual |
| #14 | en el horizonte / on the horizon | YA NO EXISTE | — | No aparece en ningún archivo de `src/` |
| #17 | bitácora / logbook | EN CMS | `newsletter_eyebrow` | `inicio.yaml:232-234`, usado en `Inicio.astro:258` |
| #19 | embarcate / embark | EN CMS | `newsletter_cta` | `inicio.yaml:248-250`, usado en `Inicio.astro:297` |

### c) Conclusión

**Están todos cerrados.** De los 9: 6 se migraron a campos del CMS
(`hero_cta_secondary`, `pillars_eyebrow`, `featured_eyebrow`,
`featured_title`, `newsletter_eyebrow`, `newsletter_cta`) y 3 ya no
existen en el sitio — el rediseño de Inicio (entre el 03/08 y esta
sesión) eliminó las secciones que los contenían, no los reemplazó campo
por campo.

No queda ningún string de los 9 hardcodeado hoy. La explicación de por
qué la tabla de deudas del 12/08 no los menciona es la primera de las
dos hipótesis del pedido: se cerraron y nadie lo anotó explícitamente
como cierre de "Fase 1c-2" en ningún acta — simplemente dejaron de
existir como pendiente porque el código que los contenía cambió.

---

## Hallazgos no pedidos

1. **El conteo de campos de `ui/textos.yaml`**: la Tarea 1c pedía
   "inventario", no un número — pero como referencia, son **19 campos**,
   no una cantidad redonda. Lo señalo porque una futura implementación de
   deuda 22 podría razonablemente sumar 5 campos más (uno por rótulo de
   menú) a este mismo singleton, dado que ya sigue la convención
   `snake_case` + `es`/`en`.

2. **`cta_button_projects` (línea 257) es un nombre de campo que ya
   colisiona conceptualmente con la deuda 28**: es el botón de
   Institucional que lleva a la página de Proyectos/Producciones. Su
   clave interna dice `projects` aunque el sitio ya diga "Producciones"
   en todos lados. No es parte de lo que pide la Tarea 2 (esa tarea es
   sobre `keystatic.config.mjs`, y esta clave sí está ahí, ya la incluí
   en la tabla), pero lo marco porque es la misma inconsistencia de
   nombre que la deuda 28, en un lugar distinto al `label` de la
   colección.

3. **`related_title` de `ui/textos.yaml`** dice "Producciones
   Relacionadas" / "Related Productions" (`content/ui/textos.yaml:41-42`)
   — ya usa "Producciones", no "Proyectos". Confirma que el sitio público
   es consistente en "Producciones"; la inconsistencia de deuda 28 vive
   solo del lado del panel de Keystatic.

4. **`Proyectos.astro` (componente) y `ProyectoDetalle.astro` mantienen
   ese nombre de archivo** aunque rendericen las rutas
   `/producciones` y `/producciones/[slug]`. Es coherente con la
   categoría ESTRUCTURA de la Tarea 2 (nombres de archivo/identificador,
   no rótulos), lo señalo solo para que quede registrado que la
   inconsistencia de nombres no es exclusiva de `keystatic.config.mjs`.

---

## Resumen ejecutivo

- **Tarea 1 (deuda 22):** confirmado — 4 de 5 rótulos duplicados en
  Header y Footer (Contacto solo en Header). Tercer lugar real: el
  campo SEO `title` de cada página, ya en CMS. Cuarto lugar puntual:
  fallback hardcodeado en `Inicio.astro:46`, no repetido en las otras 4
  páginas. `ui/textos.yaml` tiene 19 campos, ninguno para el menú. El
  rótulo del menú y el H1 (`hero_title`) son campos y textos distintos
  en las 5 páginas.
- **Tarea 2 (deuda 28):** de 24 ocurrencias, la mayoría de las
  "estructura" son claves de colección/singleton, paths de archivo y
  directorios de imágenes — ninguna coincide con el `label: 'Proyectos'`
  (línea 502) que la deuda 28 quiere cambiar. Ese `label` es display
  puro, sin otro consumidor en `src/`. Una clave de singleton (línea
  275) quedó en DUDOSO y dos comentarios de código en NO SÉ.
- **Tarea 3 (campo Tipo):** el campo `kind` **no** declara opciones ni
  en `keystatic.config.mjs` ni en `content.config.ts` — es texto libre
  en ambos. El dato del acta se confirma: "Programa de Salud" y
  "Programa de Educación Ambiental" son valores reales en el contenido
  y no están entre los 3 ejemplos que menciona la ayuda del campo.
- **Tarea 4 (9 strings de Inicio):** todos cerrados. 6 migraron a
  campos CMS, 3 ya no existen tras el rediseño de la página. Ninguno
  sigue hardcodeado.
