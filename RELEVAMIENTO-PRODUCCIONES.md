# Relevamiento: renombrar "Proyectos" → "Producciones" / "Projects" → "Productions"

Solo lectura. Ningún archivo de `src/`, `astro.config.mjs` ni `keystatic.config.mjs` fue modificado para este relevamiento.

- Baseline regenerado contra main: SHA `488c19234de14cd4faed45bbcf4a256bf31a23b9` (merge PR #56, espaciado-2-celestialline).
- Rama de este relevamiento: `relevamiento-producciones`.

## 1. Árbol completo de `src/pages/`

```
src/pages/archivo.astro
src/pages/contacto.astro
src/pages/en/archivo.astro
src/pages/en/contacto.astro
src/pages/en/index.astro
src/pages/en/institucional.astro
src/pages/en/proyectos/[...slug].astro
src/pages/en/proyectos.astro
src/pages/index.astro
src/pages/institucional.astro
src/pages/proyectos/[...slug].astro
src/pages/proyectos.astro
```

- `src/pages/proyectos.astro` → genera `/proyectos`.
- `src/pages/en/proyectos.astro` → genera `/en/proyectos` (usa el slug español, no hay slug inglés propio — es el dato ya confirmado en el contexto).
- `src/pages/proyectos/[...slug].astro` → páginas de detalle en español, `/proyectos/<slug>`.
- `src/pages/en/proyectos/[...slug].astro` → páginas de detalle en inglés, `/en/proyectos/<slug>`.

Importante para la tarea: **no existe** mecanismo de i18n automático de Astro generando `/en/proyectos` a partir de `/proyectos` — son 4 archivos físicos separados, cada uno con su propia ruta. Esto significa que renombrar a slugs distintos por idioma es, arquitectónicamente, tan simple como renombrar/mover estos 4 archivos (no hace falta reescribir el sistema de páginas). Ver sección Riesgos para lo que sí hay que tocar en consecuencia.

## 2. Contenido completo de los 4 archivos de ruta

### `src/pages/proyectos.astro`
```astro
---
import Proyectos from '../components/pages/Proyectos.astro';
---
<Proyectos />
```

### `src/pages/en/proyectos.astro`
```astro
---
import Proyectos from '../../components/pages/Proyectos.astro';
---
<Proyectos />
```

### `src/pages/proyectos/[...slug].astro`
```astro
---
import type { GetStaticPaths } from 'astro';
import { getCollection } from 'astro:content';
import ProyectoDetalle from '../../components/pages/ProyectoDetalle.astro';

export const getStaticPaths: GetStaticPaths = async () => {
  const projects = await getCollection('projects');
  return projects.map((p) => ({
    params: { slug: p.id },
  }));
};
---
<ProyectoDetalle />
```

### `src/pages/en/proyectos/[...slug].astro`
```astro
---
import type { GetStaticPaths } from 'astro';
import { getCollection } from 'astro:content';
import ProyectoDetalle from '../../../components/pages/ProyectoDetalle.astro';

export const getStaticPaths: GetStaticPaths = async () => {
  const projects = await getCollection('projects');
  return projects.map((p) => ({
    params: { slug: p.id },
  }));
};
---
<ProyectoDetalle />
```

Los 4 archivos solo envuelven un componente compartido (`Proyectos.astro` / `ProyectoDetalle.astro` en `src/components/pages/`) y no tienen lógica propia de slug — todo el slug sale del nombre/ubicación del archivo de ruta y de `getCollection('projects')`, que usa `p.id` (el slug de cada producción individual, no cambia con esta tarea).

## 3. Bloque i18n de `astro.config.mjs`

```js
i18n: {
  defaultLocale: 'es',
  locales: ['es', 'en'],
  routing: {
    prefixDefaultLocale: false,
    redirectToDefaultLocale: false,
  },
  fallback: {
    en: 'es',
  },
},
```

No define `path`/slug alternativo por locale (esa opción no existe en el `i18n.routing` de Astro tal como está usado acá). Confirma lo anterior: los slugs por idioma dependen 100% de qué archivos existan bajo `src/pages/` y `src/pages/en/`, no de este bloque.

## 4. Ocurrencias — greps completos

### `grep -rn "proyectos" src/ astro.config.mjs keystatic.config.mjs`
```
src/components/Footer.astro:20:  { es: 'Proyectos', en: 'Projects', href: '/proyectos' },
src/components/Header.astro:14:  { es: 'Proyectos', en: 'Projects', href: '/proyectos' },
src/components/pages/Inicio.astro:61:        href={`/${locale === 'en' ? 'en/' : ''}proyectos`}
src/components/pages/Inicio.astro:187:            href={`/${locale === 'en' ? 'en/' : ''}proyectos/${featured.id}`}
src/components/pages/Institucional.astro:166:          href={`/${locale === 'en' ? 'en/' : ''}proyectos`}
src/components/pages/Institucional.astro:169:          {t(d?.cta_button_projects) ?? (locale === 'en' ? 'View projects' : 'Ver proyectos')}
src/components/pages/ProyectoDetalle.astro:269:              href={`/${locale === 'en' ? 'en/' : ''}proyectos/${p.id}`}
src/components/pages/Proyectos.astro:12:const page = await getEntry('pages', 'proyectos');
src/components/ProjectCard.astro:39:const href = `/${locale === 'en' ? 'en/' : ''}proyectos/${slug}`;
src/content/pages/archivo.yaml:5:  es: Explorá todas nuestras producciones y proyectos.
src/content/pages/archivo.yaml:11:  es: Archivo completo de todas las producciones y proyectos de NAUTAS.
src/content/pages/inicio.yaml:57:  es: Ver proyectos
src/content/pages/institucional.yaml:167:  es: Escribinos, sumate al equipo o explorá nuestros proyectos.
src/content/pages/institucional.yaml:173:  es: Ver proyectos
src/content/pages/proyectos.yaml:5:  es: "Producciones audiovisuales y proyectos en desarrollo de NAUTAS: series documentales, podcasts, programas educativos y de salud."
src/content/projects/el-nexo.yaml:142:        presenta proyectos implicados en la conservación, restauración y
src/content/projects/pulso-terrestre.yaml:273:        proyectos como estos, hablamos con Walter Wischnivetzky, de la
src/content/projects/sustento-gaia.yaml:50:      es: "Implementación de proyectos locales de regeneración con participación colectiva."
src/content/projects/voces-de-la-tierra.yaml:103:        proyectos en múltiples campos con reveladoras perspectivas de
src/content/projects/voces-de-la-tierra.yaml:231:        proyectos en distintas organizaciones, cine, medios y universidades. Su
src/content/projects/voces-de-la-tierra.yaml:363:        proyectos para preservar la salud integral de los humanos y del planeta.
src/content/team/carolina-maren.yaml:3:  es: Dirección de proyectos
src/content/team/carolina-maren.yaml:7:     Directora de contenidos y desarrollo de proyectos de la Asociación
keystatic.config.mjs:275:    proyectos: singleton({
keystatic.config.mjs:277:      path: 'src/content/pages/proyectos',
keystatic.config.mjs:404:    // afecta a todos los proyectos.
keystatic.config.mjs:481:          description: 'Aparece entre el adelanto y la lista de episodios, sólo en proyectos que tienen adelanto. Se muestra en minúscula y precedido por //.',
keystatic.config.mjs:510:          description: 'Número más alto = aparece primero en la grilla. Se recomienda numerar de 10 en 10 (10, 20, 30...) para poder insertar un proyecto en el medio más adelante sin tener que renumerar todo. Un proyecto nuevo nace en 100, arriba de todos, hasta que lo reacomodes. Si dos proyectos quedan con el mismo número, se ordenan alfabéticamente por título entre ellos.',
```

### `grep -rn "Proyectos" src/ keystatic.config.mjs`
```
src/components/Footer.astro:20:  { es: 'Proyectos', en: 'Projects', href: '/proyectos' },
src/components/Header.astro:14:  { es: 'Proyectos', en: 'Projects', href: '/proyectos' },
src/content/pages/proyectos.yaml:2:  es: Nautas — Proyectos
src/pages/en/proyectos.astro:2:import Proyectos from '../../components/pages/Proyectos.astro';
src/pages/en/proyectos.astro:4:<Proyectos />
src/pages/proyectos.astro:2:import Proyectos from '../components/pages/Proyectos.astro';
src/pages/proyectos.astro:4:<Proyectos />
keystatic.config.mjs:262:          description: 'El botón con borde que lleva a la página de Proyectos.',
keystatic.config.mjs:276:      label: 'Página: Proyectos',
keystatic.config.mjs:502:      label: 'Proyectos',
```

### `grep -rn "projects" src/ astro.config.mjs keystatic.config.mjs`
```
src/components/pages/Archivo.astro:16:const projects = sortProjects(await getCollection('projects'));
src/components/pages/Archivo.astro:35:      {projects.map((p) => (
src/components/pages/Inicio.astro:19:const projects = sortProjects(await getCollection('projects'));
src/components/pages/Inicio.astro:23:const featured = projects.find((p) => p.data.featured);
src/components/pages/Inicio.astro:199:  {projects.length > 0 && (
src/components/pages/Inicio.astro:202:        {projects.map((p) => (
src/components/pages/Institucional.astro:169:          {t(d?.cta_button_projects) ?? (locale === 'en' ? 'View projects' : 'Ver proyectos')}
src/components/pages/ProyectoDetalle.astro:17:const projects = await getCollection('projects');
src/components/pages/ProyectoDetalle.astro:18:const project = projects.find((p) => p.id === slug);
src/components/pages/ProyectoDetalle.astro:28:// Related: other projects of same pillar
src/components/pages/ProyectoDetalle.astro:29:const related = projects
src/components/pages/ProyectoDetalle.astro:106:  <!-- Hero Image (projects without video) -->
src/components/pages/Proyectos.astro:17:const projects = sortProjects(await getCollection('projects'));
src/components/pages/Proyectos.astro:38:  {projects.length > 0 && (
src/components/pages/Proyectos.astro:41:        {projects.map((p) => (
src/content/pages/archivo.yaml:6:  en: Explore all our productions and projects.
src/content/pages/archivo.yaml:12:  en: Complete archive of all NAUTAS productions and projects.
src/content/pages/inicio.yaml:58:  en: View projects
src/content/pages/institucional.yaml:168:  en: Write to us, join the team, or explore our projects.
src/content/pages/institucional.yaml:172:cta_button_projects:
src/content/pages/institucional.yaml:174:  en: View projects
src/content/pages/proyectos.yaml:6:  en: "Audiovisual productions and projects in development by NAUTAS: documentary series, podcasts, educational and health programs."
src/content/projects/el-nexo.yaml:46:heroImage: /images/projects/el-nexo/heroImage.jpg
src/content/projects/el-nexo.yaml:168:        the Wichi Alliance, he presents projects involved in the conservation,
src/content/projects/hermanita-sudamerica.yaml:41:heroImage: /images/projects/hermanita-sudamerica/heroImage.jpg
src/content/projects/pulso-terrestre.yaml:57:heroImage: /images/projects/pulso-terrestre/heroImage.jpg
src/content/projects/pulso-terrestre.yaml:305:        And regarding the importance of government collaboration in projects
src/content/projects/sustento-gaia.yaml:51:      en: "Implementation of local regeneration projects with collective participation."
src/content/projects/voces-de-la-tierra.yaml:60:heroImage: /images/projects/voces-de-la-tierra/heroImage.jpg
src/content/projects/voces-de-la-tierra.yaml:112:        intercultural understanding proposes projects across multiple fields
src/content/projects/voces-de-la-tierra.yaml:240:        social scientist, he collaborates on projects with various
src/content/projects/voces-de-la-tierra.yaml:373:        awareness about environmental issues and implement projects to preserve
src/content.config.ts:65:    cta_button_projects: bi.optional(),
src/content.config.ts:82:const projectsCollection = defineCollection({
src/content.config.ts:83:  loader: glob({ pattern: '**/*.yaml', base: './src/content/projects' }),
src/content.config.ts:160:  projects: projectsCollection,
src/lib/sortProjects.ts:1:export function sortProjects<T extends { data: { order: number; title: string } }>(projects: T[]): T[] {
src/lib/sortProjects.ts:2:  return [...projects].sort(
src/pages/en/proyectos/[...slug].astro:7:  const projects = await getCollection('projects');
src/pages/en/proyectos/[...slug].astro:8:  return projects.map((p) => ({
src/pages/proyectos/[...slug].astro:7:  const projects = await getCollection('projects');
src/pages/proyectos/[...slug].astro:8:  return projects.map((p) => ({
keystatic.config.mjs:257:        cta_button_projects: fields.object({
keystatic.config.mjs:501:    projects: collection({
keystatic.config.mjs:504:      path: 'src/content/projects/*',
keystatic.config.mjs:545:          directory: 'public/images/projects',
keystatic.config.mjs:546:          publicPath: '/images/projects/',
```

### `grep -rn "Projects" src/ keystatic.config.mjs`
```
src/components/Footer.astro:20:  { es: 'Proyectos', en: 'Projects', href: '/proyectos' },
src/components/Header.astro:14:  { es: 'Proyectos', en: 'Projects', href: '/proyectos' },
src/components/pages/Archivo.astro:7:import { sortProjects } from '../../lib/sortProjects';
src/components/pages/Archivo.astro:16:const projects = sortProjects(await getCollection('projects'));
src/components/pages/Inicio.astro:10:import { sortProjects } from '../../lib/sortProjects';
src/components/pages/Inicio.astro:19:const projects = sortProjects(await getCollection('projects'));
src/components/pages/Inicio.astro:22:// orden que sortProjects ya aplicó al array.
src/components/pages/ProyectoDetalle.astro:256:    {/* Related Projects */}
src/components/pages/Proyectos.astro:8:import { sortProjects } from '../../lib/sortProjects';
src/components/pages/Proyectos.astro:17:const projects = sortProjects(await getCollection('projects'));
src/content/pages/proyectos.yaml:3:  en: Nautas — Projects
src/lib/sortProjects.ts:1:export function sortProjects<T extends { data: { order: number; title: string } }>(projects: T[]): T[] {
src/lib/sortProjects.ts:2:  return [...projects].sort(
src/pages/en/proyectos.astro:2:import Proyectos from '../../components/pages/Proyectos.astro';
src/pages/en/proyectos.astro:4:<Proyectos />
src/pages/proyectos.astro:2:import Proyectos from '../components/pages/Proyectos.astro';
src/pages/proyectos.astro:4:<Proyectos />
```

## 5. Clasificación

**A** = URL que ve el visitante (cambia) · **B** = Texto visible en pantalla (cambia) · **C** = Nombre interno de código/colección (NO cambia) · **D** = Ruta de archivo de contenido en `src/content/` (NO cambia) · **E** = NO SÉ

| Archivo:línea | Fragmento | Categoría |
|---|---|---|
| `src/pages/proyectos.astro` (ruta completa) | genera `/proyectos` | A |
| `src/pages/en/proyectos.astro` (ruta completa) | genera `/en/proyectos` | A |
| `src/pages/proyectos/[...slug].astro` (ruta completa) | genera `/proyectos/<slug>` | A |
| `src/pages/en/proyectos/[...slug].astro` (ruta completa) | genera `/en/proyectos/<slug>` | A |
| `src/pages/en/proyectos.astro:2,4` | `import Proyectos from ...` / `<Proyectos />` | C (nombre del componente importado, no del archivo de ruta) |
| `src/pages/proyectos.astro:2,4` | ídem | C |
| `src/components/Footer.astro:20` | `href: '/proyectos'` | A |
| `src/components/Footer.astro:20` | `es: 'Proyectos', en: 'Projects'` | B |
| `src/components/Header.astro:14` | `href: '/proyectos'` | A |
| `src/components/Header.astro:14` | `es: 'Proyectos', en: 'Projects'` | B |
| `src/components/pages/Inicio.astro:61` | `href={...}proyectos` | A |
| `src/components/pages/Inicio.astro:187` | `href={...}proyectos/${featured.id}` | A |
| `src/components/pages/Institucional.astro:166` | `href={...}proyectos` | A |
| `src/components/pages/Institucional.astro:169` | `'View projects' : 'Ver proyectos'` (fallback hardcodeado) | B |
| `src/components/pages/Institucional.astro:169` | `d?.cta_button_projects` (nombre de campo) | C |
| `src/components/pages/ProyectoDetalle.astro:269` | `href={...}proyectos/${p.id}` | A |
| `src/components/pages/ProyectoDetalle.astro:256` | `{/* Related Projects */}` (comentario) | C |
| `src/components/ProjectCard.astro:39` | `href = ...proyectos/${slug}` | A |
| `src/components/pages/Proyectos.astro:12` | `getEntry('pages', 'proyectos')` | D |
| `src/content/pages/proyectos.yaml` (nombre de archivo) | id del singleton `proyectos` | D |
| `src/content/pages/proyectos.yaml:2-3` | `Nautas — Proyectos` / `Nautas — Projects` (SEO `<title>`) | B |
| `src/content/pages/proyectos.yaml:5-6` | descripción SEO, menciona "proyectos"/"projects" como palabra genérica | B |
| `src/content/pages/inicio.yaml:57-58` | `Ver proyectos` / `View projects` (texto de botón, vía CMS) | B |
| `src/content/pages/institucional.yaml:167-168,173-174` | prosa + `Ver proyectos`/`View projects` (botón) | B |
| `src/content/pages/archivo.yaml:5-6,11-12` | "producciones y proyectos" (prosa genérica) | B |
| `src/content/projects/*.yaml` (el-nexo, pulso-terrestre, sustento-gaia, voces-de-la-tierra) | menciones de "proyectos"/"projects" en biografías/citas, palabra genérica | B |
| `src/content/team/carolina-maren.yaml:3,7` | "Dirección de proyectos" (cargo, prosa) | B |
| `src/content/projects/*.yaml` (`heroImage: /images/projects/...`) | ruta de imagen | D |
| `keystatic.config.mjs:275,277` | `proyectos: singleton({..., path: 'src/content/pages/proyectos'})` | D (ver sección 9 — riesgo bajo) |
| `keystatic.config.mjs:276` | `label: 'Página: Proyectos'` | C (rótulo de panel — ver sección 9) |
| `keystatic.config.mjs:262` | `description: '...página de Proyectos.'` | C (texto de ayuda del panel) |
| `keystatic.config.mjs:257` | `cta_button_projects: fields.object(...)` | C |
| `keystatic.config.mjs:404` | comentario `// afecta a todos los proyectos.` | C |
| `keystatic.config.mjs:481` | descripción de ayuda, "proyectos que tienen adelanto" | C |
| `keystatic.config.mjs:501-502` | `projects: collection({ label: 'Proyectos', ...` | C (label de panel — ver sección 9, riesgo distinto al de arriba) |
| `keystatic.config.mjs:504` | `path: 'src/content/projects/*'` | D (ver sección 9 — **riesgo alto**) |
| `keystatic.config.mjs:510` | descripción de ayuda sobre orden de "proyectos" | C |
| `keystatic.config.mjs:545-546` | `directory: 'public/images/projects'`, `publicPath: '/images/projects/'` | D |
| `src/content.config.ts:65,82-83,160` | `cta_button_projects`, `projectsCollection`, `projects: projectsCollection` | C |
| `src/content.config.ts:83` | `base: './src/content/projects'` | D |
| `src/lib/sortProjects.ts` (archivo completo) | nombre de función/archivo | C |
| `src/components/pages/{Archivo,Inicio,ProyectoDetalle,Proyectos}.astro` (variable `projects`, `getCollection('projects')`) | nombres internos | C |
| `src/pages/proyectos/[...slug].astro:7-8`, `src/pages/en/proyectos/[...slug].astro:7-8` | `getCollection('projects')` | C |

No apareció ningún caso que no encajara en A–D — no hay filas en categoría E.

## 6. Los rótulos visibles (tarea 8)

**a. Rótulo "Proyectos" del menú de navegación (ES):**
`src/components/Header.astro:14`
```js
{ es: 'Proyectos', en: 'Projects', href: '/proyectos' },
```

**b. Equivalente en inglés:** mismo objeto, mismo archivo — `en: 'Projects'` en la misma línea (`Header.astro:14`). Los dos idiomas salen del mismo array, en el mismo archivo.

**c. Otros lugares con el texto visible:**

- **Footer** — array duplicado, archivo distinto: `src/components/Footer.astro:20`, idéntico patrón `{ es: 'Proyectos', en: 'Projects', href: '/proyectos' }`.
- **Botón CTA en Home** (`src/components/pages/Inicio.astro:60-65`): texto del botón sale de `t(d?.hero_cta_primary)` — **contenido del CMS** (`src/content/pages/inicio.yaml`), no hardcodeado; el `href` sí es hardcodeado (`Inicio.astro:61`).
- **Botón "Ver proyectos" en Home** (debajo de la producción destacada, `Inicio.astro:186-192`): texto sale de `t(d?.featured_cta)` — CMS. El valor guardado hoy en `src/content/pages/inicio.yaml:57-58` es literalmente `Ver proyectos` / `View projects`.
- **Botón CTA en Institucional** (`Institucional.astro:158-172`): texto sale de `t(d?.cta_button_projects)` (CMS, `institucional.yaml:173-174` = `Ver proyectos`/`View projects`) con **fallback hardcodeado** en el propio `.astro` (`Institucional.astro:169`): `'View projects' : 'Ver proyectos'`.
- **"Producciones Relacionadas" en el detalle de proyecto** (`ProyectoDetalle.astro:264`): `t('mismas aguas', 'same waters')` / título `u(ui?.data.related_title) ?? t('Producciones Relacionadas', 'Related Productions')` — **dato llamativo**: el fallback hardcodeado acá ya dice "Producciones"/"Productions", no "Proyectos". Ver Riesgos.
- **Hero de la propia página de Proyectos** (`src/content/pages/proyectos.yaml:11-12`): `hero_title` ya dice "Expediciones *y Producciones*" / "Expeditions *& Productions*" — la palabra "Producciones" ya aparece en la portada de la sección, vía CMS.
- **`<title>` y meta description**: vienen de `src/content/pages/proyectos.yaml:2-3` (`Nautas — Proyectos` / `Nautas — Projects`) y `:5-6` (descripción SEO), inyectados por `BaseLayout.astro` en `<title>`, `og:title`, `og:description`, `meta[name=description]`.
- **Breadcrumbs**: no existen — no hay componente de breadcrumbs en el sitio.
- **Alt text / aria-label**: ninguna ocurrencia de "Proyectos"/"Projects" en atributos `alt` o `aria-label` en los greps.

**Archivo de traducciones**: no existe. No hay `i18n/`, `ui.ts` ni `translations.*` para los rótulos de navegación. `Header.astro` y `Footer.astro` tienen **cada uno su propio array `navLinks` hardcodeado**, con la misma forma pero duplicado — hay que tocar los dos por separado. La única infraestructura de traducción real del proyecto es el singleton de Keystatic "Textos de interfaz" (`src/content/ui/textos.yaml`), y confirmé que no contiene "Proyectos"/"Projects" en ningún campo (los únicos matches son nombres de campo `project_cta_*`, sin relación con el nombre de la sección).

## 7. Keystatic (tarea 9)

| Línea | Qué es | Tipo |
|---|---|---|
| `keystatic.config.mjs:276` `label: 'Página: Proyectos'` | Rótulo del panel para el singleton de la página "Proyectos" | **Solo rótulo** — cambiarlo no mueve ni toca ningún archivo de contenido. |
| `keystatic.config.mjs:277` `path: 'src/content/pages/proyectos'` | Ruta al **singleton de la página** (portada de la sección) | **Ruta a `src/content/`.** Es un solo archivo (`proyectos.yaml`, 16 líneas, visto en sección 2) con textos de portada/SEO. Bajo riesgo relativo: si se renombra el archivo o la key del singleton, Keystatic simplemente empieza a leer/guardar en la ruta nueva — es un archivo chico, fácil de migrar a mano si hace falta. |
| `keystatic.config.mjs:502` `label: 'Proyectos'` | Rótulo del panel para la **colección de producciones individuales** (el-nexo, pulso-terrestre, etc.) | **Solo rótulo** — cambiarlo a "Producciones" no mueve archivos. |
| `keystatic.config.mjs:504` `path: 'src/content/projects/*'` | Ruta a la **colección completa de producciones** | **RIESGO ALTO si se toca.** Esta es la colección con los 7+ archivos YAML de cada producción (`el-nexo.yaml`, `pulso-terrestre.yaml`, `voces-de-la-tierra.yaml`, etc.), ya guardados y editados por Caro desde el panel. Renombrar este `path` (o la carpeta `src/content/projects/`) moverían/desconectarían esos archivos del panel. **La tarea no pide tocar esto** — ni la carpeta de contenido de producciones individuales ni su colección de Keystatic tienen que ver con la URL `/proyectos` de la sección, son cosas distintas. Lo marco para que quede explícito que no hay que confundir "renombrar la sección" con "renombrar la colección de producciones".
| `keystatic.config.mjs:501` `projects: collection({...})` (key interna) | Identificador interno de la colección | **No cambia** — es solo el nombre con el que el código pide `getCollection('projects')`, no aparece en ninguna URL ni pantalla. |
| `keystatic.config.mjs:257,262` `cta_button_projects` + descripción "botón que lleva a la página de Proyectos" | Nombre de campo + texto de ayuda del panel | **No cambia** el nombre de campo; el texto de ayuda es cosmético, se puede actualizar sin riesgo si se quiere prolijidad, pero no es obligatorio. |
| `keystatic.config.mjs:404,481,510` | Comentarios y descripciones de ayuda para editores, mencionan "proyecto(s)" como palabra genérica (no como nombre de sección) | **No cambia** — son textos de ayuda internos del panel, no rótulos de sección. |

## 8. Riesgos

- **Los 7 puntos donde el `href` se arma como `/${locale === 'en' ? 'en/' : ''}proyectos...`** (Header, Footer, Inicio×2, Institucional, ProyectoDetalle, ProjectCard) usan **una sola palabra compartida** para los dos idiomas, solo antepuesta con `en/`. Pasar a slugs distintos (`producciones` vs `en/productions`) obliga a tocar los 7 uno por uno para que cada uno arme el string correcto por idioma — no alcanza con cambiar una constante en un solo lugar, porque no existe ese lugar único hoy.
- **`en/proyectos` usa hoy el slug español** (dato ya confirmado): cualquier enlace externo, backlink o resultado indexado en Google a `/en/proyectos` va a romperse en cuanto se mueva a `/en/productions`, salvo que se agregue un redirect — no vi ningún archivo de redirects (`vercel.json` no existe) en el repo, así que hoy **no hay mecanismo de redirect configurado**.
- **Los enlaces al detalle de una producción dependen de que el slug del padre y el slug del hijo (`p.id`) se combinen bien**: `/proyectos/${p.id}` hoy, `/producciones/${p.id}` después. El `p.id` (slug de cada producción, ej. `el-nexo`) no cambia con esta tarea, pero sí cambia el prefijo — los 3 lugares que arman ese link concreto (`Inicio.astro:187`, `ProyectoDetalle.astro:269`, `ProjectCard.astro:39`) están entre los 7 puntos de arriba.
- **`ProyectoDetalle.astro:264` ya usa "Producciones Relacionadas"/"Related Productions"** como fallback, y el propio hero de la página de Proyectos ya dice "Producciones" en el título (`proyectos.yaml:11-12`). El contenido visible ya viene usando "Producciones" de manera inconsistente con el nombre de sección actual ("Proyectos") — vale la pena que quien decida el copy final revise si quiere unificar esos textos también, aunque no son el nombre de la sección en sí.
- **No confundir la colección Keystatic `projects` (`src/content/projects/*`, las producciones individuales) con el singleton `proyectos` (`src/content/pages/proyectos`, la portada de la sección).** Son dos cosas distintas con nombres parecidos; la tarea de renombrar la sección solo toca la segunda. Tocar la primera (path o key) es alto riesgo porque mueve archivos ya guardados por Caro — remarcado también en la sección 9.
- **SEO/indexación**: `proyectos.yaml` tiene `title`/`description` propios para `<title>`, Open Graph y meta description (categoría B). Cambiarlos es una decisión de contenido aparte del cambio de URL, pero como quedan en el mismo archivo que se debe tocar de todos modos, es fácil pisarlos por accidente si no se revisan con cuidado.
- **No se disparó la condición de parada** de "la estructura de rutas no permite slugs distintos por idioma": las 4 rutas ya son archivos físicos independientes por idioma, sin generación automática compartida — soportan slugs distintos sin reescribir el sistema de páginas.
- **No se encontró ningún caso de categoría E** (occurrencia que no encajara en A–D).
