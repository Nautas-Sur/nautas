# Relevamiento — Dominio propio: `site` + canonical de /en (deuda 12)

Fecha: 2026-08-10. Branch: `dominio-propio-site`. Sin cambios de código en
esta fase — solo lectura.

## 1. Dónde está declarado `site` hoy

`astro.config.mjs:11`

```js
export default defineConfig({
  site: 'https://project-43ure.vercel.app',
  ...
```

Valor exacto: `'https://project-43ure.vercel.app'`.

## 2. `grep -rn "Astro\.site" src/` — todos los consumidores

```
src/layouts/BaseLayout.astro:41:    <meta property="og:image" content={new URL(image, Astro.site).href} />
src/layouts/BaseLayout.astro:46:    <link rel="canonical" href={new URL(canonical, Astro.site).href} />
src/layouts/BaseLayout.astro:47:    <link rel="alternate" hreflang="es" href={new URL(esPath, Astro.site).href} />
src/layouts/BaseLayout.astro:48:    <link rel="alternate" hreflang="en" href={new URL(enPath, Astro.site).href} />
src/layouts/BaseLayout.astro:49:    <link rel="alternate" hreflang="x-default" href={new URL(esPath, Astro.site).href} />
src/components/YouTubeEmbed.astro:9:const origin = Astro.site?.origin ?? '';
```

Los seis consumidores derivan su valor de `Astro.site` en tiempo de build:
cambiar `site` en `astro.config.mjs` los actualiza a todos sin tocar estos
archivos. `YouTubeEmbed.astro` usa `Astro.site.origin` como parámetro
`origin=` en el `src` del iframe de YouTube (anti-clickjacking de YouTube).

## 3. `grep -rn "project-43ure\|vercel\.app" .` — clasificación

Búsqueda sobre todo el repo, excluyendo `node_modules`, `.git`, `dist`,
`.vercel`, `.astro`:

| Archivo | Línea | Contenido | Clasificación |
|---|---|---|---|
| `astro.config.mjs` | 11 | `site: 'https://project-43ure.vercel.app'` | **(a)** — es el propio cambio de Fase B |
| `api/auth.js` | 5 | `redirect_uri: 'https://project-43ure.vercel.app/api/callback'` | **(a)** — OAuth redirect del panel Decap CMS legado en `/admin`, en vivo |
| `public/admin/config.yml` | 5 | `base_url: https://project-43ure.vercel.app` | **(a)** — mismo panel Decap CMS (`/admin`, `decap-cms.js`), en vivo |
| `src/components/pages/Inicio.astro` | 157 | `` `...?origin=https://project-43ure.vercel.app` `` (video destacado) | **(a)** — hardcodeado, no usa `Astro.site` |
| `src/components/pages/Inicio.astro` | 158 | `` `...?origin=https://project-43ure.vercel.app` `` (playlist) | **(a)** — ídem |
| `AVANCES-2026-05-22.md` | 73, 98, 99 | URLs de producción/embed citadas en el registro | (b) — no se toca |
| `AVANCES-2026-05-26.md` | 663, 680, 744, 810, 900 | URL del panel Keystatic Cloud citada en el registro | (b) — no se toca |
| `AVANCES-2026-08-05.md` | 205 | URL citada al documentar la deuda 12 | (b) — no se toca |
| `RELEVAMIENTO-FASE3.md` | 82 | URL citada en relevamiento previo | **(b')** — registro histórico de una sesión anterior, mismo criterio que AVANCES aunque no matchee el patrón de nombre; no se toca |
| `RELEVAMIENTO-PANEL-KEYSTATIC.md` | 6 | URL citada en relevamiento previo | **(b')** — ídem |

No apareció ningún resultado de categoría **(c)** (config de Keystatic Cloud
administrada fuera del repo) en el grep — `keystatic.config.mjs` solo tiene
`cloud: { project: 'nautas/nautas' }`, un identificador de proyecto, sin URL.
El "Project URL" de Keystatic Cloud (mencionado como
`https://project-43ure.vercel.app` en `AVANCES-2026-05-26.md:663`) vive en el
dashboard de cloud.keystatic.com, fuera del repo — no hay nada que cambiar
acá, pero **Santos debería actualizarlo manualmente ahí** si quiere que el
panel prod en el dominio nuevo funcione sin fricción (fuera del alcance de
este pedido).

**Nota fuera del inventario A.6:** `public/admin/config.yml` se copia tal
cual a `dist/client/admin/config.yml` (carpeta `public/` se copia verbatim).
Ese archivo no es `.html`, así que no entra en el inventario de la Fase B
armado en el punto 6 sobre los 25 `.html` — pero cambia igual al corregir la
fuente en `public/admin/config.yml`.

## 4. Cómo se construyen `canonical`, `og:url` y `og:image`

No existe una etiqueta `og:url` en el sitio (se revisó `BaseLayout.astro`
completo). Se pega el bloque exacto de `src/layouts/BaseLayout.astro:14-49`:

```astro
const {
  title,
  description = 'Nautas — Asociación argentina dedicada a la integración del arte, la ciencia y la consciencia humana.',
  image = '/images/og-default.jpg',
  locale = 'es',
  noIndex = false,
} = Astro.props;

const currentPath = Astro.url.pathname;
const canonicalPath = currentPath.replace(/^\/(en|es)(\/|$)/, '$2') || '/';
const enPath = `/en${canonicalPath}`.replace(/\/$/, '') || '/en';
const esPath = canonicalPath.replace(/\/$/, '') || '/';
const canonical = locale === 'es' ? esPath : enPath;
---
...
    <meta property="og:image" content={new URL(image, Astro.site).href} />
    ...
    <link rel="canonical" href={new URL(canonical, Astro.site).href} />
    <link rel="alternate" hreflang="es" href={new URL(esPath, Astro.site).href} />
    <link rel="alternate" hreflang="en" href={new URL(enPath, Astro.site).href} />
    <link rel="alternate" hreflang="x-default" href={new URL(esPath, Astro.site).href} />
```

`ProyectoDetalle.astro` (detalle de proyecto) no tiene lógica propia de
canonical/OG: delega todo en `BaseLayout`, pasándole solo
`title`, `description`, `image={data.heroImage}` y `locale`
(`src/components/pages/ProyectoDetalle.astro:70-75`). El resto de las
páginas (`Inicio`, `Institucional`, `Proyectos`, `Contacto`, `Archivo`)
siguen el mismo patrón.

## 5. Paquetes que consumen `site`

`package.json` no tiene `@astrojs/sitemap` ni ningún paquete de sitemap/RSS.
No hay `public/robots.txt`. Los únicos consumidores de `site` son los
listados en el punto 2, todos manuales dentro de `BaseLayout.astro` y
`YouTubeEmbed.astro`.

## 6. Inventario esperado de cambios en `dist/` (criterio de auditoría de Fase B)

Conteo sobre los 25 `.html` del build actual (`dist/client/**/*.html`,
incluye la home ES/EN, institucional, proyectos index + 7 detalle × 2
idiomas, contacto, archivo, y `admin/index.html`):

```
grep -ro "https://project-43ure\.vercel\.app[^\"'<> ]*" dist/client/**/*.html | wc -l
→ 128
```

Desglose por tipo de línea (5 tags fijos × 24 páginas de contenido, el
`admin/index.html` no tiene ninguno porque solo carga `decap-cms.js` desde
unpkg):

| Tipo de línea | Ocurrencias | Páginas |
|---|---|---|
| `<link rel="canonical" href="https://project-43ure.vercel.app/...">` | 24 | todas menos `admin` |
| `<link rel="alternate" hreflang="es" href="...">` | 24 | ídem |
| `<link rel="alternate" hreflang="en" href="...">` | 24 | ídem |
| `<link rel="alternate" hreflang="x-default" href="...">` | 24 | ídem |
| `<meta property="og:image" content="https://project-43ure.vercel.app/images/...">` | 24 | ídem |
| `?origin=https://project-43ure.vercel.app` (iframe YouTube, `YouTubeEmbed.astro`) | 8 | solo páginas con video: home ES/EN + `el-nexo`, `pulso-terrestre`, `voces-de-la-tierra` (ES/EN) |

Total: 24×5 + 8 = **128**, exactamente lo que devolvió el grep.

**Regla de auditoría para la Fase B:** después de mover `site`, el diff de
`dist/` contra el baseline debe mostrar exactamente 128 líneas cambiadas por
el swap de dominio (`project-43ure.vercel.app` → `nautas.org.ar`), repartidas
en los 24 archivos `.html` de contenido según la tabla de arriba, más
cualquier cambio en `dist/client/admin/config.yml` (`base_url`) por ser
copia literal de `public/admin/config.yml`. Ninguna otra línea debería
aparecer. Si aparece, es señal de un consumidor de `site` no relevado acá.

## 7. Estado actual de la deuda 12

`dist/client/en/index.html` (home en inglés) declara:

```html
<link rel="canonical" href="https://project-43ure.vercel.app/en">
<link rel="alternate" hreflang="en" href="https://project-43ure.vercel.app/en">
```

Ambos sin barra final. Según `AVANCES-2026-08-05.md:203-210`, verificado
tanto en `dist/` como en producción real, la URL que efectivamente se sirve
para esa página es `https://project-43ure.vercel.app/en/` — **con** barra
final. El archivo físico es `dist/client/en/index.html`.

Causa: en `BaseLayout.astro:24`,

```js
const enPath = `/en${canonicalPath}`.replace(/\/$/, '') || '/en';
```

Para la home (`canonicalPath === '/'`), `` `/en${canonicalPath}` `` da
`'/en/'`; el `.replace(/\/$/, '')` le saca la barra y el resultado queda en
`'/en'`. El operador `|| '/en'` es un fallback para el caso improbable en que
el string quede vacío — nunca se activa acá, porque `'/en'` ya es truthy
después del replace. Es decir: el fallback no es "el string que se sirve
para /en", es literalmente la ruta sin barra, que es justo el valor
incorrecto. El caso análogo en `esPath` (línea 25) sí resuelve bien para la
home ES porque su fallback es `'/'` (con barra), no `''`.

`enPath` alimenta tanto el `canonical` de la página `/en` como el
`hreflang="en"` de **todas** las páginas (vía `<link rel="alternate"
hreflang="en">`) y el link de cambio de idioma en `Header.astro:70`. De los
25 archivos, solo dos tienen `canonicalPath === '/'` (la home ES y la home
EN): en esos dos, y solo en esos dos, `enPath` vale `'/en'` en lugar de
`'/en/'`. En el resto de las páginas (`/en/proyectos`, `/en/institucional`,
etc.) `enPath` ya es correcto tal cual está.
