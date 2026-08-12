# Relevamiento de la escala de espaciado como código (deuda 20)

Solo lectura. No se modificó ningún archivo de `src/`, solo este documento.

- **Branch:** `relevamiento-escala`, creada sobre `main` (`b595c0c`, con la
  deuda 14 ya cerrada — Institucional PR 4/4 mergeado).
- **Objetivo:** inventariar cómo está aplicada hoy la escala
  8/16/24/32/48/80(/128) en las 5 páginas, para decidir con datos qué
  forma debería tener el artefacto que la exprese en código. No se
  propone solución acá.

## Metodología

Se recorrieron las 5 páginas (`Inicio.astro`, `Institucional.astro`,
`Proyectos.astro`, `Contacto.astro`, `Archivo.astro`) y **todos los
componentes que cada una instancia**: `HeroSection.astro` (sus 3 ramas:
`split` en Inicio, `centered` en Institucional, `default` en
Proyectos y Archivo), `CelestialLine.astro`, `GlassPanel.astro`,
`TeamCard.astro`, `ProjectCard.astro` (solo la variante `card`, la
única en uso — la variante `horizontal` existe en el código pero no la
usa ninguna página hoy, se excluye de la tabla y se nota aparte), y
`ContactForm.astro`.

**Cómo se cuenta "frecuencia real":** cada clase se cuenta **una vez
por sitio de invocación dentro de las 5 páginas** (cada línea de
código que la escribe), no una vez por nodo del DOM final. Un
componente compartido usado por 3 páginas (`ProjectCard`) aporta 3
ocurrencias de sus clases internas — una por página que lo llama —
pero **no** se multiplica por la cantidad de proyectos/miembros de
equipo que existan en el contenido (eso es dato, no código). Esto es
consistente con la metodología de los relevamientos anteriores de esta
deuda (Institucional, Contacto).

## 1. Tabla de frecuencia (todas las páginas + componentes)

**175 ocurrencias totales.** Ordenada de mayor a menor:

| Valor | px | Ocurrencias | Archivos donde aparece |
|---|---|---|---|
| `-8` | 32px | 30 | Inicio, Institucional, Proyectos, Contacto, HeroSection, GlassPanel |
| `-2` | 8px | 26 | Inicio, Institucional, Contacto, ContactForm, HeroSection, ProjectCard |
| `-12` | 48px | 25 | Inicio, Institucional, Proyectos, Contacto, HeroSection, GlassPanel |
| `-3` | 12px | 22 | Inicio, Institucional, ContactForm, TeamCard, ProjectCard |
| `-6` | 24px | 21 | Inicio, Institucional, Proyectos, Archivo, Contacto, ContactForm, HeroSection |
| `-20` | 80px | 20 | Inicio, Institucional, Proyectos, Archivo, HeroSection |
| `-4` | 16px | 16 | Inicio, Institucional, Proyectos, Contacto, ContactForm |
| `-32` | 128px | 5 | Contacto, HeroSection (las 3 ramas + Contacto a mano) |
| `-1` | 4px | 4 | TeamCard, ProjectCard |
| `-5` | 20px | 4 | TeamCard, ProjectCard |
| `md:p-16` | 64px | 2 | Institucional (paneles de Visión) |

Los 6 escalones de la escala (8/16/24/32/48/80) concentran **138 de
las 175 ocurrencias (79%)**. El 128px de la excepción del Hero suma 5
más. El resto (32 ocurrencias, 18%) está fuera de escala.

## 2-3. Los tres/cuatro grupos

| Grupo | Ocurrencias | Nota |
|---|---|---|
| **ESPACIO ENTRE elementos** | 123 | Margins, gaps y `space-y` entre secciones, bloques, filas de tarjetas, título↔contenido, etc. |
| **PADDING INTERNO** de control/panel/tarjeta | 45 (30 fuera de escala + 15 ya en escala) | Botones, inputs, pills, cajas de estado, `GlassPanel`, y — ver nota abajo — el ritmo tipográfico interno de `TeamCard`/`ProjectCard`. |
| **ALTURA/OFFSET estructural** | 5 | Los 5 `pt-32` que despejan el header fijo (Inicio, Institucional, Proyectos, Archivo, Contacto). Único valor en este grupo. |
| **DUDOSO** | 2 | Ver más abajo — no se fuerzan a ningún grupo. |

**123 + 45 + 5 + 2 = 175.** ✓

**Nota sobre `TeamCard`/`ProjectCard` en el grupo PADDING INTERNO:**
esto es un cambio de criterio respecto a `RELEVAMIENTO-INSTITUCIONAL.md`,
que había clasificado los 3 valores de `TeamCard` como **CAMBIAR**
(margen entre hermanos, no padding de borde). La decisión tomada en la
implementación de PR 4/4 los trató en cambio como "ritmo tipográfico
interno de una tarjeta" y los mandó a la deuda 20 en vez de tocarlos.
Este relevamiento sigue esa decisión ya tomada: agrupa `TeamCard` y,
por el mismo patrón, `ProjectCard` (que tiene la misma clase de
valores: `mb-5`, `pt-1`, `pt-3`/`mt-3`/`gap-3`) bajo PADDING INTERNO.
Lo marco explícitamente porque es una definición de límite, no un
hecho objetivo — alguien podría razonablemente seguir viéndolos como
"espacio entre elementos hermanos" en vez de "padding interno". Es
una de las preguntas abiertas del final.

## 3b. Los 2 DUDOSO

Ninguno de los dos es claramente "espacio entre elementos" (no separa
dos bloques de contenido comparables) ni "padding interno de un
control" (no hay un control/tarjeta cuyo borde estén separando del
contenido):

| Archivo:línea | Clase | Por qué es dudoso |
|---|---|---|
| `Inicio.astro:174` | `gap-3` | El `<div class="flex items-center gap-3">` envuelve **un solo hijo** (`<span>// {kind}</span>`). No hay un segundo elemento del cual separarse — el `gap-3` no está separando nada en la práctica. Podría ser vestigial de una versión con más de un hijo. |
| `Inicio.astro:189` | `hover:gap-3` (sobre un `gap-2` base) | Es un cambio de gap en estado `:hover` (el ícono se aleja del texto al pasar el mouse), 8px→12px. Es una micro-interacción, no una decisión de ritmo de página — no está claro que tenga sentido forzarla a la escala de 6 pasos de la misma manera que un margen entre secciones. |

## 4. Valores fuera de escala (no en 8/16/24/32/48/80/128)

**32 ocurrencias en total** (18% de las 175), pero corresponden a
**solo 5 patrones distintos de código** — la multiplicación viene de
que `ProjectCard` se llama desde 3 páginas:

| Patrón | px | Archivo:línea (todas las ocurrencias) | Ocurrencias |
|---|---|---|---|
| `py-3` en botones/inputs | 12px | `Inicio.astro:63,70,281,291` · `Institucional.astro:161,168` · `ContactForm.astro:33,47,77,85` | 10 |
| `gap-3`/`pt-3`/`mt-3` internos de `ProjectCard` | 12px | `ProjectCard.astro:119,133,133` × 3 páginas que lo llaman (Inicio, Proyectos, Archivo) | 9 |
| `mt-3` interno de `TeamCard` | 12px | `TeamCard.astro:31` | 1 |
| `mb-5` (foto/imagen → contenido) | 20px | `TeamCard.astro:14` · `ProjectCard.astro:98` × 3 páginas | 4 |
| `pt-1`/`mb-1` (tagline/nombre, ajuste fino) | 4px | `ProjectCard.astro:128` × 3 páginas · `TeamCard.astro:29` | 4 |
| `md:p-16` en los paneles de Visión | 64px | `Institucional.astro:79,89` | 2 |
| **DUDOSO** (no forzado a ningún patrón de arriba) | 12px | `Inicio.astro:174,189` | 2 |

**Después de la deuda 14, quedan 5 patrones (no 32 casos sueltos), y
los 5 son de padding/ritmo interno de un control, panel o tarjeta —
ninguno es margen entre secciones.** Coincide con lo que se esperaba
en el objetivo del pedido.

## 5. Bloque `@theme` actual de `global.css`

```css
@theme {
  /* ── COLORES: La noche ── */
  --color-background: #0a0e1a;
  --color-surface: #11131d;
  --color-surface-dim: #11131d;
  --color-surface-container-lowest: #0c0e18;
  --color-surface-container-low: #191b26;
  --color-surface-container: #1d1f2a;
  --color-surface-container-high: #282934;
  --color-surface-container-highest: #32343f;
  --color-surface-bright: #373844;
  --color-surface-variant: #32343f;

  /* ── COLORES: La luz (textos, cálidos no clínicos) ── */
  --color-on-surface: #ece8dd;
  --color-on-surface-variant: #b8b5ac;
  --color-on-background: #ece8dd;
  --color-outline: #8e9196;
  --color-outline-variant: #44474c;
  --color-on-surface-susurro: #6b6960;

  /* ── COLORES: El cielo (identidad celestial) ── */
  --color-primary: #a3cce9;
  --color-on-primary: #00344c;
  --color-primary-container: #001d2c;
  --color-on-primary-container: #6087a2;
  --color-primary-fixed: #c7e7ff;
  --color-primary-fixed-dim: #a3cce9;
  --color-on-primary-fixed: #001e2e;
  --color-on-primary-fixed-variant: #204b63;
  --color-inverse-primary: #3a637c;
  --color-surface-tint: #a3cce9;

  /* ── COLORES: El fuego (calidez cálida para romper la frialdad) ── */
  --color-warm: #d4a574;
  --color-warm-strong: #c89968;
  --color-warm-deep: #b07d4a;
  --color-warm-ember: #8b4513;
  --color-on-warm: #1a1408;

  /* ── COLORES: Secondary y Tertiary ── */
  --color-secondary: #c6c7c3;
  --color-on-secondary: #2f312e;
  --color-secondary-container: #4a4c49;
  --color-on-secondary-container: #bbbcb8;
  --color-secondary-fixed: #e2e3df;
  --color-secondary-fixed-dim: #c6c7c3;
  --color-on-secondary-fixed: #1a1c1a;
  --color-on-secondary-fixed-variant: #454745;

  --color-tertiary: #d4a574;
  --color-on-tertiary: #1a1408;
  --color-tertiary-container: #3a2a18;
  --color-on-tertiary-container: #e6c89c;
  --color-tertiary-fixed: #f0d4a8;
  --color-tertiary-fixed-dim: #d4a574;
  --color-on-tertiary-fixed: #1a1408;
  --color-on-tertiary-fixed-variant: #6b4f2d;

  /* Los tokens de pilar viven en @theme static, más abajo: se arman en
     runtime como `var(--color-pillar-${x})` y quedan invisibles al
     escáner de Tailwind. */

  /* ── COLORES: Error ── */
  --color-error: #ffb4ab;
  --color-on-error: #690005;
  --color-error-container: #93000a;
  --color-on-error-container: #ffdad6;

  /* ── COLORES: Inverse ── */
  --color-inverse-surface: #ece8dd;
  --color-inverse-on-surface: #2e303b;

  /* ── TIPOGRAFÍAS ── */
  --font-headline: 'Cormorant Garamond', Georgia, serif;
  --font-body: 'Inter', system-ui, sans-serif;
  --font-label: 'Inter', system-ui, sans-serif;
  --font-bitacora: 'DM Mono', 'Courier New', monospace;

  /* ── RADIOS ── */
  --radius-sm: 0.25rem;
  --radius-md: 0.5rem;
  --radius-lg: 1rem;
  --radius-xl: 1.5rem;
  --radius-full: 9999px;
}

/* Tailwind solo emite las variables de @theme cuyo uso detecta escaneando
   el código como texto. Estas se consumen armando el nombre en runtime
   (`var(--color-pillar-${pillar})` en PillarBadge.astro e Inicio.astro),
   así que el escáner nunca las ve — su presencia en el CSS quedaba librada
   a que alguna mención suelta en un .md del repo las escribiera por casualidad
   (así se rompió --color-pillar-ciencia en producción del 05/08 02:08 a 14:14 UTC).
   @theme static las fuerza a emitirse siempre, sin depender de eso. */
@theme static {
  --color-pillar-arte: #d4a574;
  --color-pillar-ciencia: #a3cce9;
  --color-pillar-consciencia: #b8a4d4;
}
```

**No hay ninguna variable `--spacing-*` declarada.** El bloque
`@theme` solo tiene colores, tipografías y radios. `@theme static` ya
se usa en este archivo, pero exclusivamente para los 3 colores de
pilar que se arman con template literal en runtime — no hay
precedente de uso de `@theme static` para espaciado.

**Dato relevante para la restricción de Tailwind 4 mencionada en el
pedido:** hoy la escala de espaciado se escribe siempre como clases
Tailwind literales (`mb-20`, `py-20`, `mt-4`) directamente en el
markup — nunca como `class={\`mb-${valor}\`}` ni nada armado en
runtime. Por eso el escáner de Tailwind las ve sin problema y no hace
falta `@theme static` para que las clases *actuales* funcionen. La
restricción sí importaría si el futuro artefacto involucra construir
nombres de clase dinámicamente (por ejemplo, un helper que reciba un
paso de la escala como parámetro y arme la clase) — ahí sí se
repetiría el mismo patrón de falla que ya rompió `--color-pillar-ciencia`
el 05/08.

## 6. Instancias de `CelestialLine` en todo el sitio

**8 instancias**, **4 valores/patrones distintos**:

| Archivo:línea | Override | Valor efectivo |
|---|---|---|
| `Institucional.astro:32` | `mt-4 mb-8 md:mt-6 md:mb-12` | 16/32/24/48px (asimétrico) |
| `Proyectos.astro:35` | `mt-4 mb-8 md:mt-6 md:mb-12` | 16/32/24/48px (asimétrico) |
| `Institucional.astro:70` | `my-12` | 48px parejo |
| `Institucional.astro:113` | `my-12` | 48px parejo |
| `Institucional.astro:144` | `my-12` | 48px parejo |
| `Contacto.astro:71` | `my-12` | 48px parejo |
| `Inicio.astro:92` | `my-12 md:my-12` | 48px parejo |
| `ProyectoDetalle.astro:260` | **sin override** → default del componente | `my-16 md:my-24` = 64/96px (×14 páginas: 7 producciones × 2 idiomas) |

**Frecuencia por patrón:**
- `my-12` (sin `md:`, o con `md:my-12` repitiendo el mismo valor): **5 instancias** (Institucional ×3, Contacto ×1, Inicio ×1). Cuenta aparte: `Inicio.astro:92` escribe `my-12 md:my-12` — dos tokens que producen exactamente el mismo resultado visual que escribir solo `my-12` (48px en todos los breakpoints), ya que no hay ningún valor distinto para `md:`. Es una inconsistencia de forma, no de resultado: dos maneras distintas de escribir lo mismo.
- `mt-4 mb-8 md:mt-6 md:mb-12` (asimétrico, pegado a un Hero): **2 instancias** (Institucional, Proyectos).
- Default del componente sin tocar (`my-16 md:my-24`): **1 instancia de código**, pero se renderiza en **14 páginas** (`ProyectoDetalle.astro`, fuera del alcance de las 5 páginas de este relevamiento, pero comparte el componente).

## Preguntas abiertas

No se proponen respuestas — quedan para decidir antes de escribir código:

1. **¿El artefacto son tokens de diseño (`--spacing-*` en `@theme`) o
   una herramienta de enforcement (lint/convención documentada)?** Son
   dos cosas distintas: unos tokens no impiden que alguien escriba
   `mb-14` mañana; un lint sí, pero no resuelve por sí solo cómo se
   nombran/consumen los 6 pasos en el markup.
2. **¿Los 6 pasos se convierten en `--spacing-*` semánticos (ej.
   `--spacing-xs/sm/md/lg/xl/2xl`) o se deja la escala base de
   Tailwind (`--spacing: 0.25rem`) tal cual, y el "enforcement" es
   solo documental?** Cambia si el markup se reescribe (`mb-20` →
   `mb-section` o similar) o si se queda igual y solo se agrega
   una capa de verificación.
3. **¿Qué se hace con el default de `CelestialLine`
   (`my-16 md:my-24`, 64/96px, fuera de escala) que sigue
   alimentando las 14 páginas de `ProyectoDetalle`?** La decisión
   vigente hoy es "override por página, nunca tocar el default" —
   ¿eso queda así permanentemente, o en algún momento se revisa el
   default mismo (lo que sí arrastraría esas 14 páginas)?
4. **¿El grupo PADDING INTERNO (45 ocurrencias, 5 patrones) entra
   dentro del alcance del artefacto de la deuda 20, o queda
   explícitamente afuera?** El pedido de PR 4/4 ya trató
   `TeamCard`/`ProjectCard` como "deuda 20" — falta confirmar si
   "deuda 20" significa "les toca la MISMA escala más adelante" o
   "quedan con su propia escala de padding interno, distinta a la de
   8/16/24/32/48/80".
5. **Los 2 casos DUDOSO** (`gap-3` sin efecto en `Inicio.astro:174`,
   `hover:gap-3` en `Inicio.astro:189`) — ¿se limpian como parte de
   este trabajo (son casi seguro descuido de código, no una decisión
   de diseño) o quedan fuera por no ser estrictamente "espaciado de
   ritmo"?
6. **La duplicación `my-12` vs `my-12 md:my-12`** (mismo resultado,
   dos formas de escribirlo, en `Inicio.astro:92` vs. el resto) —
   ¿el enforcement futuro normaliza esto (una sola forma canónica) o
   es indiferente mientras el valor final sea el mismo?
7. **¿El artefacto valida solo código nuevo o también audita el
   código existente?** Si es lo segundo, los 32 casos de PADDING
   INTERNO fuera de escala necesitan una decisión explícita de
   "exceptuado" antes de que cualquier chequeo automático pueda
   correr sin romper con falsos positivos.
