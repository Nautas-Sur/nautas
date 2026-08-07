# Relevamiento — Deuda 11: el panel de Keystatic campo por campo

Relevamiento de solo lectura. No se modificó ningún archivo de `src/`, `public/`
ni `keystatic.config.mjs`, ni ningún `.yaml`. Único archivo creado: este
documento. En ningún momento se abrió el panel de producción
(`project-43ure.vercel.app/keystatic`) — todo el recorrido visual (Tarea 4) fue
contra `http://localhost:4321/keystatic`, con storage local.

## Punto de partida

```
$ git checkout main
$ git pull
Updating f21b3a1..ecf29cd
Fast-forward
 public/images/og-default.jpg               | Bin 0 -> 192792 bytes
 src/components/pages/ProyectoDetalle.astro |   1 +
 src/layouts/BaseLayout.astro               |   2 +-
 3 files changed, 2 insertions(+), 1 deletion(-)

$ git status
On branch main
Your branch is up to date with 'origin/main'.
nothing to commit, working tree clean

$ git checkout -b relevamiento-panel-keystatic
Switched to a new branch 'relevamiento-panel-keystatic'
```

HEAD del relevamiento: `ecf29cd` (merge de `fix-og-image`).

## La pregunta que ordena el relevamiento

Para cada campo del panel: **¿alguien lo lee, y hace lo que la editora
esperaría al verlo?** Tres categorías:

- **HUÉRFANO** — en el panel, sin consumidor. Se edita y no pasa nada.
- **INCONSISTENTE** — se consume, pero con comportamiento distinto según
  dónde, o de forma que contradice lo que el panel promete.
- **OK** — se consume, de una sola forma, coherente con lo que el panel dice.

---

## Tarea 1 — Inventario desde el panel

Recorrido campo por campo de `keystatic.config.mjs` (fuente de verdad), con su
consumidor real buscado en el código — no al revés.

### Singleton `inicio` (`Inicio.astro`)

| Campo | Label | Consumidor | Cómo se imprime | Categoría |
|---|---|---|---|---|
| `hero_eyebrow` | Portada — Etiqueta superior | `Inicio.astro:52` (prop `eyebrow`→`HeroSection`) | prop a componente → `{expresión}` plano | OK |
| `hero_title` | Portada — Título principal | `Inicio.astro:53` | `em()` + `set:html` (vía `HeroSection`, todas las variantes) | INCONSISTENTE — ver §3.2 |
| `hero_subtitle` | Portada — Texto de presentación | `Inicio.astro:54-55` | `em()` + `set:html` (única página con `subtitleReadMore={true}`) | INCONSISTENTE — ver §3.2 |
| `pillars_title` | Pilares — Título de sección | `Inicio.astro:100` | `set:html` directo | OK |
| `pillar_arte_title` | Pilares — Arte: título | `Inicio.astro:27` | `{expresión}` plano | OK |
| `pillar_arte_desc` | Pilares — Arte: descripción | `Inicio.astro:28,132` (`em()` → prop `text=`→`ReadMore`) | `set:html` | OK |
| `pillar_ciencia_title` | Pilares — Ciencia: título | `Inicio.astro:32` | plano | OK |
| `pillar_ciencia_desc` | Pilares — Ciencia: descripción | `Inicio.astro:33,132` | `set:html` | OK |
| `pillar_consciencia_title` | Pilares — Consciencia: título | `Inicio.astro:37` | plano | OK |
| `pillar_consciencia_desc` | Pilares — Consciencia: descripción | `Inicio.astro:38,132` | `set:html` | OK |
| `vision_quote` | Cita de visión | `Inicio.astro:231` | plano (`<blockquote>`) | OK |
| `newsletter_title` | Newsletter — Título | `Inicio.astro:260` | plano | OK |
| `newsletter_subtitle` | Newsletter — Subtítulo | `Inicio.astro:264` | plano | OK |
| `title` | SEO — Título para buscadores | `Inicio.astro:45` | prop a `BaseLayout` → `<title>` (texto) + `content=` de `og:title` | OK |
| `description` | SEO — Descripción para buscadores | `Inicio.astro:46` | prop a `BaseLayout` → `content=` de `meta description`/`og:description` | OK |

### Singleton `institucional` (`Institucional.astro`)

| Campo | Label | Consumidor | Cómo se imprime | Categoría |
|---|---|---|---|---|
| `hero_title` | Portada — Título principal | `:23` | `em()`+`set:html` | INCONSISTENTE |
| `hero_subtitle` | Portada — Texto de presentación | `:24` (sin `subtitleReadMore`) | plano | INCONSISTENTE |
| `mission_eyebrow` | Misión — etiqueta sobre el título | `:32` | plano | OK |
| `mission_title` | Misión — Título | `:37` | `em()`+`set:html` | OK |
| `mission_p1` | Misión — Párrafo 1 | `:50` | plano (condicional `d?.mission_p1 &&`) | OK |
| `mission_p2` | Misión — Párrafo 2 | `:52` | plano | OK |
| `mission_p3` | Misión — Párrafo 3 | `:53` | plano | OK |
| `mission_p4` | Misión — Párrafo 4 | `:54` | plano | OK |
| `mission_p5` | Misión — Párrafo 5 | `:55` | plano | OK |
| `mission_cta` | Misión — Frase de cierre | `:56-58` | plano | OK |
| `vision_eyebrow` | Visión — etiqueta sobre el título | `:70` | plano | OK |
| `vision_title` | Visión — Título | `:76` | `em()`+`set:html` | OK |
| `vision_p1` | Visión — Párrafo 1 | `:79` | plano | OK |
| `vision_p2` | Visión — Párrafo 2 | `:80` | plano | OK |
| `vision_p3` | Visión — Párrafo 3 | `:81` | plano | OK |
| `vision_blockquote` | Visión — Cita destacada | `:87-91` | plano (`<blockquote>`, condicional) | OK |
| `vision_p4` | Visión — Párrafo 4 | `:94` | plano | OK |
| `vision_p5` | Visión — Párrafo 5 | `:95` | plano | OK |
| `team_eyebrow` | Equipo — etiqueta sobre el título | `:113` | plano | OK |
| `team_title` | Equipo — Título | `:118` | `em()`+`set:html` | OK |
| `team_subtitle` | Equipo — Subtítulo | `:121` | plano | OK |
| `cta_eyebrow` | Cierre — etiqueta sobre el título | `:145` | plano | OK |
| `cta_title` | Llamado final — Título | `:148` | `em()`+`set:html` | OK |
| `cta_subtitle` | Llamado final — Subtítulo | `:151` | plano | OK |
| `cta_button_contact` | Cierre — texto del botón principal | `:158` | plano (texto de link) | OK |
| `cta_button_projects` | Cierre — texto del botón secundario | `:165` | plano (texto de link) | OK |
| `title` | SEO — Título para buscadores | `:19` | prop a `BaseLayout` | OK |
| `description` | SEO — Descripción para buscadores | `:19` | prop a `BaseLayout` | OK |

### Singleton `proyectos` (`Proyectos.astro`)

| Campo | Label | Consumidor | Cómo se imprime | Categoría |
|---|---|---|---|---|
| `hero_eyebrow` | Portada — Etiqueta superior | `:26` (prop `eyebrow`) | plano | OK |
| `hero_title` | Portada — Título principal | `:27` | `em()`+`set:html` | INCONSISTENTE |
| `hero_subtitle` | Portada — Texto de presentación | `:28` | plano | INCONSISTENTE |
| `completed_title` | Secciones — Título de Producciones | — | **no se consume** | **HUÉRFANO** (con datos: `*Producciones*` / `*Productions*`) |
| `in_dev_title` | Secciones — Título de En Desarrollo | — | **no se consume** | **HUÉRFANO** (con datos: `En *Desarrollo*` / `In *Development*`) |
| `title` | SEO — Título para buscadores | `:20` | prop a `BaseLayout` | OK |
| `description` | SEO — Descripción para buscadores | `:21` | prop a `BaseLayout` | OK |

### Singleton `archivo` (`Archivo.astro`)

| Campo | Label | Consumidor | Cómo se imprime | Categoría |
|---|---|---|---|---|
| `hero_eyebrow` | Portada — Etiqueta superior | — | **no se consume**: `Archivo.astro` no pasa `eyebrow` a `<HeroSection>` (confirmado por `grep -n "hero_eyebrow" src/components/pages/Archivo.astro`, sin resultados) | **HUÉRFANO** (sin datos hoy: la clave ni siquiera existe en `archivo.yaml`) |
| `hero_title` | Portada — Título principal | `:25` | `em()`+`set:html` | INCONSISTENTE |
| `hero_subtitle` | Portada — Texto de presentación | `:26` | plano | INCONSISTENTE |
| `title` | SEO — Título para buscadores | `:19` | prop a `BaseLayout` | OK |
| `description` | SEO — Descripción para buscadores | `:20` | prop a `BaseLayout` | OK |

### Singleton `contacto` (`Contacto.astro`)

`Contacto.astro` no importa `em()` — ningún campo de esta página soporta
asteriscos, y el panel tampoco lo promete en ninguno (el único que podría
confundir, `hero_title`, no tiene `ASTERISK_HINT`).

| Campo | Label | Consumidor | Cómo se imprime | Categoría |
|---|---|---|---|---|
| `contact_eyebrow` | Encabezado — etiqueta sobre el título | `:23` | plano | OK |
| `hero_title` | Portada — Título principal | `:26` | plano (sin `em()`) | INCONSISTENTE |
| `contact_tagline` | Portada — Texto de presentación | `:29` | plano | OK |
| `email_label` | Datos — Etiqueta del campo de email | `:35` | plano | OK |
| `email` | Datos — Dirección de email | `:37-38` | atributo HTML (`href="mailto:..."`) + plano | OK |
| `youtube_label` | Datos — Etiqueta del campo de YouTube | `:44` | plano | OK |
| `youtube_url` | Datos — Link de YouTube | `:46` | atributo HTML (`href=`) | OK |
| `youtube_display` | Datos — Texto visible del link de YouTube | `:47` | plano | OK |
| `location_label` | Datos — Etiqueta del campo de ubicación | `:53` | plano | OK |
| `location` | Datos — Ubicación | `:56` | plano | OK |
| `response_label` | Datos — Etiqueta del tiempo de respuesta | `:62` | plano | OK |
| `response_time` | Datos — Tiempo de respuesta | `:65` | plano | OK |
| `form_title` | Formulario — Título | `:127` | plano | OK |
| `title` | SEO — Título para buscadores | `:14` | prop a `BaseLayout` | OK |
| `description` | SEO — Descripción para buscadores | `:15` | prop a `BaseLayout` | OK |

### Singleton `ui` ("Textos de interfaz")

Los 19 campos se consumen en `ProyectoDetalle.astro`, salvo `read_more` /
`read_less` que también se usan en `Inicio.astro` (pilares y destacado) como
props de `ReadMore`. Ninguno pasa por `em()`.

| Campo | Label | Consumidor | Cómo se imprime | Categoría |
|---|---|---|---|---|
| `back_to_archive` | Detalle — Link de vuelta al archivo | `ProyectoDetalle.astro:83` | plano | OK |
| `voices_eyebrow` | Detalle — Voces: etiqueta superior | `:158` | plano | OK |
| `voices_title` | Detalle — Voces: título | `:160` | plano | OK |
| `phases_eyebrow` | Detalle — Fases: etiqueta superior | `:175` | plano | OK |
| `phases_title` | Detalle — Fases: título | `:177` | plano | OK |
| `trailer_title` | Detalle — Trailer: título | `:210` | prop `title`→`EpisodeList` (trailer) → plano | OK |
| `trailer_label` | Detalle — Trailer: etiqueta | `:211` | prop `label`→`EpisodeList` → plano | OK |
| `episodes_title` | Detalle — Episodios: título | `:214` | prop `title`→`EpisodeList` → plano | OK |
| `episodes_count_label` | Detalle — Episodios: palabra del contador | `:215` | interpolado en `countLabel`, prop→`EpisodeList` → plano | OK |
| `project_cta_eyebrow` | Detalle — Caja lateral: etiqueta superior | `:228` | plano | OK |
| `project_cta_title` | Detalle — Caja lateral: título | `:231` | plano | OK |
| `project_cta_text` | Detalle — Caja lateral: texto | `:234-237` | plano | OK |
| `related_eyebrow` | Relacionados — Etiqueta superior | `:261` | plano | OK |
| `related_title` | Relacionados — Título | `:264` | plano | OK |
| `read_more` | Leer más — Etiqueta para expandir | `Inicio.astro:56,134,183` | prop `moreLabel`→`ReadMore` → plano (texto de botón) | OK |
| `read_less` | Leer más — Etiqueta para colapsar | ídem | prop `lessLabel`→`ReadMore` → plano | OK |
| `episodes_separator` | Episodios — separador debajo del adelanto | `ProyectoDetalle.astro:216` | prop `separatorLabel`→`EpisodeList` → plano | OK |
| `episode_item_label` | Episodios — etiqueta de cada ítem | `:217` | prop `episodeLabel`→`EpisodeList` → plano | OK |
| `now_playing_label` | Episodios — indicador del que se está viendo | `:218` | prop `nowPlayingLabel`→`EpisodeList` → plano | OK |

### Colección `projects`

| Campo | Label | Consumidor | Cómo se imprime | Categoría |
|---|---|---|---|---|
| `title` | Título | `ProyectoDetalle.astro:71,92`; `BaseLayout` (`<title>`, `og:title`); `ProjectCard` (prop `title`) | plano + atributo (`content=`, `title=` de iframe) | OK (fuera de alcance de asteriscos por diseño — es correcto que nunca pase por `em()`) |
| `order` | Orden | `sortProjects.ts:3` | solo lógica (ordena, descendente) | INCONSISTENTE — ver §3.3 |
| `kind` | Tipo | `ProyectoDetalle.astro:87`; `ProjectCard` | plano | OK |
| `pillar` | Pilar | `ProyectoDetalle.astro:31` (filtra relacionados); `ProjectCard` (prop declarada muerta en el propio código, comentario líneas 8-9); `Archivo.astro:35` (`data-pillar`, inerte) | solo lógica + atributo inerte | OK (el panel no promete nada visual: label "Pilar" sin `description`) |
| `status` | Estado | `ProjectCard` (condiciona si se muestra `episodeCount`); `Archivo.astro:35` (`data-status`, inerte) | solo lógica + atributo inerte | OK |
| `featured` | Destacado | `Inicio.astro:23` | solo lógica (selecciona el destacado) | OK — coincide exactamente con su `description` |
| `year` | Año | `ProyectoDetalle.astro:88`; `ProjectCard` | plano | OK |
| `tagline` | Frase / Lema | `ProyectoDetalle.astro:95,273`; `ProjectCard.astro:41`; `Inicio.astro:177` | `em()`+`set:html` | OK |
| `description` | Descripción | `ProyectoDetalle.astro:127-134` (cuerpo); `ProyectoDetalle.astro:72` (canal metadata, vía `strip()`); `Inicio.astro:182` (destacado) | **dos canales**: `set:html` en el cuerpo, atributo plano (`strip()`) en metadata | OK — documentado explícitamente en la sesión de Deuda 6 |
| `heroImage` | Imagen de portada | `ProyectoDetalle.astro:73,111`; `ProjectCard` vía `getProjectCover()` | atributo HTML (`src=`, `content=` de `og:image`) | OK |
| `heroAlt` | Texto alternativo de la portada | `ProyectoDetalle.astro:112` (`alt=`) únicamente | atributo HTML, **solo en la página de detalle** | INCONSISTENTE — ver §3.1 |
| `playlistId` | ID de playlist YouTube | `ProyectoDetalle.astro` (`hasVideo`, `YouTubeEmbed`, `EpisodeList`); `Inicio.astro` (destacado) | atributo HTML (`src=` de iframe) + dato de script | OK |
| `featuredVideoId` | ID de video destacado (trailer) | `ProyectoDetalle.astro`; `Inicio.astro` | atributo HTML + dato de script | OK |
| `episodes[].number` | Número | `EpisodeList.astro` | plano | OK |
| `episodes[].videoId` | ID de video YouTube | `EpisodeList.astro` | atributo HTML (`src=`, `data-video-id=`) | OK |
| `episodes[].title` | Título | `EpisodeList.astro` | plano | OK |
| `episodes[].description` | Descripción | `EpisodeList.astro` | `em()`+`set:html` | OK |
| `phases[].letter` | Letra | `ProyectoDetalle.astro:182` | plano | OK |
| `phases[].title` | Título | `:185` | plano | OK |
| `phases[].description` | Descripción | `:186` | `em()`+`set:html` | OK |
| `featureCards[].icon` | Ícono | `:142-145` (lookup a glifo vía `iconGlyphMap`) | plano (el glifo resultante, no el valor crudo del campo) | OK |
| `featureCards[].title` | Título | `:146` | plano | OK |
| `featureCards[].description` | Descripción | `:147` | `em()`+`set:html` | OK |
| `voices` | Voces | `:162-165` | plano | OK |
| `ctaText` | Texto del botón | `:246` | plano (texto de link) | INCONSISTENTE — ver §2 |
| `ctaLink` | Link del botón | `:241` | atributo HTML (`href=`) | OK |

### Colección `team`

| Campo | Label | Consumidor | Cómo se imprime | Categoría |
|---|---|---|---|---|
| `name` | Nombre | `Institucional.astro:129`; `TeamCard.astro:29` | plano | OK |
| `role` | Rol | `Institucional.astro:130`; `TeamCard.astro:30` (`.toLowerCase()`) | plano | OK |
| `bio` | Biografía | `Institucional.astro:132`; `TeamCard.astro:31` (condicional `{bio && ...}`) | plano | INCONSISTENTE — ver §2 |
| `order` | Orden | `sortTeam.ts:3` | solo lógica (ordena, ascendente) | INCONSISTENTE — ver §3.3 |
| `photo` | Foto | `Institucional.astro:131`; `TeamCard.astro:15-21` (`src=`) | atributo HTML (`src=`) | OK |

---

## Tarea 2 — Espejo de schemas

### 1. Requeridos en Astro, sin `isRequired` en Keystatic (riesgo de build)

Ninguno crítico encontrado. `pillar`, `status` (`projects`) y `icon`
(`featureCards[]`) son `fields.select` sin `validation.isRequired`, mientras
que en `content.config.ts` son enums/strings **sin** `.optional()` ni
`.default()`:

```ts
// content.config.ts:82-83
pillar: z.enum(['arte', 'ciencia', 'consciencia']),
status: z.enum(['completed', 'in_development']),
```
```ts
// content.config.ts:104 (dentro de featureCards)
icon: z.string(),
```

En la práctica el riesgo es bajo: los tres son `fields.select` con
`defaultValue` (`arte`, `in_development`, `auto_awesome` respectivamente,
`keystatic.config.mjs:493,501,580`), y un `<select>` sin opción vacía no se
puede dejar "sin elegir" desde el panel — siempre viaja algún valor. El
desajuste es real pero no es explotable por una editora usando el formulario
normalmente. Sí lo sería si alguien edita el `.yaml` a mano y borra la clave.

### 2. Requeridos en Keystatic, opcionales en Astro (más estricto de lo necesario)

Dos casos reales, verificados contra el código que consume el campo:

**`projects.ctaText`** — `keystatic.config.mjs:598-599`:
```js
ctaText: fields.object({
  es: fields.text({ label: 'Español', validation: { isRequired: true } }),
  en: fields.text({ label: 'Inglés', validation: { isRequired: true } }),
}, { label: 'Texto del botón' }),
```
`content.config.ts:109`: `ctaText: i18nString.optional(),` — y
`ProyectoDetalle.astro:224` lo consume condicionalmente:
`{data.ctaText && (<GlassPanel>...`. El código está preparado para proyectos
sin botón de CTA; el panel obliga a completarlo igual.

**`team.bio`** — `keystatic.config.mjs:616-617`:
```js
bio: fields.object({
  es: fields.text({ label: 'Español', multiline: true, validation: { isRequired: true } }),
  en: fields.text({ label: 'Inglés', multiline: true, validation: { isRequired: true } }),
}, { label: 'Biografía' }),
```
`content.config.ts:119`: `bio: i18nString.optional(),` — y
`TeamCard.astro:31`: `{bio && <p ...>{bio}</p>}`. Mismo patrón: el código
tolera un miembro del equipo sin biografía, el panel no.

Ninguno de los dos rompe el build (ser más estricto en Keystatic nunca genera
datos inválidos para Astro) — molestan a la editora sin necesidad.

### 3. Campos que existen en un lado y no en el otro

| Campo | Astro | Keystatic | Nota |
|---|---|---|---|
| `pages.hero_image` | `content.config.ts:20`, `bi.optional()` | No existe | Documentado a propósito en `keystatic.config.mjs:12-16` como "slot reservado" — caso 5 de la semilla, confirmado vigente. |
| `team.photoAlt` | `content.config.ts:121`, `z.string().optional()` | No existe | **Caso inverso al huérfano**: acá el código sí lo usaría (`TeamCard.astro:6,10,18`: `alt={photoAlt || name}`) pero la editora no tiene forma de escribirlo — el campo es alcanzable desde el código y desde ningún lado del panel. |

### 4. Defaults que difieren

**`order`** es el caso ya señalado en la semilla, con los dos archivos de
schema uno al lado del otro:

```ts
// content.config.ts:122 (team)
order: z.number().default(0),
```
```ts
// content.config.ts (projects) — no tiene default, es tal cual:
order: z.number(),
```
```js
// keystatic.config.mjs:479-484 (projects)
order: fields.integer({
  label: 'Orden',
  description: '...',
  defaultValue: 100,
  validation: { isRequired: true },
}),
```
```js
// keystatic.config.mjs:619 (team) — sin defaultValue:
order: fields.integer({ label: 'Orden', description: 'Define el orden de aparición en la página. Número más bajo = aparece primero.' }),
```

`projects.order`: requerido en Keystatic, con `defaultValue: 100` — un
proyecto nuevo siempre nace con un número explícito. `team.order`: no
requerido, sin `defaultValue` en Keystatic — si la editora deja el campo
vacío, Keystatic guarda `null`/ausente, y `content.config.ts`'s
`.default(0)` lo convierte en `0` al leer. Como `sortTeam.ts` ordena
ascendente (menor primero), ese `0` invisible salta al primer puesto —
exactamente el caso 4 de la semilla, con el mecanismo exacto documentado.

### 5. Nota aparte — `voices` acepta una forma que Keystatic nunca genera

```ts
// content.config.ts:108
voices: z.array(z.union([z.string(), z.object({ name: z.string() })]))
  .transform((arr) => arr.map((v) => (typeof v === 'string' ? v : v.name)))
  .optional(),
```
Keystatic solo puede producir el string (`fields.array(fields.text(...))`,
`keystatic.config.mjs:593-596`) — la rama `{ name: string }` del `z.union` es
código muerto, nunca alcanzable desde el panel. No rompe nada (Zod es más
permisivo, no más estricto), pero es una asimetría real.

---

## Tarea 3 — Coherencia de lo que la editora ve

### 3.1 Descriptions que mienten o faltan

**Falta, y el campo sí funciona (peor caso: el panel se queda corto)**:
`archivo.hero_title` (`keystatic.config.mjs:281-284`) no tiene
`description: ASTERISK_HINT`, a diferencia de `inicio.hero_title`,
`institucional.hero_title` y `proyectos.hero_title` — pero **sí** pasa por
`em()` en `Archivo.astro:25`. La editora de Archivo no tiene forma de saber
que los asteriscos funcionan ahí.

**Promete, y el campo no cumple del todo (peor caso: mentira parcial)**:
`projects.heroAlt` (`keystatic.config.mjs:519`):
> "Descripción corta de lo que se ve en la imagen. La leen los lectores de
> pantalla (personas no videntes) y **aparece si la imagen no carga**."

Esto es cierto solo en la página de detalle (`ProyectoDetalle.astro:112`,
`alt={data.heroAlt || data.title}`). En las tres grillas (Inicio, Proyectos,
Archivo) la miniatura sale de `ProjectCard`, que nunca recibe `heroAlt` — su
prop `imageAlt` no tiene ningún call site que la pase (`grep -rn "imageAlt="
src/components/pages/` no devuelve nada), así que cae siempre en su default
`''`. La editora completa el texto alternativo pensando que cubre "la
imagen" del proyecto; en la práctica cubre una sola de sus cuatro
apariciones.

**Crípticos sin `description`**: la mayoría de los campos de una sola
palabra/frase corta (`hero_eyebrow`, `*_eyebrow`, `team_subtitle`,
`cta_subtitle`, `newsletter_title`, etc.) no tienen `description`. No es un
problema por sí solo — el label ya es razonablemente claro en casi todos —
pero corta la explicación quirúrgica que sí reciben campos vecinos (ver
también hallazgo del `ORDER_HINT`, más abajo).

### 3.2 Nombres iguales, comportamientos distintos

**`hero_subtitle`** (caso 2 de la semilla, confirmado exhaustivo): existe en
4 singletons. Solo en `inicio` pasa por `em()`+`set:html`
(`Inicio.astro:54-55`, único lugar con `subtitleReadMore={true}`). En
`institucional`, `proyectos` y `archivo` se imprime plano
(`Institucional.astro:24`, `Proyectos.astro:28`, `Archivo.astro:26`). El
panel no distingue: mismo label ("Portada — Texto de presentación"), mismo
tipo de campo, comportamiento distinto según en qué página se esté parada.

**`hero_title`** (caso 3 de la semilla, extendido): existe en 5 singletons.
En `inicio`, `institucional`, `proyectos` y `archivo` pasa por `em()` — en
`contacto` no (`Contacto.astro:26`, `{t(d?.hero_title) ?? ''}`, sin
`em()` en ningún lado del archivo — confirmado, `Contacto.astro` no importa
`em` en absoluto). A diferencia del caso anterior, acá el panel **no**
miente: `contacto.hero_title` no tiene `ASTERISK_HINT` (única de las 5
instancias sin ese hint), así que no promete algo que luego no cumple. Sigue
siendo una inconsistencia de comportamiento bajo el mismo nombre de campo,
pero no una mentira activa.

No se encontraron más casos de mismo nombre con comportamiento distinto
fuera de estos dos.

### 3.3 Convenciones contradictorias

**`order`** (caso 4 de la semilla) — ya cubierto en detalle en la Tarea 2:
`projects` ordena descendente (mayor = primero) con desempate alfabético
(`sortProjects.ts:3`); `team` ordena ascendente (menor = primero) también
con desempate alfabético (`sortTeam.ts:3`). Los textos de ayuda en el propio
panel lo confirman lado a lado: "Número más alto = aparece primero" (Orden
de `projects`) vs. "Número más bajo = aparece primero" (Orden de `team`).

No se encontró un segundo caso de la misma magnitud (dos campos, mismo
propósito, lógicas invertidas). Lo más cercano — sin llegar a contradicción —
es que `projects.order` tiene `defaultValue: 100` (nace arriba de todo) y
`validation.isRequired`, mientras `team.order` no tiene ninguno de los dos;
son asimétricos pero no van en sentidos opuestos del mismo modo que el orden
de clasificación.

### 3.4 Dónde funcionan los asteriscos — lista definitiva

Verificada por `grep -rln "from.*emphasis" src/`: exactamente **7 archivos**
importan `em()` — `EpisodeList.astro`, `Archivo.astro`, `Inicio.astro`,
`Institucional.astro`, `ProyectoDetalle.astro`, `Proyectos.astro`,
`ProjectCard.astro`. Ningún otro archivo del proyecto puede convertir
`*texto*` en cursiva, sin excepción.

**Campos que SÍ soportan `*texto*`** (18 en total):

| Campo | Dónde |
|---|---|
| `pages.inicio.hero_title` | Home |
| `pages.inicio.hero_subtitle` | Home |
| `pages.inicio.pillars_title` | Home |
| `pages.inicio.pillar_arte_desc` | Home |
| `pages.inicio.pillar_ciencia_desc` | Home |
| `pages.inicio.pillar_consciencia_desc` | Home |
| `pages.institucional.hero_title` | Institucional |
| `pages.institucional.mission_title` | Institucional |
| `pages.institucional.vision_title` | Institucional |
| `pages.institucional.team_title` | Institucional |
| `pages.institucional.cta_title` | Institucional |
| `pages.proyectos.hero_title` | Proyectos |
| `pages.archivo.hero_title` | Archivo (sin el hint en el panel — ver 3.1) |
| `projects.tagline` | Todos los proyectos |
| `projects.description` | Todos los proyectos (solo en el cuerpo — el canal metadata usa `strip()`, nunca produce cursiva, a propósito) |
| `projects.phases[].description` | Proyectos con fases |
| `projects.featureCards[].description` | Proyectos con tarjetas destacadas |
| `projects.episodes[].description` | Proyectos con episodios |

**Campos que NO soportan asteriscos**, agrupados por qué tan sorprendente es
que no lo hagan:

- *Sorprendente — hermano directo de un campo que sí funciona*: los 3
  `pillar_*_title` (sus `pillar_*_desc` hermanos sí funcionan);
  `pages.contacto.hero_title` (sus 4 hermanos en las otras páginas sí
  funcionan, aunque el panel no lo promete); `hero_subtitle` de
  institucional/proyectos/archivo (el de inicio sí funciona).
- *Con hint activo pero sin consumidor* — el peor caso, doble trampa:
  `completed_title` e `in_dev_title` (`proyectos.yaml`) tienen
  `ASTERISK_HINT` en el panel y datos cargados con asteriscos
  (`*Producciones*`), pero el campo entero es huérfano — el hint promete algo
  sobre un campo que nadie va a leer nunca.
- *Sin sorpresa, nunca tuvieron el hint ni una razón para tenerlo*: el resto
  — todos los campos de `contacto`, todos los de `ui`, todos los de `team`,
  y en `projects`: `title`, `kind`, `year`, `voices`, `ctaText`, `heroAlt`,
  `episodes[].title`, `phases[].title`/`letter`, `featureCards[].title`/`icon`,
  más `hero_eyebrow`/`*_eyebrow`/`mission_p*`/`vision_p*`/`vision_blockquote`/
  `vision_quote`/`newsletter_*`/`team_subtitle`/`cta_subtitle`/
  `cta_button_*` en `pages`.

---

## Tarea 4 — Recorrido visual del panel

Con `npm run dev` y Chrome contra `http://localhost:4321/keystatic`. Se
recorrieron: colección `Proyectos` (ítem `el-nexo` completo, todas las
secciones), colección `Equipo` (ítem `equipo-direccion` completo), y los 6
singletons (`Inicio`, `Institucional`, `Proyectos`, `Archivo`, `Contacto`,
`Textos de interfaz`). No se guardó nada ni se tocó ningún campo.

**Confirmaciones visuales de hallazgos de código** (útil para saber que el
código y lo que ve la editora coinciden en estos puntos):

- El asterisco rojo de "requerido" aparece en `Orden`/`Tipo`/`Frase — Español
  e Inglés`/`Descripción — Español e Inglés`/`Texto del botón` de `projects`,
  y **no** aparece en `Pilar` ni en `Estado` — visualmente idéntico a lo que
  predice la Tarea 2, punto 1.
- `Biografía` (equipo) tiene el asterisco rojo de requerido; `Orden` (equipo)
  no lo tiene — confirma la Tarea 2, puntos 2 y 4.
- En la página `Archivo`, el campo "Portada — Etiqueta superior" aparece
  completamente vacío y con la misma apariencia que cualquier campo con datos
  — nada en el formulario avisa que ese campo no se usa en ningún lado.
- En la página `Proyectos`, "Secciones — Título de Producciones" y "Secciones
  — Título de En Desarrollo" se ven con datos cargados, con el hint de
  asteriscos, indistinguibles de cualquier campo que sí hace algo.

**Hallazgos que solo se ven mirando el formulario, no en el código**:

- **El campo `Orden` de `projects` tiene una `description` de 6 líneas** que
  empuja el input numérico bien abajo del label — en una pantalla de 900px de
  alto, el campo de entrada real (el número) queda fuera de la vista inicial
  del bloque. No es un error, pero es el campo con más fricción visual del
  formulario de proyecto.
- **`Misión — Párrafo 1` a `Párrafo 5`** (y su espejo, `Visión — Párrafo 1` a
  `Párrafo 5`) son 5 bloques visualmente idénticos entre sí: mismo tipo de
  campo, mismo `ORDER_HINT` ("Se muestran en orden, uno debajo del otro"),
  mismo tamaño de caja de texto. La única forma de saber en cuál está parada
  la editora es leer el número en el label — fácil de perder la cuenta
  scrolleando rápido, sobre todo entre Misión y Visión que repiten el mismo
  patrón dos veces en la misma página.
- Los labels con formato "Sección — Subcampo" (`Portada — Título principal`,
  `Pilares — Arte: descripción`, `Datos — Etiqueta del campo de email`)
  funcionan bien como agrupador visual aun sin que Keystatic tenga secciones
  reales — es un patrón consistente en las 5 páginas y en `ui`, vale la pena
  preservarlo si se reorganiza algo.
- El formulario de `team` es corto y sin ambigüedad — de los seis
  formularios recorridos, es el único sin ningún hallazgo visual nuevo.

---

## Cierre

### Resumen ejecutivo

- **Total de campos relevados** (contando cada campo una vez, no por
  idioma): **120**, repartidos en 5 singletons de página (`inicio` 15,
  `institucional` 28, `proyectos` 7, `archivo` 5, `contacto` 15), el
  singleton `ui` (19), la colección `projects` (26, incluyendo sub-campos de
  `episodes`/`phases`/`featureCards`) y la colección `team` (5).
- **HUÉRFANO**: 3
- **INCONSISTENTE**: 14
- **OK**: 103

### Los huérfanos

| Campo | Singleton | ¿Datos cargados? |
|---|---|---|
| `completed_title` | `proyectos` | Sí — `*Producciones*` / `*Productions*` |
| `in_dev_title` | `proyectos` | Sí — `En *Desarrollo*` / `In *Development*` |
| `hero_eyebrow` | `archivo` | No — la clave no existe en `archivo.yaml` |

### Riesgos de build

Ninguno de los desajustes de la Tarea 2 rompe producción **hoy**, y ninguno
lo haría por sí solo con el flujo normal del panel (los `fields.select` sin
`isRequired` siempre traen un valor por su `defaultValue`; los campos
`isRequired` de más en Keystatic son más estrictos, no menos, así que nunca
generan un dato que Astro rechace). El riesgo real es indirecto:

- Si alguien edita un `.yaml` de `projects` a mano y borra `pillar`, `status`
  o el `icon` de una `featureCard`, el build de Astro **sí** rompe (son
  campos requeridos en `content.config.ts` sin default), y Keystatic no lo
  hubiera evitado porque nunca marcó esos campos como obligatorios.
- Nada de esto es del calibre del incidente del 08/07 (que fue un campo con
  tipo incompatible, no ausencia de un campo required). No se encontró un
  caso equivalente vigente.

### Hallazgos inesperados

1. **`archivo.hero_eyebrow` es un huérfano nuevo**, no estaba en la semilla:
   `Archivo.astro` nunca pasa `eyebrow` a `<HeroSection>` (a diferencia de
   `Proyectos.astro`, que sí lo hace), y la clave ni siquiera existe hoy en
   `archivo.yaml`.
2. **`team.photoAlt` es el espejo inverso de un huérfano**: existe en
   `content.config.ts` y lo consume `TeamCard.astro`, pero no hay ningún
   campo en Keystatic para escribirlo — el código puede usarlo, la editora no
   puede llenarlo.
3. **`projects.heroAlt` no cumple su propia promesa en 3 de 4 lugares**: solo
   se aplica en la página de detalle; las miniaturas de las tres grillas
   (Inicio, Proyectos, Archivo) siempre tienen `alt=""` porque `ProjectCard`
   nunca recibe la prop `imageAlt`. Ya estaba anotado como hallazgo suelto en
   el relevamiento de Deuda 6; acá queda formalmente clasificado como
   INCONSISTENTE.
4. **`projects.ctaText` y `team.bio` son obligatorios en el panel sin
   necesidad**: el código de ambos está escrito para tolerar su ausencia
   (`{data.ctaText && (...)}`, `{bio && (...)}`), pero Keystatic no deja
   guardar sin completarlos.
5. **El campo `Orden` de `projects` tiene la `description` más larga de todo
   el panel** (6 líneas) — vale la pena como dato para cualquier rediseño del
   formulario, no solo como curiosidad.

### Decisiones que quedan abiertas para Santos

Enunciadas, sin resolver:

- `proyectos.completed_title` e `in_dev_title`: ¿se borran del panel (y del
  `.yaml`), o se cablean a algún lado? Hoy la grilla de Proyectos no
  distingue secciones "Producciones" / "En Desarrollo" desde que se
  unificaron el 05/08 — cablearlos implicaría reintroducir esa distinción
  visual, no solo enchufar el texto.
- `archivo.hero_eyebrow`: ¿se borra, o se agrega `eyebrow={t(d?.hero_eyebrow)}`
  a la llamada de `HeroSection` en `Archivo.astro` (mismo patrón que ya usa
  `Proyectos.astro`)?
- `hero_subtitle` de institucional/proyectos/archivo: ¿se les da el mismo
  tratamiento que el de inicio (asteriscos + `ReadMore`), o se acepta que solo
  el Home tiene ese comportamiento y se documenta así en la guía de
  editoras?
- `contacto.hero_title`: ¿se homologa con las otras 4 páginas (asteriscos), o
  se deja como está y se documenta la excepción?
- `projects.ctaText` y `team.bio`: ¿se sacan de `validation.isRequired` en
  Keystatic para que coincidan con lo que el código ya tolera, o se decide
  que en la práctica SIEMPRE deben estar completos y se ajusta
  `content.config.ts` para exigirlos también (sacándoles el `.optional()`)?
- `team.order`: ¿se le agrega `defaultValue` en Keystatic (mismo patrón que
  `projects.order: 100`) para que un miembro nuevo nazca al final en vez de
  saltar al primer puesto en silencio?
- `team.photoAlt`: ¿se agrega el campo a Keystatic para que sea alcanzable, o
  se borra de `content.config.ts` y de `TeamCard.astro` por no tener forma de
  completarse nunca?
- `projects.heroAlt`: ¿se empieza a pasar a `ProjectCard` en las tres
  grillas, o se ajusta la `description` del campo en Keystatic para aclarar
  que hoy solo aplica a la página de detalle?
