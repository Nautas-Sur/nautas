# Relevamiento de la barra final en URLs (deuda 23)

Solo lectura. No se modificó ningún archivo de `src/`, solo este documento.

- **Branch:** `relevamiento-barra-final`, creada sobre `main` (post-merge
  del fix del formulario de Contacto).
- **Objetivo:** mapear con qué forma (con/sin `/` final) sale cada URL
  hoy, antes de tocar `alternatePath()` — que alimenta tres
  consumidores a la vez (switcher de idioma, `<link>` de `BaseLayout`,
  `serialize()` del sitemap).

## ⚠️ Hallazgo que dispara la condición de parada

**Uno de los tres consumidores de `alternatePath()` ya normaliza la
barra por su cuenta: el `serialize()` del sitemap.** En
`astro.config.mjs`:

```js
serialize(item) {
  const path = new URL(item.url).pathname;
  const withSlash = (p) => (p.endsWith('/') ? p : p + '/');
  const site = 'https://nautas.org.ar';
  return {
    ...item,
    links: [
      { lang: 'es-AR', url: site + withSlash(alternatePath(path, 'es')) },
      { lang: 'en', url: site + withSlash(alternatePath(path, 'en')) },
    ],
  };
},
```

`withSlash()` envuelve **cada** llamada a `alternatePath()` y le agrega
la barra si no la tiene. `BaseLayout.astro` y el switcher (que lee
`enPath`/`esPath` calculados por `BaseLayout`) usan `alternatePath()`
**sin ese envoltorio** — el resultado crudo, sin barra (salvo el caso
especial de la raíz, ver más abajo). Osea: `alternatePath()` en sí
misma es consistente (nunca agrega barra excepto en la raíz); la
divergencia viene de que **el sitemap la parcha localmente y los otros
dos consumidores no**.

Hay además un **segundo punto de normalización independiente**, no
mencionado en el contexto original: el link "Inicio"/"Home" y el logo
del `Header`/`Footer` **no usan `alternatePath()` en absoluto** para
el caso raíz — tienen su propia lógica hardcodeada (`Header.astro`):

```js
const resolveHref = (link) =>
  locale === 'en'
    ? (link.enHref ?? (link.href === '/' ? '/en' : `/en${link.href}`))
    : link.href;
```
y el logo: `href={locale === 'en' ? '/en' : '/'}`.

Esto decide `/en` (sin barra) para el "Home"/logo en inglés,
**independientemente** de lo que decida `alternatePath()`. Son dos
piezas de código separadas tomando decisiones distintas sobre la
misma URL. Ver la sección 6 con la evidencia concreta.

No sigo tocando nada — dejo el resto del relevamiento igual armado
porque ya estaba reunido al confirmar esto, pero el hallazgo de arriba
es la razón por la que hay que pararse acá antes de decidir cómo
tocar `alternatePath()`.

## 2. `src/lib/routes.ts` completo

```ts
export function productionsPath(locale: string): string {
  return locale === 'en' ? '/en/productions' : '/producciones';
}

export function productionPath(locale: string, id: string): string {
  return `${productionsPath(locale)}/${id}`;
}

const SEGMENTS_ES_TO_EN: Record<string, string> = {
  producciones: 'productions',
};

const SEGMENTS_EN_TO_ES: Record<string, string> = Object.fromEntries(
  Object.entries(SEGMENTS_ES_TO_EN).map(([es, en]) => [en, es])
);

export function alternatePath(currentPath: string, target: 'es' | 'en'): string {
  const stripped = currentPath.replace(/^\/en(?=\/|$)/, '');
  const segments = stripped.split('/').filter(Boolean);

  if (segments.length > 0) {
    let first = SEGMENTS_EN_TO_ES[segments[0]] ?? segments[0];
    if (target === 'en') first = SEGMENTS_ES_TO_EN[first] ?? first;
    segments[0] = first;
  }

  if (segments.length === 0) return target === 'en' ? '/en/' : '/';
  const path = '/' + segments.join('/');
  return target === 'en' ? '/en' + path : path;
}
```

**Dato clave para el punto 6:** la línea 27 (`if (segments.length === 0)
return target === 'en' ? '/en/' : '/';`) es el único lugar de toda la
función donde se devuelve algo *con* barra final — y solo para la
raíz. Para cualquier otro path, la línea 29 devuelve sin barra
siempre. La función ya es asimétrica por diseño en el caso raíz, antes
de que el sitemap le agregue su propio parche.

## 3. Bloque de `BaseLayout.astro` — `enPath`/`esPath`/`canonical` y los `<link>`

```astro
const currentPath = Astro.url.pathname;
const enPath = alternatePath(currentPath, 'en');
const esPath = alternatePath(currentPath, 'es');
const canonical = locale === 'es' ? esPath : enPath;
---
...
    <!-- Canonical + alternates -->
    <link rel="canonical" href={new URL(canonical, Astro.site).href} />
    <link rel="alternate" hreflang="es" href={new URL(esPath, Astro.site).href} />
    <link rel="alternate" hreflang="en" href={new URL(enPath, Astro.site).href} />
    <link rel="alternate" hreflang="x-default" href={new URL(esPath, Astro.site).href} />
```

**Nota:** estos `<link>` usan `hreflang="es"` a secas, **no**
`hreflang="es-AR"` — ese código de región solo lo usa el sitemap (ver
punto 4). Es otra pequeña divergencia entre los dos mecanismos, aparte
de la barra.

`Header` recibe `enPath`/`esPath` como props (línea 73) y los usa tal
cual para el botón del switcher — no hay ninguna normalización extra
en el camino entre `BaseLayout` y el botón.

## 4. Bloque `sitemap()` completo de `astro.config.mjs`

```js
sitemap({
  i18n: {
    defaultLocale: 'es',
    locales: {
      es: 'es-AR',
      en: 'en',
    },
  },
  filter: (page) =>
    !page.includes('/keystatic') && !page.includes('/en/producciones'),
  serialize(item) {
    const path = new URL(item.url).pathname;
    const withSlash = (p) => (p.endsWith('/') ? p : p + '/');
    const site = 'https://nautas.org.ar';
    return {
      ...item,
      links: [
        { lang: 'es-AR', url: site + withSlash(alternatePath(path, 'es')) },
        { lang: 'en', url: site + withSlash(alternatePath(path, 'en')) },
      ],
    };
  },
}),
```

## 5. Inventario de formas (sobre el `dist` construido hoy)

| # | Qué | `/producciones` | `/institucional` | ¿Barra? |
|---|---|---|---|---|
| a | `<link rel="canonical">` | `https://nautas.org.ar/producciones` | `https://nautas.org.ar/institucional` | **NO** |
| b | `hreflang="es"` (nota: no `es-AR`) | `https://nautas.org.ar/producciones` | `https://nautas.org.ar/institucional` | **NO** |
| c | `hreflang="en"` | `https://nautas.org.ar/en/productions` | `https://nautas.org.ar/en/institucional` | **NO** |
| d | `<loc>` del sitemap | `https://nautas.org.ar/producciones/` | `https://nautas.org.ar/institucional/` | **SÍ** |
| e | `<xhtml:link hreflang>` del sitemap (`es-AR` y `en`) | `.../producciones/` y `.../en/productions/` | `.../institucional/` y `.../en/institucional/` | **SÍ** (las dos) |
| f | `href` del switcher de idioma | `/en/productions` | `/en/institucional` | **NO** |
| g | `href` del menú Header/Footer (link a la página misma) | `/producciones` | `/institucional` | **NO** |

**Todo lo que no es el sitemap sale sin barra. Todo el sitemap sale
con barra.** La línea de corte es exactamente "sitemap vs. todo lo
demás" — no depende de la página.

## 6. Caso especial: home ES y home EN

| # | Qué | Home ES | Home EN | ¿Barra? |
|---|---|---|---|---|
| a | canonical | `https://nautas.org.ar/` | `https://nautas.org.ar/en/` | **SÍ** (ambas — la raíz siempre "tiene" barra, es trivial) |
| b | `hreflang="es"` | `https://nautas.org.ar/` | `https://nautas.org.ar/` | SÍ |
| c | `hreflang="en"` | `https://nautas.org.ar/en/` | `https://nautas.org.ar/en/` | SÍ |
| d | `<loc>` sitemap | `https://nautas.org.ar/` | `https://nautas.org.ar/en/` | SÍ |
| e | hreflang sitemap | `.../` y `.../en/` | `.../` y `.../en/` | SÍ |
| f | switcher | (en home ES) → `/en/` | (en home EN) → `/` | SÍ / SÍ (trivial en ES→ES) |
| g | nav Header/Footer "Inicio"/"Home" **y logo** | `href="/"` | **`href="/en"`** | **NO en la variante EN** |

**Acá es donde "agregar barra" y "sacar barra" no dan lo mismo.** En
la home ES, todo (canonical, hreflang, switcher, sitemap, nav) ya
converge en `/` — no hay nada que discutir, la raíz es un solo
carácter. Pero en la home **EN**, el canonical/hreflang/switcher dicen
`/en/` (con barra, viene de `alternatePath('/', 'en')`, que
explícitamente devuelve `/en/` para la raíz — línea 27 de
`routes.ts`), mientras que **las cuatro apariciones del link
"Home"/logo en el nav de esa misma página HTML dicen `/en`, sin
barra** — confirmado en `dist/client/en/index.html`:
```
href="/en" class="...text-warm"                      (nav activo)
href="/en" class="...text-on-surface/70..."           (footer)
href="/en" class="...px-3 py-2 rounded text-on-surface" (nav desktop)
href="/en" class="shrink-0..." aria-label="NAUTAS — Inicio"  (logo)
```
Esto **no** viene de `alternatePath()` — viene de la lógica propia de
`Header.astro` (`resolveHref`, ver sección 2 del hallazgo de arriba),
que nunca llama a `alternatePath()` para el caso raíz. Si el futuro
fix normaliza `alternatePath()` para que la raíz EN también salga sin
barra (`/en`), quedaría alineada con el nav pero desalineada con el
patrón "todo con barra" que parece ser la forma real del sitio. Si en
cambio se normaliza a "con barra" en todos lados, el nav de
`Header.astro` queda como una cuarta fuente de verdad suelta que
también habría que tocar — no es una consecuencia automática de
cambiar `alternatePath()`, porque el nav no pasa por ahí.

## 7. Comportamiento real del sitio (`curl -sI` contra producción)

```
GET https://nautas.org.ar/producciones   → 200 OK  (Content-Length: 26576, mismo ETag que con barra)
GET https://nautas.org.ar/producciones/  → 200 OK  (Content-Length: 26576, mismo ETag)

GET https://nautas.org.ar/en             → 200 OK
GET https://nautas.org.ar/en/            → 200 OK

GET https://nautas.org.ar/institucional  → 200 OK
GET https://nautas.org.ar/institucional/ → 200 OK
```

**Ningún 301 en ninguna dirección.** Vercel sirve las dos formas como
200 con contenido idéntico (mismo `Content-Length` y `Etag` en el caso
de `/producciones` vs `/producciones/`, verificado). El servidor no
fuerza ninguna forma — la inconsistencia es puramente de metadata
(`<link>`, sitemap), no de comportamiento HTTP real. Esto confirma lo
que decía el contexto: "la forma con barra es la que el sitio
realmente tiene" es cierto en el sentido de que Astro genera
`producciones/index.html` (un índice de directorio, que es la
convención "con barra"), pero el servidor no lo hace *cumplir* — ambas
formas conviven sin redirect.

## Preguntas abiertas

No se proponen respuestas:

1. **¿Se normaliza `alternatePath()` para que siempre devuelva con
   barra (incluida la raíz EN, que pasaría a `/en/` igual que hoy, sin
   cambios ahí) o se saca la barra del sitemap (quitando el
   `withSlash()`) para que todo converja a "sin barra"?** El servidor
   no obliga ninguna de las dos — la decisión es puramente de qué
   forma declarar como canónica.
2. **El nav "Home"/logo de `Header.astro` no pasa por `alternatePath()`.**
   ¿Se lo hace pasar por ahí (unificando la fuente de verdad) o se lo
   corrige a mano en paralelo? Si se elige "todo con barra" y no se
   toca `Header.astro`, la home EN queda con canonical `/en/` pero
   cuatro links de nav apuntando a `/en` en la misma página.
3. **`hreflang="es"` vs `hreflang="es-AR"`:** `BaseLayout` usa `es` a
   secas, el sitemap usa `es-AR`. ¿Es intencional (dos audiencias
   distintas, `<link>` de HTML vs. sitemap XML) o es otra
   inconsistencia a alinear de paso?
4. **¿Hace falta un redirect 301 real** (agregar la forma que se
   descarte a la tabla `redirects` de `astro.config.mjs`, o vía
   `vercel.json`) para que Google efectivamente vea una sola URL, o
   alcanza con que el `<link rel="canonical">` diga cuál preferir,
   dado que HTTP ya sirve ambas como 200 sin señal de preferencia?
5. **El filtro del sitemap** (`!page.includes('/en/producciones')`,
   que excluye la entrada fantasma de i18n) usa `.includes()` sobre el
   *path sin* normalizar de barra — ¿el cambio en `alternatePath()`
   podría afectar qué matchea ese filtro? No lo verifiqué en este
   relevamiento, queda para cuando se toque el código.
