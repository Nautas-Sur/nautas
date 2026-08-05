# Relevamiento previo a Fase 3

Branch: `relevamiento-fase3`. Documento de solo lectura — no modifica `src/`, `public/` ni configuración.

Baseline regenerado desde: **`7ffc08f`** (Merge pull request #28 — HEAD de `main` al momento del relevamiento).

Warnings textuales del build (`../nautas-baseline/build-output.log`):

```
(!) Some chunks are larger than 500 kB after minification. Consider:
- Using dynamic import() to code-split the application
- Use build.rollupOptions.output.manualChunks to improve chunking: https://rollupjs.org/configuration-options/#output-manualchunks
- Adjust chunk size limit for this warning via build.chunkSizeWarningLimit.
```

```
Could not render `/en` from route `/en/` as it conflicts with higher priority route `/en`.
```

Build terminó con `[build] Complete!` (exit 0), sin errores.

---

## Paso 2 — Diagnóstico del conflicto de rutas `/en`

**1. Bloque `i18n` de `astro.config.mjs`:**

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

**2. Archivos físicos en `src/pages/en/`:**

```
src/pages/en/archivo.astro
src/pages/en/contacto.astro
src/pages/en/index.astro
src/pages/en/institucional.astro
src/pages/en/proyectos.astro
src/pages/en/proyectos/[...slug].astro
```

No existe `src/pages/en.astro` (archivo suelto). El único candidato a producir una ruta `/en` (sin slash) explícita en `src/pages` es `en/index.astro`, que en el árbol de Astro normalmente resuelve a `/en/`.

**3. Archivos en `dist/` que resuelven a `/en`:**

El output real queda en `dist/client/` (no `dist/` directo — el adapter `@astrojs/vercel` reubica los estáticos).

- `dist/client/en/index.html` → **existe** (56.568 bytes).
- `dist/client/en.html` → **no existe**.

Solo se generó un archivo físico para `/en`. El warning del build indica que hubo *dos rutas candidatas* en el manifiesto interno de Astro (`/en/` explícita desde `en/index.astro`, y una ruta de mayor prioridad `/en` sin slash) y que Astro descartó una en favor de la otra al momento de prerenderizar — pero solo un archivo llegó a escribirse en disco.

**4. Diff entre ambos:** no aplica — no existen los dos archivos simultáneamente, por lo tanto no hay diff que hacer. Ver "Preguntas abiertas".

**5. `BaseLayout.astro` — canonical y hreflang:**

```astro
const currentPath = Astro.url.pathname;
const canonicalPath = currentPath.replace(/^\/(en|es)(\/|$)/, '$2') || '/';
const enPath = `/en${canonicalPath}`.replace(/\/$/, '') || '/en';
const esPath = canonicalPath.replace(/\/$/, '') || '/';
const canonical = locale === 'es' ? esPath : enPath;
```
```html
<link rel="canonical" href={new URL(canonical, Astro.site).href} />
<link rel="alternate" hreflang="es" href={new URL(esPath, Astro.site).href} />
<link rel="alternate" hreflang="en" href={new URL(enPath, Astro.site).href} />
<link rel="alternate" hreflang="x-default" href={new URL(esPath, Astro.site).href} />
```

Para la home en inglés (`locale === 'en'`, `currentPath === '/en'` o `/en/`): `canonicalPath` queda `'/'`, `enPath` queda `'/en'` (sin slash final, por el `.replace(/\/$/, '')`). El `<link rel="canonical">` declarado para la home en inglés es **`https://project-43ure.vercel.app/en`** (sin slash), mientras que el archivo físico generado es `dist/client/en/index.html`, que sirve la URL con slash final (`/en/`). Hay una discrepancia entre la URL canónica declarada y la ruta física servida.

---

## Paso 3 — Mapa de uso de `pillar`

| Archivo | Línea | Qué hace |
|---|---|---|
| `src/content.config.ts` | 81 | Define el campo en el schema de la colección `projects`: `pillar: z.enum(['arte', 'ciencia', 'consciencia'])`, requerido. |
| `keystatic.config.mjs` | 480–488 | Define el campo `pillar` como `fields.select` en el CMS (colección `projects`), con 3 opciones y `defaultValue: 'arte'`. |
| `keystatic.config.mjs` | 37–61 | Campos de texto bilingüe `pillars_title`, `pillar_arte_title/desc`, `pillar_ciencia_title/desc`, `pillar_consciencia_title/desc` — contenido editorial de la sección "Tres Pilares" del Home, no relacionados al campo `pillar` de proyectos. |
| `src/components/PillarBadge.astro` | archivo completo | Componente que renderiza una badge (glifo + label bilingüe) coloreada según el pilar recibido por prop. Se instancia desde: `ProjectCard.astro:72,129`, `Inicio.astro:173`, `ProyectoDetalle.astro:86,280`. |
| `src/components/ProjectCard.astro` | 8, 23, 72, 129 | Recibe `pillar` como prop tipada y la reenvía a `PillarBadge`; no filtra ni compara por pilar. |
| `src/components/FilterBar.astro` | 8–13 (lista de pilares), 66, 96–107 (lógica JS) | **Filtra por pilar Y por estado (status), con lógica AND.** Cada card debe tener `data-pillar` y `data-status` matcheando ambos filtros activos (`activePillar==='all'\|\|pillar===activePillar` && `activeStatus==='all'\|\|status===activeStatus`, línea 101–103). |
| `src/components/pages/Archivo.astro` | 24, 30, 34 | Única página que usa `FilterBar` (`<FilterBar locale={locale} />`, línea 30) y que marca cada card con `data-pillar={p.data.pillar} data-status={p.data.status}` (línea 34), habilitando el filtrado. |
| `src/components/pages/Proyectos.astro` | 6, 40, 65 | Importa `ProjectCard` (muestra badge de pilar) pero **no importa `FilterBar`** — esta página no tiene filtrado por pilar ni por estado. |
| `src/components/pages/ProyectoDetalle.astro` | 28–32 | Lógica de "Producciones Relacionadas": `projects.filter(p => p.id !== slug).filter(p => p.data.pillar === data.pillar).slice(0, 3)` — mismos pilar que el proyecto actual, excluyendo el propio, tope de 3, sin fallback si hay menos de 3 coincidencias. |
| `src/components/pages/ProyectoDetalle.astro` | 86, 280 | Instancia `PillarBadge` para el proyecto principal (línea 86) y para cada card de "Relacionadas" (línea 280). |
| `src/components/pages/Inicio.astro` | 24–40, 101–138 | Sección "Tres Pilares": array estático de 3 entradas (arte/ciencia/consciencia) con título/descripción editorial del CMS; coloreado vía `--color-pillar-*`. No lee `pillar` de ningún proyecto — es contenido fijo, no derivado de datos. |
| `src/components/pages/Inicio.astro` | 173 | Instancia `PillarBadge` para el proyecto `featured`. |
| `src/styles/global.css` | 68–70 | Tokens de color: `--color-pillar-arte: #d4a574`, `--color-pillar-ciencia: #a3cce9`, `--color-pillar-consciencia: #b8a4d4`. Consumidos inline (`var(--color-pillar-{pillar})`) en `PillarBadge.astro` y en `Inicio.astro` (sección Tres Pilares). |

---

## Paso 4 — Mapa del espaciado vertical del Home

Componente: `src/components/pages/Inicio.astro`. Base de cálculo: escala Tailwind por defecto (1 unidad = 4px, `html` sin override de `font-size`, confirmado en `src/styles/global.css:101-104`). A 1440px el breakpoint `md` (≥768px) está activo, así que se usa siempre el valor `md:` cuando existe.

| Sección | Clases verticales | Equivalente px @1440 |
|---|---|---|
| Hero (`HeroSection` variant `split`) | `pt-32 pb-16 md:pb-24` (definidas en `HeroSection.astro:34`, no en `Inicio.astro`) | pt 128px / pb 96px |
| Separador `CelestialLine` | `my-16 md:my-24` (`CelestialLine.astro:1`) | 96px arriba / 96px abajo |
| Tres Pilares | `mb-32` (`Inicio.astro:93`, sin `pt`) | 128px abajo |
| Producción Destacada | `mb-32` (`Inicio.astro:144`) | 128px abajo |
| Producciones (grid completadas) | `mb-32` (`Inicio.astro:201`) | 128px abajo |
| En Desarrollo | `mb-32` (`Inicio.astro:227`, condicional a `inDev.length > 0`) | 128px abajo |
| Cita/Visión | `mb-20` en el `<section>` (`Inicio.astro:251`) + `GlassPanel padding="xl"` → `p-12 md:p-20` interno (`GlassPanel.astro:8`) | section mb 80px; padding interno del panel 80px en los 4 lados |
| Newsletter CTA | `mb-20 ... py-24 md:py-32` (`Inicio.astro:275-276`) | mb 80px; py interno 128px arriba y abajo |

Nota: todas las secciones comparten `max-w-[1440px] mx-auto px-6 md:px-12` para el espaciado horizontal (no es objeto de este paso, se omite del análisis vertical).

---

## Paso 5 — Inventario de slots de imagen

**1. Contenido actual de `public/images/projects/` y `public/images/team/`:**

```
public/images/projects/el-nexo/heroImage.jpg            4400x4400   1,971.6 KB
public/images/projects/pulso-terrestre/heroImage.webp     640x480      55.5 KB
public/images/projects/voces-de-la-tierra/heroImage.jpg  1280x720     246.4 KB
```

`public/images/team/` **no existe** — el directorio no está en el repo. No hay ninguna referencia a `images/team` en `src/` (grep sin resultados).

Otras imágenes en `public/images/` (fuera del alcance directo del paso pero relevantes al contexto):
```
public/images/logo-nautas_transparencia.png   930x255    28.5 KB
public/images/nautas-logo.png                 277x78      3.7 KB
```

**2. Slots de imagen definidos en código pero no instanciados en ninguna página:**

- `HeroSection.astro` variant `split`, prop `image`/`imageAlt` (líneas 120–130): la rama que renderiza una `<img>` real dentro del hero solo se activa si se pasa la prop `image`. **Confirmado dormido**: la única instanciación de `variant="split"` en todo el repo (`Inicio.astro:49-88`) no pasa `image`, usa `slot="visual"` con el SVG del sextante en su lugar.
- `src/components/BentoGallery.astro`: el archivo existe pero no está importado ni usado en ningún otro archivo de `src` (grep de `BentoGallery` sin resultados fuera del propio archivo). **Confirmado dormido**.
- Adicional no mencionado en las notas: `HeroSection.astro` variant `minimal` está declarado en el union type de `Props.variant` (línea 10) pero ninguna página lo invoca — solo se usan `split` (Inicio), `centered` (Institucional) y `default` (Proyectos, Archivo). También dormido.

**3. `heroImage` propia vs. fallback de YouTube** (según `src/lib/projectCover.ts`: usa `heroImage` si existe, si no cae a `https://img.youtube.com/vi/{videoId}/mqdefault.jpg`):

- Con `heroImage` propia (3 de 7): `el-nexo`, `pulso-terrestre`, `voces-de-la-tierra`.
- Sin `heroImage`, caen al fallback de YouTube (4 de 7): `educare`, `holomedicina`, `sustento-gaia`, `hermanita-sudamerica`.

---

## Paso 6 — Dimensionar la deuda 6 (convenciones de énfasis)

Búsqueda de `<em>` y de pares de asteriscos (`*texto*`) en `src/content/projects/*.yaml`:

```
$ grep -rn "em>" src/content/projects/
(sin resultados)
$ grep -rln "\*[^*]*\*" src/content/projects/*.yaml
(sin resultados)
```

**Resultado: 0 ocurrencias de `<em>` y 0 de `*asteriscos*` en `src/content/projects/`.** Esto contradice la premisa del pedido ("`src/content/projects/*.yaml` sigue usando `<em>` crudo") — al momento de este relevamiento no hay ningún dato en esa colección usando esa convención, cruda o de otro tipo. Ver "Preguntas abiertas".

Dato de contraste — `src/lib/emphasis.ts` define `em()` (convierte `*texto*` → `<em>texto</em>`), pero **no está importado ni llamado en `ProyectoDetalle.astro`** (grep sin resultados). Es decir: aunque hoy se agregara `*énfasis*` a un campo de `src/content/projects/`, no se renderizaría como `<em>` en la página de detalle — el componente no llama a `em()` sobre esos campos.

Para contraste con `src/content/pages/*.yaml` (que las notas dan como ya migrado a asteriscos), conteo real de pares de asteriscos por archivo:
```
src/content/pages/inicio.yaml: 4
src/content/pages/institucional.yaml: 10
src/content/pages/proyectos.yaml: 6
```

---

## Preguntas abiertas

1. **Paso 2 / causa raíz del conflicto `/en`**: se confirmó el síntoma (warning de build, un solo archivo físico generado) pero no se rastreó dentro de `node_modules/astro` cuál es la ruta de mayor prioridad que gana el conflicto ni por qué el manifiesto i18n genera una ruta implícita `/en` además de la explícita `/en/` de `src/pages/en/index.astro`. Falta ese nivel de trazabilidad para poder scopear el fix con precisión.
2. **Paso 6 / premisa del pedido no verificada por los datos**: el pedido asume `<em>` crudo en `src/content/projects/*.yaml`, pero el grep no encuentra ninguna ocurrencia (ni de `<em>` ni de asteriscos) en esa colección. Hay que confirmar con quien escribió el pedido si se refiere a otro estado del contenido (una versión anterior, contenido pendiente de cargar, u otro campo/fuente que no sea `src/content/projects/`).
3. **Paso 5 / `public/images/team/`**: el directorio no existe y no hay ninguna referencia a fotos de equipo en el código. No quedó claro si ese slot está planeado para Fase 3 o si es deuda de un alcance distinto — falta definir si hace falta un componente/slot nuevo o si simplemente no aplica todavía.
