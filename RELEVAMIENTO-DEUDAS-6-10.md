# Relevamiento — Deuda 6 (énfasis en `projects`) y Deuda 10 (fotos de equipo)

Relevamiento de solo lectura. No se modificó ningún byte de `src/`, `public/`,
`keystatic.config.mjs` ni ningún `.yaml`. Único archivo creado: este documento.

## Punto de partida

Salida cruda de los comandos ejecutados:

```
$ git checkout main
Switched to branch 'main'
Your branch is up to date with 'origin/main'.

$ git pull
From https://github.com/Nautas-Sur/nautas
   cffc255..5ec7ca8  main       -> origin/main
Updating cffc255..5ec7ca8
Fast-forward
 AVANCES-2026-08-06.md | 215 ++++++++++++++++++++++++++++++++++++++++++++++++++
 1 file changed, 215 insertions(+)
 create mode 100644 AVANCES-2026-08-06.md

$ git status
On branch main
Your branch is up to date with 'origin/main'.

nothing to commit, working tree clean

$ git checkout -b relevamiento-deudas-6-10
Switched to a new branch 'relevamiento-deudas-6-10'

$ git status
On branch relevamiento-deudas-6-10
nothing to commit, working tree clean
```

---

## Tarea 1 — Deuda 10: la cadena, eslabón por eslabón

### 1. Keystatic — colección `team` completa (`keystatic.config.mjs`, líneas 604-628)

```js
team: collection({
  label: 'Equipo',
  slugField: 'name',
  path: 'src/content/team/*',
  format: { data: 'yaml' },
  schema: {
    name: fields.slug({ name: { label: 'Nombre' } }),
    role: fields.object({
      es: fields.text({ label: 'Español', validation: { isRequired: true } }),
      en: fields.text({ label: 'Inglés', validation: { isRequired: true } }),
    }, { label: 'Rol' }),
    bio: fields.object({
      es: fields.text({ label: 'Español', multiline: true, validation: { isRequired: true } }),
      en: fields.text({ label: 'Inglés', multiline: true, validation: { isRequired: true } }),
    }, { label: 'Biografía' }),
    order: fields.integer({ label: 'Orden', description: 'Define el orden de aparición en la página. Número más bajo = aparece primero.' }),
    photo: fields.image({
      label: 'Foto',
      directory: 'public/images/team',
      publicPath: '/images/team/',
      description: 'Retrato vertical 3:4 · mínimo 600×800 px (ideal 900×1200) · cara/torso centrados · JPG, menos de 500 KB',
      validation: { isRequired: false },
    }),
  },
}),
```

### 2. `publicPath` — `photo` (team) vs. `heroImage` (projects), lado a lado

```js
// team.photo (keystatic.config.mjs:620-626)
photo: fields.image({
  label: 'Foto',
  directory: 'public/images/team',
  publicPath: '/images/team/',
  description: 'Retrato vertical 3:4 · mínimo 600×800 px (ideal 900×1200) · cara/torso centrados · JPG, menos de 500 KB',
  validation: { isRequired: false },
}),
```

```js
// projects.heroImage (keystatic.config.mjs:513-518)
heroImage: fields.image({
  label: 'Imagen de portada',
  description: '16:9 · mínimo 1280×720 px (ideal 1920×1080) · sujeto centrado, se recorta a cuadrado en algunas vistas · JPG, menos de 500 KB',
  directory: 'public/images/projects',
  publicPath: '/images/projects/',
}),
```

**Respuesta explícita**: los dos campos tienen **`directory` Y `publicPath`**. No falta ninguno de los dos en ninguno de los dos campos. Este eslabón está igual de completo en ambas colecciones.

### 3. Schema de Astro — colección `team` (`src/content.config.ts`, líneas 114-124)

```ts
const teamCollection = defineCollection({
  loader: glob({ pattern: '**/*.yaml', base: './src/content/team' }),
  schema: z.object({
    name: z.string(),
    role: i18nString,
    bio: i18nString.optional(),
    photo: z.string().optional(),
    photoAlt: z.string().optional(),
    order: z.number().default(0),
  }),
});
```

**Respuesta explícita**: el campo `photo` **sí está declarado** (`photo: z.string().optional()`). El schema usa `z.object(...)` a secas — sin `.passthrough()` ni `.catchall()` — pero eso es irrelevante para `photo` porque está nombrado explícitamente en el objeto: `z.object` sólo descarta claves que **no** declara, y `photo` sí está declarada. Este eslabón no está roto por el motivo hipotetizado. (Nota aparte: el schema también declara `photoAlt: z.string().optional()`, un campo que **no existe** en el bloque `team` de `keystatic.config.mjs` — ver Hallazgos inesperados.)

### 4. Consumidor — `grep -rn "TeamCard" src/`

```
src/components/pages/Institucional.astro:7:import TeamCard from '../TeamCard.astro';
src/components/pages/Institucional.astro:128:          <TeamCard
```

Invocación completa (`src/components/pages/Institucional.astro:128-133`):

```astro
<TeamCard
  name={member.data.name}
  role={locale === 'en' ? member.data.role.en : member.data.role.es}
  photo={member.data.photo}
  bio={member.data.bio ? (locale === 'en' ? member.data.bio.en : member.data.bio.es) : undefined}
/>
```

**Respuesta explícita**: `photo={member.data.photo}` se pasa correctamente. Este eslabón no está roto.

### 5. Render — `src/components/TeamCard.astro` completo

```astro
---
export interface Props {
  name: string;
  role: string;
  photo?: string;
  photoAlt?: string;
  bio?: string;
}

const { name, role, photo, photoAlt = '', bio } = Astro.props;
---

<div class="group">
  <div class="aspect-[3/4] overflow-hidden rounded-lg mb-5 relative bg-surface-container-low">
    {photo ? (
      <img
        src={photo}
        alt={photoAlt || name}
        class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        loading="lazy"
      />
    ) : (
      <div class="w-full h-full flex items-center justify-center">
        <span class="font-headline text-warm/30 text-6xl leading-none" aria-hidden="true">◯</span>
      </div>
    )}
    <div class="absolute inset-0 bg-warm/[0.06] opacity-0 group-hover:opacity-100 transition-opacity"></div>
  </div>
  <h4 class="font-headline text-lg mb-1">{name}</h4>
  <p class="font-bitacora italic text-warm text-xs">// {role.toLowerCase()}</p>
  {bio && <p class="text-sm text-on-surface-variant mt-3 leading-relaxed">{bio}</p>}
</div>
```

**Respuesta explícita**: sí tiene una rama condicional (`{photo ? (...) : (...)}`) que renderiza `<img src={photo}>` cuando `photo` está definido. El glifo `◯` **no** es el único camino: es el fallback cuando `photo` es falsy. Este eslabón no está roto.

### 6. Disco

```
$ ls -la public/images/
total 44
drwxr-xr-x 1 Santos 197121     0 May 29 20:27 .
drwxr-xr-x 1 Santos 197121     0 May 11 18:36 ..
-rw-r--r-- 1 Santos 197121 29167 May 11 18:36 logo-nautas_transparencia.png
-rw-r--r-- 1 Santos 197121  3774 Jun 22  2012 nautas-logo.png
drwxr-xr-x 1 Santos 197121     0 Aug  2 17:24 projects

$ ls -la public/images/team
ls: cannot access 'public/images/team': No such file or directory

$ ls -la src/content/team/
total 13
drwxr-xr-x 1 Santos 197121   0 Aug  2 17:24 .
drwxr-xr-x 1 Santos 197121   0 Aug  2 19:58 ..
-rw-r--r-- 1 Santos 197121 349 May 30 09:53 curaduria-editorial.yaml
-rw-r--r-- 1 Santos 197121 307 May 30 09:53 equipo-direccion.yaml
-rw-r--r-- 1 Santos 197121 125 Aug  2 17:24 probando-equipo.yaml
-rw-r--r-- 1 Santos 197121 348 May 30 09:53 realizacion-audiovisual.yaml
-rw-r--r-- 1 Santos 197121 329 May 30 09:53 vinculacion-comunitaria.yaml
```

**Nota**: hay **5** `.yaml` en `src/content/team/`, no 4 como asumía el pedido original (ver Hallazgos inesperados sobre `probando-equipo.yaml`).

Contenido completo de los 5 `.yaml`:

`curaduria-editorial.yaml`:
```yaml
name: "Curaduría Editorial"
role:
  es: "Investigación y Contenidos"
  en: "Research and Content"
bio:
  es: "Selección de pensadores, artistas y científicos. Desarrollo de líneas temáticas y contenidos editoriales."
  en: "Selection of thinkers, artists, and scientists. Development of thematic lines and editorial content."
order: 2
```

`equipo-direccion.yaml`:
```yaml
name: "Equipo de Dirección"
role:
  es: "Dirección General"
  en: "General Direction"
bio:
  es: "Coordinación estratégica de todas las áreas de la asociación y sus proyectos audiovisuales."
  en: "Strategic coordination of all areas of the association and its audiovisual projects."
order: 1
```

`probando-equipo.yaml`:
```yaml
name: Probando Equipo
role:
  es: Probando Equipo
  en: Testing Team
bio:
  es: Equipo de prueba
  en: Testing Team
order: 1
```

`realizacion-audiovisual.yaml`:
```yaml
name: "Realización Audiovisual"
role:
  es: "Producción y Post-producción"
  en: "Production and Post-production"
bio:
  es: "Dirección de fotografía, sonido, montaje y post-producción de todas las series y documentales."
  en: "Direction of photography, sound, editing, and post-production of all series and documentaries."
order: 3
```

`vinculacion-comunitaria.yaml`:
```yaml
name: "Vinculación Comunitaria"
role:
  es: "Redes y Alianzas"
  en: "Networks and Alliances"
bio:
  es: "Construcción de vínculos con comunidades, organizaciones aliadas y difusión de las producciones."
  en: "Building connections with communities, partner organizations, and dissemination of productions."
order: 4
```

**Respuesta explícita**: ninguno de los 5 `.yaml` tiene una clave `photo:`. La carpeta `public/images/team/` no existe. Este eslabón está roto — pero no por un error de cableado, sino porque nunca se cargó ninguna foto.

### Veredicto — Tarea 1

| # | Eslabón | Estado | Por qué |
|---|---|---|---|
| 1 | Keystatic (`keystatic.config.mjs`, colección `team`) | OK | El campo `photo` está definido como `fields.image` con label, descripción y validación. |
| 2 | `publicPath` (`photo` vs `heroImage`) | OK | Ambos campos tienen `directory` **y** `publicPath`; no falta ninguno en ninguno de los dos. |
| 3 | Schema de Astro (`content.config.ts`, `teamCollection`) | OK | `photo: z.string().optional()` está declarado explícitamente; `z.object` sin `.passthrough()` sólo descarta claves *no* declaradas, y ésta lo está. |
| 4 | Consumidor (`Institucional.astro` → `TeamCard`) | OK | `photo={member.data.photo}` se pasa en la invocación. |
| 5 | Render (`TeamCard.astro`) | OK | Tiene rama `{photo ? <img src={photo}> : <glifo ◯>}`; el glifo es sólo el fallback. |
| 6 | Disco (`.yaml` de contenido + `public/images/team/`) | **ROTO** | Ningún `.yaml` de `team` tiene la clave `photo:` escrita, y la carpeta `public/images/team/` no existe. |

**Conclusión**: los 5 eslabones de código (1 a 5) están intactos. La cadena se rompe exclusivamente en el eslabón 6 — el contenido. El diagnóstico previo ("no hay ninguna referencia a `images/team` en `src/`") llegaba a una conclusión que coincide con la real (no hay fotos), pero por un argumento que este relevamiento no puede validar como la causa: el código nunca hardcodea esa ruta porque, tal como advertía el pedido, viene del dato (`member.data.photo`) — un grep sobre `src/` nunca la iba a encontrar aunque el feature funcionara perfectamente. La razón real por la que hoy no se ven fotos es más simple: nadie cargó ninguna foto todavía. No hay evidencia en este relevamiento de que el pipeline de guardado de Keystatic (subir una imagen → escribirla en `public/images/team/` → escribir la clave `photo:` en el `.yaml`) esté roto, porque nunca se ejercitó — no hay ningún commit que agregue un archivo a `public/images/team/`.

---

## Tarea 2 — Deuda 6: inventario campo × punto de consumo

### 1. Schema completo de `projects` (`src/content.config.ts`, líneas 76-112)

```ts
const projectsCollection = defineCollection({
  loader: glob({ pattern: '**/*.yaml', base: './src/content/projects' }),
  schema: z.object({
    title: z.string(),
    order: z.number(),
    kind: z.string(),
    pillar: z.enum(['arte', 'ciencia', 'consciencia']),
    status: z.enum(['completed', 'in_development']),
    featured: z.boolean().default(false),
    year: z.string().optional(),
    tagline: i18nString,
    description: i18nString,
    heroImage: z.string().optional(),
    heroAlt: z.string().optional(),
    playlistId: z.string().optional(),
    featuredVideoId: z.string().optional(),
    episodes: z.array(z.object({
      number: z.number(),
      title: i18nString,
      description: i18nString.optional(),
      videoId: z.string().optional(),
    })).optional(),
    phases: z.array(z.object({
      letter: z.string(),
      title: i18nString,
      description: i18nString,
    })).optional(),
    featureCards: z.array(z.object({
      icon: z.string(),
      title: i18nString,
      description: i18nString,
    })).optional(),
    voices: z.array(z.union([z.string(), z.object({ name: z.string() })])).transform((arr) => arr.map((v) => (typeof v === 'string' ? v : v.name))).optional(),
    ctaText: i18nString.optional(),
    ctaLink: z.string().optional(),
  }),
});
```

### 2. Tabla campo × consumo

| Campo | Archivo:línea donde se consume | Cómo se imprime | Páginas alcanzadas |
|---|---|---|---|
| `title` | `ProyectoDetalle.astro:90` (`<h1>{data.title}</h1>`) | `{expresión}` plano | `/proyectos/:slug`, `/en/proyectos/:slug` (14: 7 proyectos × ES/EN) |
| `title` | `ProyectoDetalle.astro:100` (prop `title` de `YouTubeEmbed`) | va a un atributo HTML (`title=` del `<iframe>`, vía `YouTubeEmbed.astro:19`) | mismas 14, sólo si `hasVideo` |
| `title` | `ProyectoDetalle.astro:69-70` (prop `title` de `BaseLayout`) | se pasa como prop a otro componente (`BaseLayout`) → termina en `<title>` (texto) y en `content=` de `og:title` (`BaseLayout.astro:34,38`) | mismas 14 |
| `title` | `Inicio.astro:205`, `Proyectos.astro:39`, `Archivo.astro:37` (prop `title` de `ProjectCard`) | se pasa como prop a `ProjectCard` → plano en `<h3>{title}</h3>` (`ProjectCard.astro:68,120`) | `/`, `/en`, `/proyectos`, `/en/proyectos`, `/archivo`, `/en/archivo` (6) |
| `title` | `Inicio.astro:160` (prop `title` del `<iframe>` del destacado) | va a un atributo HTML (`title=`) | `/`, `/en` (2, sólo si hay proyecto `featured`) |
| `title` | `Inicio.astro:176` (`<h3>{featured.data.title}</h3>`) | `{expresión}` plano | `/`, `/en` (2, sólo destacado) |
| `title` | `ProyectoDetalle.astro:270` (proyectos relacionados) | `{expresión}` plano | mismas 14 (cuando hay relacionados) |
| `order` | `sortProjects.ts:3` (`src/lib/sortProjects.ts`) | no se consume como texto: sólo ordena el array | `/`, `/en`, `/proyectos`, `/en/proyectos`, `/archivo`, `/en/archivo` (6, efecto indirecto en el orden de las tarjetas) |
| `kind` | `ProyectoDetalle.astro:85` (`// {data.kind}`) | `{expresión}` plano | 14 |
| `kind` | `ProjectCard.astro:64,116` (prop `kind`) | `{expresión}` plano | 6 |
| `kind` | `Inicio.astro:174` (destacado) | `{expresión}` plano | 2 (sólo destacado) |
| `pillar` | `ProyectoDetalle.astro:30` (filtro de relacionados) | no se consume como texto: sólo filtra el array | 14 (efecto indirecto) |
| `pillar` | `ProjectCard.astro:8` (prop tipada, comentario: "Sin uso visual en Fase 3") | no se consume en ningún lado (dead prop a nivel visual) | — |
| `pillar` | `Archivo.astro:35` (`data-pillar={p.data.pillar}`) | va a un atributo HTML (`data-pillar`, "queda inerte" según comentario del propio archivo) | `/archivo`, `/en/archivo` (2) |
| `status` | `ProyectoDetalle.astro` (no se usa directamente en este archivo) | — | — |
| `status` | `ProjectCard.astro:17,32,130,133` (prop `status`) | controla lógica condicional (mostrar/ocultar contador de episodios), no se imprime como texto | 6 |
| `status` | `Archivo.astro:35` (`data-status={p.data.status}`) | va a un atributo HTML (`data-status`, inerte) | 2 |
| `featured` | `Inicio.astro:23` (`projects.find((p) => p.data.featured)`) | no se consume como texto: sólo selecciona el destacado | `/`, `/en` (2, efecto indirecto) |
| `year` | `ProyectoDetalle.astro:86` | `{expresión}` plano | 14 |
| `year` | `ProjectCard.astro:82,136` | `{expresión}` plano | 6 |
| `tagline` | `ProyectoDetalle.astro:93` (`{tagline}`) | `{expresión}` plano | 14 |
| `tagline` | `ProjectCard.astro:74,124` (prop `tagline`) | `{expresión}` plano | 6 |
| `tagline` | `Inicio.astro:177` (destacado) | `{expresión}` plano | 2 (sólo destacado) |
| `tagline` | `ProyectoDetalle.astro:271` (relacionados) | `{expresión}` plano | 14 (cuando hay relacionados) |
| `description` | `ProyectoDetalle.astro:125-133` (`description.split('\n\n')...map((p,i) => <p>{p.trim()}</p>)`) | `{expresión}` plano (Astro escapa el HTML) | 14 |
| `description` | `Inicio.astro:178-186` (children de `<ReadMore>` sin prop `text`) | se pasa como prop/slot a `ReadMore`, que — al no recibir `text` — cae en el modo `clamp` con `<slot />` (`ReadMore.astro:85`), es decir **plano**, no `set:html` | `/`, `/en` (2, sólo destacado) |
| `heroImage` | `src/lib/projectCover.ts:6` (`getProjectCover`) → prop `image` de `ProjectCard` | va a un atributo HTML (`src=` de `<img>`, `ProjectCard.astro:50,97`) | 6 |
| `heroImage` | `ProyectoDetalle.astro:109` (`<img src={data.heroImage}>`) | va a un atributo HTML (`src=`) | 14, sólo si `!hasVideo && data.heroImage` |
| `heroAlt` | `ProyectoDetalle.astro:110` (`alt={data.heroAlt \|\| data.title}`) | va a un atributo HTML (`alt=`) | 14, sólo si `!hasVideo && data.heroImage` |
| `heroAlt` | — | no se consume en ningún lado más: **`ProjectCard` nunca recibe `heroAlt`** (ningún call site le pasa `imageAlt`), así que el `alt` de las tarjetas siempre es `''` | 6 (hallazgo: alt vacío en todas las tarjetas) |
| `playlistId` | `ProyectoDetalle.astro:65,100` (`hasVideo`, prop de `YouTubeEmbed`) | va a un atributo HTML (`src=` del `<iframe>`, vía interpolación de URL) | 14 |
| `playlistId` | `ProyectoDetalle.astro:211` (prop de `EpisodeList`) | usado en `<script define:vars>` (dato para JS), no se imprime como texto visible | 14 |
| `playlistId` | `Inicio.astro:154-159` (destacado) | va a un atributo HTML (`src=` del `<iframe>`, interpolación de URL) | 2 (sólo destacado) |
| `featuredVideoId` | `ProyectoDetalle.astro:65-66,100,205-210` (`hasVideo`, `embedVideoId`, prop `trailer` de `EpisodeList`) | va a atributo HTML (`src=`) y a dato de script | 14 |
| `featuredVideoId` | `Inicio.astro:156-158` (destacado) | va a un atributo HTML (`src=` del `<iframe>`) | 2 (sólo destacado) |
| `episodes[].number` | `EpisodeList.astro:158` (`{String(ep.number).padStart(2,'0')}`) | `{expresión}` plano | 6 (sólo los 3 proyectos con episodios: el-nexo, pulso-terrestre, voces-de-la-tierra, × ES/EN) |
| `episodes[].title` | `EpisodeList.astro:168` (`<h3>{ep.title}</h3>`) | `{expresión}` plano | 6 |
| `episodes[].description` | `EpisodeList.astro:172-174` (`{ep.description}`) | `{expresión}` plano | 6 |
| `episodes[].videoId` | `EpisodeList.astro:115,122` (`data-video-id`, `src` de thumbnail) | va a atributos HTML (`src=`, `data-video-id=`) | 6 |
| `episodes[].length` (derivado) | `ProjectCard` prop `episodeCount` (todos los call sites) | `{expresión}` plano dentro de `<span>` | 6 |
| `phases[].letter` | `ProyectoDetalle.astro:180` (`{phase.letter}`) | `{expresión}` plano | 14 (cuando hay fases) |
| `phases[].title` | `ProyectoDetalle.astro:183` | `{expresión}` plano | 14 |
| `phases[].description` | `ProyectoDetalle.astro:184` | `{expresión}` plano | 14 |
| `featureCards[].icon` | `ProyectoDetalle.astro:140,143` (lookup en `iconGlyphMap`, glifo impreso) | `{expresión}` plano (el glifo resultante del mapa, no el string `icon` en sí) | 14 (cuando hay tarjetas) |
| `featureCards[].title` | `ProyectoDetalle.astro:144` | `{expresión}` plano | 14 |
| `featureCards[].description` | `ProyectoDetalle.astro:145` | `{expresión}` plano | 14 |
| `voices` | `ProyectoDetalle.astro:160-164` (`{data.voices.map((voice) => <span>{voice}</span>)}`) | `{expresión}` plano | 14 (cuando hay voces) |
| `ctaText` | `ProyectoDetalle.astro:244` (`{t(data.ctaText.es, data.ctaText.en)}`) | `{expresión}` plano (texto del botón) | 14 (cuando hay `ctaText`) |
| `ctaLink` | `ProyectoDetalle.astro:239` (`href={data.ctaLink}`) | va a un atributo HTML (`href=`) | 14 (cuando hay `ctaLink`) |

**Hallazgo de la tabla, no del pedido**: ningún campo de `projects` pasa por `em()` en ningún punto de consumo, ni por `set:html`. Todos los campos de texto libre (`description`, `tagline`, títulos de episodios/fases/tarjetas, `voices`, `ctaText`) se imprimen **siempre planos**. Eso es justamente la Deuda 6: si una editora escribe `*así*` en cualquiera de estos campos, Astro escapa el HTML y el usuario final ve los asteriscos literales, nunca cursiva.

### 3. Canal metadata

Llamada de `ProyectoDetalle.astro` a `BaseLayout` (líneas 69-73):

```astro
<BaseLayout
  title={data.title}
  description={description.slice(0, 160)}
  locale={locale}
>
```

(`description` en esa línea es `t(data.description.es, data.description.en)`, definido en la línea 24. No se pasa `image`, así que `BaseLayout` usa su default `/images/og-default.jpg` — el `heroImage` del proyecto **no** llega al `og:image`.)

Cómo los imprime `BaseLayout.astro` (líneas 34-43):

```astro
<title>{title} — NAUTAS</title>
<meta name="description" content={description} />

<!-- Open Graph -->
<meta property="og:title" content={`${title} — NAUTAS`} />
<meta property="og:description" content={description} />
<meta property="og:type" content="website" />
<meta property="og:image" content={image} />
<meta property="og:site_name" content="NAUTAS" />
<meta property="og:locale" content={locale === 'es' ? 'es_AR' : 'en_US'} />
```

No hay bloque `twitter:*` en `BaseLayout.astro` (no existe en el archivo).

**Campos de `projects` que terminan dentro de un `content="..."` o de un `alt=`** (nunca pueden recibir HTML):

- `title` → `content=` de `og:title` (vía interpolación de template string)
- `description` (recortada a 160 caracteres) → `content=` de `meta name="description"` **y** `content=` de `og:description`
- `heroAlt` → `alt=` del `<img>` de portada en `ProyectoDetalle.astro:110` (y, por fallback `data.heroAlt || data.title`, `title` también puede terminar ahí si `heroAlt` está vacío)

---

## Tarea 3 — Call sites de los componentes compartidos

### `grep -rn "ProjectCard" src/`
```
src/components/pages/Archivo.astro:5:import ProjectCard from '../ProjectCard.astro';
src/components/pages/Archivo.astro:36:          <ProjectCard
src/components/pages/Inicio.astro:7:import ProjectCard from '../ProjectCard.astro';
src/components/pages/Inicio.astro:204:          <ProjectCard
src/components/pages/Proyectos.astro:6:import ProjectCard from '../ProjectCard.astro';
src/components/pages/Proyectos.astro:38:          <ProjectCard
```

### `grep -rn "TeamCard" src/`
```
src/components/pages/Institucional.astro:7:import TeamCard from '../TeamCard.astro';
src/components/pages/Institucional.astro:128:          <TeamCard
```

### `grep -rn "ReadMore" src/`
```
src/components/HeroSection.astro:2:import ReadMore from './ReadMore.astro';
src/components/HeroSection.astro:12:  subtitleReadMore?: boolean;
src/components/HeroSection.astro:25:  subtitleReadMore,
src/components/HeroSection.astro:98:          subtitleReadMore ? (
src/components/HeroSection.astro:99:            <ReadMore
src/components/pages/Inicio.astro:8:import ReadMore from '../ReadMore.astro';
src/components/pages/Inicio.astro:55:    subtitleReadMore={true}
src/components/pages/Inicio.astro:129:            <ReadMore
src/components/pages/Inicio.astro:178:          <ReadMore
src/components/pages/Inicio.astro:186:          </ReadMore>
src/components/ReadMore.astro:126:  function setupReadMore(root) {
src/components/ReadMore.astro:162:  function initReadMore() {
src/components/ReadMore.astro:165:      const s = setupReadMore(root);
src/components/ReadMore.astro:178:    document.fonts.ready.then(initReadMore);
src/components/ReadMore.astro:180:    initReadMore();
```

### `grep -rn "EpisodeList" src/`
```
src/components/pages/ProyectoDetalle.astro:8:import EpisodeList from '../EpisodeList.astro';
src/components/pages/ProyectoDetalle.astro:197:          <EpisodeList
```

### `grep -rn "HeroSection" src/`
```
src/components/pages/Archivo.astro:4:import HeroSection from '../HeroSection.astro';
src/components/pages/Archivo.astro:23:  <HeroSection
src/components/pages/Inicio.astro:4:import HeroSection from '../HeroSection.astro';
src/components/pages/Inicio.astro:50:  <HeroSection
src/components/pages/Inicio.astro:89:  </HeroSection>
src/components/pages/Institucional.astro:4:import HeroSection from '../HeroSection.astro';
src/components/pages/Institucional.astro:21:  <HeroSection
src/components/pages/ProyectoDetalle.astro:4:import HeroSection from '../HeroSection.astro';
src/components/pages/Proyectos.astro:4:import HeroSection from '../HeroSection.astro';
src/components/pages/Proyectos.astro:24:  <HeroSection
```

Mapeo de wrappers (`src/pages/`) a páginas reales (`src/components/pages/`), confirmado leyendo cada wrapper:

| Wrapper ES | Wrapper EN | Componente real |
|---|---|---|
| `src/pages/index.astro` | `src/pages/en/index.astro` | `Inicio.astro` |
| `src/pages/proyectos.astro` | `src/pages/en/proyectos.astro` | `Proyectos.astro` |
| `src/pages/archivo.astro` | `src/pages/en/archivo.astro` | `Archivo.astro` |
| `src/pages/institucional.astro` | `src/pages/en/institucional.astro` | `Institucional.astro` |
| `src/pages/proyectos/[...slug].astro` | `src/pages/en/proyectos/[...slug].astro` | `ProyectoDetalle.astro` (7 proyectos × ES/EN = 14 rutas) |

### Tabla — componente → archivos que lo importan → páginas públicas finales alcanzadas

| Componente | Archivos que lo importan | Páginas públicas finales (ES + EN) | Total |
|---|---|---|---|
| `ProjectCard` | `Archivo.astro`, `Inicio.astro`, `Proyectos.astro` | `/`, `/en`, `/proyectos`, `/en/proyectos`, `/archivo`, `/en/archivo` | 6 |
| `TeamCard` | `Institucional.astro` | `/institucional`, `/en/institucional` | 2 |
| `ReadMore` | `HeroSection.astro` (import siempre, render condicional a `subtitleReadMore`) + `Inicio.astro` (uso directo) | Sólo se **renderiza** en `/`, `/en` (único lugar donde `subtitleReadMore={true}` y donde se usa directo para pilares y producción destacada). El import vía `HeroSection.astro` viaja a `/archivo`, `/en/archivo`, `/institucional`, `/en/institucional`, `/proyectos`, `/en/proyectos` pero ahí nunca se activa (`subtitleReadMore` no se pasa en esos call sites) | 2 páginas con render efectivo |
| `EpisodeList` | `ProyectoDetalle.astro` | Sólo se renderiza cuando `data.episodes.length > 0`: `el-nexo`, `pulso-terrestre`, `voces-de-la-tierra` × ES/EN (`educare` tiene `episodes: []`; `hermanita-sudamerica`, `holomedicina`, `sustento-gaia` no tienen la clave `episodes` en absoluto) | 6 de las 14 páginas de detalle |
| `HeroSection` | `Archivo.astro`, `Inicio.astro`, `Institucional.astro`, `Proyectos.astro`, **`ProyectoDetalle.astro`** (import sin uso, ver Hallazgos inesperados) | `/`, `/en`, `/archivo`, `/en/archivo`, `/institucional`, `/en/institucional`, `/proyectos`, `/en/proyectos` (el import en `ProyectoDetalle.astro` no agrega páginas: nunca se invoca `<HeroSection` ahí) | 8 |

---

## Tarea 4 — Auditoría de `set:html` y de `em()`

### 1. `grep -rn "set:html" src/` (completo, sin filtrar)

```
src/components/HeroSection.astro:94:          <Fragment set:html={title} />
src/components/HeroSection.astro:145:        <Fragment set:html={title} />
src/components/HeroSection.astro:166:        <Fragment set:html={title} />
src/components/ReadMore.astro:55:      <p set:html={firstParagraph} />
src/components/ReadMore.astro:57:        {restParagraphs.map((p) => <p class="mt-4" set:html={p} />)}
src/components/ReadMore.astro:85:      {text ? <Fragment set:html={text} /> : <slot />}
src/components/pages/Institucional.astro:37:          <Fragment set:html={em(t(d?.mission_title)) ?? ''} />
src/components/pages/Institucional.astro:76:            <Fragment set:html={em(t(d?.vision_title)) ?? ''} />
src/components/pages/Institucional.astro:118:          <Fragment set:html={em(t(d?.team_title)) ?? ''} />
src/components/pages/Institucional.astro:148:        <Fragment set:html={em(t(d?.cta_title)) ?? ''} />
src/components/pages/Inicio.astro:100:      set:html={em(t(d?.pillars_title)) ?? (locale === 'en' ? 'Three Pillars, One Universe' : 'Tres Pilares, Un Universo')}
src/components/pages/Inicio.astro:150:        set:html={locale === 'en' ? 'Featured <em>Production</em>' : 'Producción <em>Destacada</em>'}
```

Ningún campo de la colección `projects` aparece en esta lista.

### 2. `src/lib/emphasis.ts` completo

```ts
export function em(text: string | undefined): string | undefined {
  if (!text) return undefined;
  return text.replace(/\*([^*]+)\*/g, '<em>$1</em>');
}
```

Descripción exacta del regex `/\*([^*]+)\*/g`:

- **No es greedy en el sentido de "todo lo más largo posible"**: `[^*]+` es una clase negada (cualquier carácter que no sea `*`), así que el primer `*` que encuentra cierra el match; no hay ambigüedad de longitud porque el asterisco de cierre no puede estar dentro del contenido capturado.
- **Sí cruza saltos de línea**: `[^*]` incluye `\n` (una clase negada excluye sólo lo que está entre corchetes; el salto de línea no está excluido). Un `*` al final de un párrafo y otro `*` varios párrafos después se emparejarían entre sí.
- **No maneja `**doble asterisco**` correctamente**: con la entrada `"**doble**"`, el motor de regex no puede matchear empezando en la posición 0 (el carácter siguiente al primer `*` es otro `*`, que `[^*]+` rechaza), así que el primer match real arranca en la posición 1: captura `*doble*` (siete caracteres, grupo `doble`) y deja un `*` suelto antes y otro después sin tocar. Resultado: `*<em>doble</em>*` — asteriscos sobrantes visibles a los dos lados.
- **Entrada vacía o `undefined`**: `if (!text) return undefined` — un string vacío `""` también es falsy en JS, así que `em("")` devuelve `undefined`, no `""`.

### 3. `src/components/ReadMore.astro` completo

```astro
---
// Bloque de texto truncado con botón "// leer más".
// El botón sólo aparece si el texto REALMENTE se corta: lo decide el JS midiendo
// scrollHeight vs clientHeight. Sin JS no hay botón colgado sin función.
interface Props {
  id?: string;                // Si se pasa, habilita aria-controls. Debe ser único en la página.
  text?: string;              // HTML ya procesado por em(); si no viene, se usa el slot
  lines?: 2 | 3 | 4 | 5 | 6;
  mode?: 'clamp' | 'paragraph';
  moreLabel?: string;
  lessLabel?: string;
  class?: string;             // clases del texto (tipografía, color, opacidad)
  buttonClass?: string;
}

const {
  id,
  text,
  lines = 3,
  mode = 'clamp',
  moreLabel = 'leer más',
  lessLabel = 'leer menos',
  class: className = '',
  buttonClass = '',
} = Astro.props;

// Tailwind escanea el archivo como texto plano: la clase tiene que estar escrita
// entera en el código para que se genere. Por eso el mapa literal y no
// `line-clamp-${lines}`, que no se compilaría.
const clampMap = {
  2: 'line-clamp-2',
  3: 'line-clamp-3',
  4: 'line-clamp-4',
  5: 'line-clamp-5',
  6: 'line-clamp-6',
};
const clampClass = clampMap[lines] ?? clampMap[3];

// Modo párrafo: corta por unidad de sentido, no por líneas renderizadas.
// Tolerante a las dos convenciones: \n\n (estándar) y \n suelto (lo que hay
// hoy en el YAML). Si sale un solo párrafo, no hay nada que expandir.
const rawText = typeof text === 'string' ? text : '';
const paragraphs =
  mode === 'paragraph'
    ? rawText.split(/\n+/).map((p) => p.trim()).filter(Boolean)
    : [];
const firstParagraph = paragraphs[0] ?? '';
const restParagraphs = paragraphs.slice(1);
const hasRest = restParagraphs.length > 0;
---

{mode === 'paragraph' ? (
  <div data-readmore-paragraph>
    <div class={className}>
      <p set:html={firstParagraph} />
      <div id={id} data-readmore-rest hidden>
        {restParagraphs.map((p) => <p class="mt-4" set:html={p} />)}
      </div>
    </div>

    {hasRest && (
      <button
        type="button"
        data-readmore-p-toggle
        aria-expanded="false"
        aria-controls={id}
        data-more-label={moreLabel}
        data-less-label={lessLabel}
        class={`mt-3 font-bitacora italic text-sm text-warm/70 transition-colors duration-200 hover:text-warm inline-flex items-center gap-[0.35rem] ${buttonClass}`}
      >
        <span aria-hidden="true">//</span>
        <span data-readmore-p-label>{moreLabel}</span>
        <span data-readmore-p-arrow class="inline-block transition-transform duration-200">↓</span>
      </button>
    )}
  </div>
) : (
  <div data-readmore>
    <div
      id={id}
      data-readmore-content
      data-clamp-class={clampClass}
      class={`${clampClass} ${className}`}
    >
      {text ? <Fragment set:html={text} /> : <slot />}
    </div>

    <button
      type="button"
      hidden
      data-readmore-toggle
      aria-expanded="false"
      aria-controls={id}
      data-more-label={moreLabel}
      data-less-label={lessLabel}
      class={`mt-3 font-bitacora italic text-sm text-warm/70 transition-colors duration-200 hover:text-warm ${buttonClass}`}
    >
      <span aria-hidden="true">//</span>
      <span data-readmore-label>{moreLabel}</span>
      <span data-readmore-arrow>↓</span>
    </button>
  </div>
)}

<style>
  /* El botón nace con el atributo [hidden]; el JS lo saca sólo si hace falta.
     Usamos :not([hidden]) para no pelear con display:none. */
  [data-readmore-toggle]:not([hidden]) {
    display: inline-flex;
    align-items: center;
    gap: 0.35rem;
  }
  [data-readmore-arrow] {
    display: inline-block;
    transition: transform 0.2s ease;
  }
  [data-readmore-toggle][aria-expanded='true'] [data-readmore-arrow] {
    transform: rotate(180deg);
  }
</style>

<script>
  // Astro deduplica scripts idénticos: aunque el componente se use N veces en una
  // página, este bloque se incluye una sola vez. Por eso recorremos TODAS las
  // instancias con querySelectorAll en vez de asumir que hay una.
  function setupReadMore(root) {
    const content = root.querySelector('[data-readmore-content]');
    const toggle = root.querySelector('[data-readmore-toggle]');
    const label = root.querySelector('[data-readmore-label]');
    if (!content || !toggle || !label) return;

    const clampClass = content.dataset.clampClass || 'line-clamp-3';
    const moreLabel = toggle.dataset.moreLabel || 'leer más';
    const lessLabel = toggle.dataset.lessLabel || 'leer menos';

    const isExpanded = () => toggle.getAttribute('aria-expanded') === 'true';
    // +1px de tolerancia: los redondeos subpíxel dan falsos positivos.
    const overflows = () => content.scrollHeight > content.clientHeight + 1;

    // Sólo re-evaluamos si está colapsado. Si el usuario expandió, respetamos
    // su decisión aunque cambie el ancho de la ventana.
    const sync = () => {
      if (isExpanded()) return;
      toggle.hidden = !overflows();
    };

    toggle.addEventListener('click', () => {
      const next = !isExpanded();
      toggle.setAttribute('aria-expanded', String(next));
      content.classList.toggle(clampClass, !next);
      label.textContent = next ? lessLabel : moreLabel;
      if (!next) {
        toggle.hidden = !overflows();
        content.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
      }
    });

    sync();
    return sync;
  }

  function initReadMore() {
    const syncs = [];
    document.querySelectorAll('[data-readmore]').forEach((root) => {
      const s = setupReadMore(root);
      if (s) syncs.push(s);
    });
    let t;
    window.addEventListener('resize', () => {
      clearTimeout(t);
      t = setTimeout(() => syncs.forEach((s) => s()), 150);
    });
  }

  // Medimos DESPUÉS de que carguen las fuentes: con la fuente fallback el texto
  // ocupa otra altura y la medición sale mal.
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(initReadMore);
  } else {
    initReadMore();
  }
</script>

<script>
  document.querySelectorAll('[data-readmore-paragraph]').forEach((root) => {
    const toggle = root.querySelector('[data-readmore-p-toggle]');
    const rest = root.querySelector('[data-readmore-rest]');
    const label = root.querySelector('[data-readmore-p-label]');
    const arrow = root.querySelector('[data-readmore-p-arrow]');
    if (!toggle || !rest || !label) return;

    const moreLabel = toggle.dataset.moreLabel || 'leer más';
    const lessLabel = toggle.dataset.lessLabel || 'leer menos';

    toggle.addEventListener('click', () => {
      const next = toggle.getAttribute('aria-expanded') !== 'true';
      toggle.setAttribute('aria-expanded', String(next));
      rest.hidden = !next;
      label.textContent = next ? lessLabel : moreLabel;
      if (arrow) arrow.style.transform = next ? 'rotate(180deg)' : '';
    });
  });
</script>
```

**Respuesta por modo**:

- **Modo `clamp`** (líneas 78-103): el contenido se imprime con **`set:html`** — línea 85: `{text ? <Fragment set:html={text} /> : <slot />}`. Ahora bien: esto sólo aplica cuando se pasa la prop `text`. Si no se pasa `text` (como en `Inicio.astro:178-186`, con la descripción del proyecto destacado como children), cae en `<slot />`, que es **plano** (Astro interpola y escapa el contenido del slot como cualquier expresión hija).
- **Modo `paragraph`** (líneas 52-76): cada párrafo se imprime con **`set:html`** — línea 55 (`<p set:html={firstParagraph} />`) y línea 57 (`<p class="mt-4" set:html={p} />` dentro del `.map`). Los dos, primer párrafo y resto, usan `set:html`.

No difiere entre modos en el sentido de "uno sí y otro no": **ambos modos usan `set:html` cuando reciben la prop `text`**. La diferencia real está en el modo `clamp` cuando **no** se pasa `text` (usa slot, plano) — ver siguiente punto.

### 4. Verificación de la inferencia sobre subtítulo del hero y descripciones de pilares

La inferencia a confirmar/desmentir: *"como el subtítulo del hero y las descripciones de pilares vienen de `pages`, ya pasan por `em()` y se renderizan dentro de `ReadMore`, [...] `ReadMore` debería estar imprimiendo con `set:html`."*

Dato leído del código — dónde se arma `subtitle` y `desc` antes de llegar a `ReadMore`/`HeroSection`:

```
src/components/pages/Proyectos.astro:28:    subtitle={t(d?.hero_subtitle)}
src/components/pages/Archivo.astro:26:    subtitle={t(d?.hero_subtitle)}
src/components/pages/Institucional.astro:24:    subtitle={t(d?.hero_subtitle)}
src/components/pages/Inicio.astro:28:    desc: t(d?.pillar_arte_desc) ?? '',
src/components/pages/Inicio.astro:33:    desc: t(d?.pillar_ciencia_desc) ?? '',
src/components/pages/Inicio.astro:38:    desc: t(d?.pillar_consciencia_desc) ?? '',
src/components/pages/Inicio.astro:54:    subtitle={t(d?.hero_subtitle)}
```

**Ninguna de estas siete líneas envuelve el valor en `em(...)`.** `t()` sólo selecciona el idioma (`f?.[locale]`); no transforma el texto.

**Veredicto**: la mitad de la inferencia es correcta y la mitad es falsa.

- Correcto: `ReadMore` efectivamente imprime con `set:html` en los dos lugares donde se usa `hero_subtitle`/`pillar_*_desc` — `HeroSection.astro:99-106` (subtítulo, modo `paragraph`, sólo cuando `subtitleReadMore={true}`, que sólo ocurre en `Inicio.astro:55`) y `Inicio.astro:129-136` (descripciones de pilares, modo `paragraph` directo).
- **Falso**: ninguno de esos dos valores pasa por `em()` antes de llegar a `ReadMore`. Lo que entra a `set:html` es el texto crudo del YAML, no el resultado de `em()`. La razón por la que no se ven asteriscos ni tags `<em>` literales en producción hoy **no es que `em()` los haya convertido** — es que, según el barrido de la Tarea 5, ningún `hero_subtitle` ni `pillar_*_desc` tiene asteriscos ni `<em>` escritos en este momento. Si una editora escribiera `*así*` en `hero_subtitle` o en una descripción de pilar, el resultado sería asteriscos literales visibles (porque nunca pasa por `em()`), no cursiva — el mismo síntoma de la Deuda 6, en un lugar donde `set:html` ya está disponible pero el paso de transformación (`em()`) falta antes de llegar ahí.

---

## Tarea 5 — Qué hay hoy escrito en el contenido

### 1 y 2. `<em>` y asteriscos en `src/content/projects/*.yaml`

```
$ grep -n "<em>\|</em>" src/content/projects/*.yaml
(sin resultados)

$ grep -n "\*" src/content/projects/*.yaml
(sin resultados)
```

No hay ninguna aparición de `<em>`, `</em>` ni de `*` en ninguno de los 7 `.yaml` de `projects` en este momento.

### 3. Hallazgo de producción

No aplica: al no haber ningún `<em>` crudo en ningún campo de `projects` hoy, no hay ningún hallazgo de producción que reportar en esta colección.

### 4. Mismo barrido sobre `src/content/ui/textos.yaml`

```
$ grep -n "<em>\|</em>" src/content/ui/textos.yaml
(sin resultados)

$ grep -n "\*" src/content/ui/textos.yaml
(sin resultados)
```

Tampoco hay coincidencias ahí.

**Conclusión de la Tarea 5**: el contenido actual de `projects` y de `ui/textos` está "limpio" — nadie escribió todavía `*énfasis*` ni `<em>` crudo en ninguno de estos archivos. La Deuda 6 es, a día de hoy, un riesgo latente (el pipeline no soporta énfasis si una editora lo escribe) y no todavía un bug visible en producción. Esto es consistente con que el hint `ASTERISK_HINT` ("Para poner una parte en itálica, encerrala entre asteriscos") **no está presente** en ningún campo de la colección `projects` en `keystatic.config.mjs` (sólo aparece en campos de los singletons `inicio`, `institucional`, `proyectos` y `archivo`) — nadie le enseñó a las editoras que en `projects` esa convención existe, así que es más una cuestión de tiempo que de si va a pasar.

---

## Hallazgos inesperados

1. **`src/content/team/probando-equipo.yaml` es contenido de prueba, en producción, visible.** El pedido asumía 4 `.yaml` de `team`; hay 5. `probando-equipo.yaml` ("Probando Equipo" / "Testing Team", bio "Equipo de prueba") no tiene ningún marcador de borrador y se está sirviendo con el resto: `Institucional.astro:15-16` hace `getCollection('team')` sin ningún filtro. Además tiene `order: 1`, el mismo valor que `equipo-direccion.yaml` — un empate de orden que `Array.prototype.sort` en `Institucional.astro:16` resuelve por orden de lectura del loader (no hay desempate alfabético como sí tiene `sortProjects.ts:3` para `projects`), así que el orden entre estos dos es no determinístico ante cualquier cambio en cómo el `glob` loader enumera archivos.

2. **`ProyectoDetalle.astro` importa `HeroSection` pero nunca lo usa.** `src/components/pages/ProyectoDetalle.astro:4` tiene `import HeroSection from '../HeroSection.astro';` y en todo el archivo no hay ningún `<HeroSection`. El hero de esta página está armado a mano (líneas 74-95) en vez de reusar el componente compartido. Import muerto.

3. **`heroAlt` de `projects` nunca llega a las tarjetas.** `ProjectCard.astro` tiene una prop `imageAlt` (línea 13, default `''`), pero ninguno de los tres call sites (`Inicio.astro:204-215`, `Proyectos.astro:38-49`, `Archivo.astro:36-47`) le pasa `imageAlt={p.data.heroAlt}`. El resultado: el `alt` de la imagen de portada en **todas** las tarjetas de proyecto (grillas de inicio, proyectos y archivo) es siempre una cadena vacía, aunque la editora haya completado el campo "Texto alternativo de la portada" en Keystatic. `heroAlt` sólo se usa en `ProyectoDetalle.astro:110`, la página de detalle.

4. **`photoAlt` existe en el schema de Astro pero no en Keystatic.** `content.config.ts:121` declara `photoAlt: z.string().optional()` para `team`, pero `keystatic.config.mjs` (bloque `team`, líneas 604-628) no define ningún campo `photoAlt`. Es la misma asimetría que ya está documentada como intencional para `hero_image` en `pages` (comentario en `keystatic.config.mjs:12-16`), pero para `photoAlt` no hay ningún comentario que la explique — no se puede distinguir desde el código si es deuda olvidada o diseño a futuro.

5. **La descripción del proyecto destacado en Inicio (`Inicio.astro:178-186`) no pasa `text` a `ReadMore`.** Se le pasan los children en su lugar, lo que fuerza el modo `clamp` sin `text` → cae en `<slot />` (plano). Es un patrón de uso distinto al resto de las llamadas a `ReadMore` en el mismo archivo (pilares, que sí usan `text=`), y es la razón concreta por la que esta instancia particular de `description` de `projects` queda fuera de cualquier transformación HTML, a diferencia de lo que su propio componente permite.

6. **`heroImage` de `projects` nunca llega al `og:image`.** `ProyectoDetalle.astro:69-73` no pasa `image` a `BaseLayout`, así que todas las páginas de detalle de proyecto comparten el mismo Open Graph image por defecto (`/images/og-default.jpg`), sin importar que el proyecto tenga una imagen de portada propia.

## Decisiones que quedan abiertas para Santos

- Si conviene ejercitar el pipeline de guardado de Keystatic (subir una foto real desde el panel en local) antes de dar por cerrado el diagnóstico de la Deuda 10, dado que este relevamiento fue de solo lectura y nunca se probó ese camino end-to-end.
- Qué hacer con `probando-equipo.yaml`: si se borra, se archiva, o se deja y se documenta como fixture intencional.
- Si la Deuda 6 se resuelve extendiendo `em()`/`set:html` a los campos de `projects` tal como funciona hoy en `pages`, o si conviene revisar primero el comportamiento de `em()` con `**doble asterisco**` y con saltos de línea, dado lo encontrado en la Tarea 4.
- Si el `ASTERISK_HINT` debería agregarse a los campos correspondientes de `projects` en Keystatic independientemente de cuándo se resuelva el soporte técnico, para que las editoras no aprendan la convención por error.
- Qué hacer con los hallazgos inesperados 2, 3, 4 y 6 (import muerto, `alt` vacío en tarjetas, `photoAlt` fantasma, `og:image` que ignora `heroImage`): si entran en el mismo trabajo de las Deudas 6/10 o se registran aparte.
