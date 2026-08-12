# Relevamiento de espaciado — Institucional (deuda 14, prep. PR 4/4)

Solo lectura. No se modificó ningún archivo de `src/`, solo este documento.

- **Branch:** `relevamiento-institucional`, creada sobre `main` (`08df969`).
- Ya mergeados a `main`: PR 1/4 (`pt-40`→`pt-32`, rama `centered`/`default`
  de `HeroSection.astro`), PR 2/4 (override del primer `CelestialLine` en
  Institucional y Proyectos), PR 3/4 (4 ajustes en Contacto).
- Escala del proyecto: **8 / 16 / 24 / 32 / 48 / 80** (px). El `pt-32`
  (128px) del Hero y su `pb-20` (80px) **no se tocan**.
- **Metodología:** la lista de abajo se armó recorriendo el código de
  cero. `RELEVAMIENTO-ESPACIADO.md` se abrió recién en la sección 7,
  como control cruzado — no como punto de partida.
- **Distinción nueva aplicada:** la escala rige el espacio *entre*
  elementos. El padding interno de un control táctil (botón, input) es
  parte del diseño del componente, no del ritmo de página — se lista
  igual, pero no cuenta como hallazgo a resolver. La aplico de forma
  restrictiva: solo a controles interactivos chicos (botones, inputs),
  no a paddings de secciones/paneles/banners grandes, que siguen
  gobernados por la escala (ver nota en el punto de la CTA, más abajo).

## 1. Componentes que instancia `Institucional.astro`

```
import BaseLayout from '../../layouts/BaseLayout.astro';
import HeroSection from '../HeroSection.astro';
import CelestialLine from '../CelestialLine.astro';
import GlassPanel from '../GlassPanel.astro';
import TeamCard from '../TeamCard.astro';
```

| Componente | Call sites (grep) | ¿Exclusivo o compartido? |
|---|---|---|
| `HeroSection.astro` | `Institucional.astro`, `Inicio.astro`, `Proyectos.astro`, `Archivo.astro` | **Compartido el archivo**, pero Institucional usa `variant="centered"` y esa rama la usa **solo Institucional** (`grep 'variant="centered"'` → 1 solo archivo). Tocar la rama `centered` no arrastra otras páginas. |
| `CelestialLine.astro` | `Institucional.astro` (×4), `Proyectos.astro` (×1), `ProyectoDetalle.astro` (×1, 7 proyectos × 2 idiomas = 14 páginas), `Inicio.astro` (×1), `Contacto.astro` (×1) | **Compartido de verdad.** Tocar el *default* del componente arrastra las 14 páginas de detalle. La decisión vigente (override por página) evita ese arrastre. |
| `GlassPanel.astro` | `Institucional.astro` (`padding` sin especificar → default `lg`), `Inicio.astro` (`padding="xl"`), `ProyectoDetalle.astro` (`padding="md"`) | **Compartido.** Institucional no pasa `padding` ni `class` — usa el default `lg` (`p-8 md:p-12`, 32/48px, en escala). Ninguna otra página usa `lg` explícito hoy, pero es el default del componente, no algo que Institucional inventó. |
| `TeamCard.astro` | Solo `Institucional.astro` | **Exclusivo.** |

No hay ningún componente compartido cuyo *default* necesite tocarse para que Institucional quede en escala — GlassPanel ya da OK con su default, y CelestialLine se resuelve con overrides (mismo mecanismo ya usado en PR 2/4 y PR 3/4), no con cambios al componente. No se disparó la condición de parada de "componente compartido que necesitaría cambios internos".

## 2-5. Inventario completo con clasificación

**OK** = en escala · **INTERNO** = fuera de escala pero es padding de un
control táctil (no se toca) · **CAMBIAR** = fuera de escala, espacio
entre elementos · **NO SÉ** = no determinable

### `Institucional.astro`

| # | Línea | Elemento / clase | Valor | Estado |
|---|---|---|---|---|
| 1 | 32 | `<CelestialLine class="mt-4 mb-8 md:mt-6 md:mb-12" />` (1er separador, override ya aplicado en PR 2/4) | 16/32/24/48px | **OK** |
| 2 | 35 | Misión — margen de sección `mb-32` | 128px | **CAMBIAR** |
| 3 | 36 | Misión — eyebrow `mb-6` | 24px | **OK** |
| 4 | 39 | Misión — grid `gap-12` | 48px | **OK** |
| 5 | 41 | Misión — título h2 `mb-8` | 32px | **OK** |
| 6 | 44 | Misión — círculo decorativo `p-8` | 32px | **OK** |
| 7 | 47 | Misión — símbolo dentro del círculo `mb-4` | 16px | **OK** |
| 8 | 51 | Misión — columna derecha `space-y-8` | 32px | **OK** |
| 9 | 52 | `<GlassPanel>` sin override → default `lg` = `p-8 md:p-12` | 32/48px | **OK** |
| 10 | 53 | Misión — dentro del GlassPanel `space-y-6` | 24px | **OK** |
| 11 | 55 | Misión — primer párrafo `mb-8` | 32px | **OK** |
| 12 | 70 | `<CelestialLine />` (2° separador, **sin override**) | 64/96px | **CAMBIAR** |
| 13 | 73 | Visión — margen de sección `mb-32` | 128px | **CAMBIAR** |
| 14 | 74 | Visión — eyebrow `mb-6` | 24px | **OK** |
| 15 | 79 | Visión — panel izquierdo `p-8 md:p-16 lg:p-20` | 32/64/80px | **CAMBIAR** (el `md:` de 64px rompe la escala) |
| 16 | 80 | Visión — título h2 `mb-10` | 40px | **CAMBIAR** |
| 17 | 83 | Visión — párrafos columna izquierda `space-y-6` | 24px | **OK** |
| 18 | 89 | Visión — panel derecho `p-8 md:p-16 lg:p-20` | 32/64/80px | **CAMBIAR** (mismo problema que #15) |
| 19 | 90 | Visión — wrapper del bloque decorativo `mb-10` | 40px | **CAMBIAR** |
| 20 | 91 | Visión — símbolo ⊙ `mb-6` | 24px | **OK** |
| 21 | 93 | Visión — blockquote `mb-6` | 24px | **OK** |
| 22 | 98 | Visión — párrafos columna derecha `space-y-6` | 24px | **OK** |
| 23 | 113 | `<CelestialLine />` (3er separador, **sin override**) | 64/96px | **CAMBIAR** |
| 24 | 116 | Equipo — margen de sección `mb-32` | 128px | **CAMBIAR** |
| 25 | 117 | Equipo — eyebrow `mb-6` | 24px | **OK** |
| 26 | 120 | Equipo — fila título+subtítulo `mb-14` | 56px | **CAMBIAR** |
| 27 | 122 | Equipo — título h2 `mb-4` | 16px | **OK** |
| 28 | 130 | Equipo — grid de tarjetas `gap-8` | 32px | **OK** |
| 29 | 132 | Equipo — offset de tarjetas alternadas `lg:mt-12` | 48px | **OK** |
| 30 | 144 | `<CelestialLine />` (4° separador, **sin override**) | 64/96px | **CAMBIAR** |
| 31 | 147 | CTA — margen de sección `mb-20` | 80px | **OK** |
| 32 | 147 | CTA — padding vertical `py-24 md:py-32` | 96/128px | **CAMBIAR** (ver nota abajo) |
| 33 | 149 | CTA — eyebrow `mb-6` | 24px | **OK** |
| 34 | 152 | CTA — título h2 `mb-8` | 32px | **OK** |
| 35 | 155 | CTA — subtítulo `mb-10` | 40px | **CAMBIAR** |
| 36 | 158 | CTA — fila de botones `gap-4` | 16px | **OK** |
| 37 | 161 | CTA — botón "Contactanos", gap ícono+texto `gap-2` | 8px | **OK** |
| 38 | 161 | CTA — botón "Contactanos", padding `py-3` | 12px | **INTERNO** |
| 39 | 168 | CTA — botón "Ver producciones", gap ícono+texto `gap-2` | 8px | **OK** |
| 40 | 168 | CTA — botón "Ver producciones", padding `py-3` | 12px | **INTERNO** |

**Nota sobre el `py-24 md:py-32` de la CTA (#32):** el `md:py-32` coincide
en número con la excepción `pt-32` del Hero, pero **no es la misma
excepción** — esa está reservada exclusivamente para despejar el header
fijo, no aplica al padding de un banner. Tampoco lo clasifico como
**INTERNO**: es el padding vertical de una sección banner completa
(`bg-nebula rounded-3xl`), y el propio Home ya trata ese mismo patrón
(Newsletter, `py-20 md:py-20`) como espaciado gobernado por la escala,
no como padding interno de un control. Mantengo esa misma vara acá.

### `HeroSection.astro`, rama `variant="centered"` (archivo compartido, rama exclusiva de Institucional)

| # | Línea | Clase | Valor | Estado |
|---|---|---|---|---|
| 41 | 137 | `pt-32` | 128px | **OK** — excepción, despeja el header fijo, **no se toca** |
| 42 | 137 | `pb-20` | 80px | **OK** — ya en escala, **no se toca** |
| 43 | 140 | `mb-6` (eyebrow) | 24px | **OK** |
| 44 | 144 | `mb-8` (h1 título) | 32px | **OK** |
| 45 | 163 | `mt-8` (wrapper CTA/slot) | 32px | **OK** |

### `TeamCard.astro` (exclusivo de Institucional)

| # | Línea | Clase | Valor | Estado |
|---|---|---|---|---|
| 46 | 14 | `mb-5` (debajo de la foto) | 20px | **CAMBIAR** |
| 47 | 29 | `mb-1` (debajo del nombre) | 4px | **CAMBIAR** |
| 48 | 31 | `mt-3` (arriba de la bio) | 12px | **CAMBIAR** |

No es "padding interno de una tarjeta" en el sentido de la nueva
distinción: son márgenes entre elementos hermanos dentro de la tarjeta
(foto→nombre→rol→bio), no el padding que separa la tarjeta de su propio
borde (`TeamCard` no tiene ningún `p-*` propio — no envuelve su
contenido en una caja con padding).

## Conteo por categoría

| Estado | Cantidad |
|---|---|
| OK | 30 |
| CAMBIAR | 16 |
| INTERNO | 2 |
| NO SÉ | 0 |
| **Total** | **48** |

**Cero NO SÉ.** No se disparó la condición de parada.

## 6. Lista de CAMBIAR con valor propuesto

| Hallazgo | Valor hoy | Propuesta | Por qué ese escalón |
|---|---|---|---|
| Misión — margen de sección (#2) | `mb-32` (128px) | `mb-20` (80px) | Margen uniforme entre secciones, ya usado en Home/Proyectos/Archivo/Contacto. |
| Separador Misión→Visión — CelestialLine sin override (#12) | default `my-16 md:my-24` | override `my-12` | Separador en medio de página, no pegado a un Hero — mismo criterio que se aplicó en Contacto (PR 3/4), no el valor asimétrico de PR 2/4 (ese es específico de estar pegado al `pb-20` del Hero). |
| Visión — margen de sección (#13) | `mb-32` (128px) | `mb-20` (80px) | Misma razón que Misión. |
| Visión — panel izquierdo (#15) | `p-8 md:p-16 lg:p-20` | `p-8 md:p-12 lg:p-20` | Solo el `md:` (64px) rompe la escala; `md:p-12` (48px) es el escalón inmediato inferior, sin tocar `p-8` ni `lg:p-20` que ya están bien. |
| Visión — título (#16) | `mb-10` (40px) | `mb-12` (48px) | Escalón más cercano; coincide con el patrón "mb-12 para títulos h2 de sección" que ya usa el Home. |
| Visión — panel derecho (#18) | `p-8 md:p-16 lg:p-20` | `p-8 md:p-12 lg:p-20` | Mismo caso que #15 (son las dos mitades del mismo bloque). |
| Visión — wrapper decorativo (#19) | `mb-10` (40px) | `mb-12` (48px) | Misma razón que #16. |
| Separador Visión→Equipo — CelestialLine sin override (#23) | default `my-16 md:my-24` | override `my-12` | Misma razón que #12. |
| Equipo — margen de sección (#24) | `mb-32` (128px) | `mb-20` (80px) | Misma razón que Misión/Visión. |
| Equipo — fila título+subtítulo (#26) | `mb-14` (56px) | `mb-12` (48px) | 56px está a 8px de 48 y a 24px de 80 — 48 es el escalón claramente más cercano. |
| Separador Equipo→CTA — CelestialLine sin override (#30) | default `my-16 md:my-24` | override `my-12` | Misma razón que #12 y #23. |
| CTA — padding vertical (#32) | `py-24 md:py-32` (96/128px) | `py-20 md:py-20` (80px) | Iguala el patrón ya usado por el Newsletter del Home para el mismo tipo de banner (`bg-color` + `rounded-3xl`); ver nota sobre por qué no es INTERNO. |
| CTA — subtítulo (#35) | `mb-10` (40px) | `mb-12` (48px) | Misma razón que Visión/título. |
| `TeamCard` — debajo de la foto (#46) | `mb-5` (20px) | `mb-4` (16px) | Escalón inmediato inferior; mantiene el aspecto compacto de tarjeta que ya tiene hoy en vez de agrandarlo. |
| `TeamCard` — debajo del nombre (#47) | `mb-1` (4px) | `mb-2` (8px) | Es el escalón más chico disponible en la escala de 6 — no hay uno menor. |
| `TeamCard` — arriba de la bio (#48) | `mt-3` (12px) | `mt-2` (8px) | 12px está a mitad de camino entre 8 y 16; elijo 8 para mantener la bio visualmente pegada al rol (jerarquía secundaria), no separarla como bloque propio. |

16 hallazgos de valor (los paneles izquierdo/derecho de Visión son el
mismo cambio aplicado dos veces, así que son 15 propuestas distintas
cubriendo 16 líneas).

## 7. Control cruzado contra `RELEVAMIENTO-ESPACIADO.md`

**Hallazgo previo a la comparación, sobre el documento mismo:** conté
la tabla de Institucional de `RELEVAMIENTO-ESPACIADO.md` de forma
mecánica (no a ojo) y da **31 filas de datos: 20 OK + 11 CAMBIAR**. El
resumen que el propio documento escribe al final de esa sección dice
**"18 OK, 9 CAMBIAR"** — no coincide con su propia tabla, le faltan 2
OK y 2 CAMBIAR en la cuenta. Lo marco porque el pedido de hoy menciona
"8 puntos CAMBIAR" para Institucional, y ese número tampoco sale de la
tabla real (11) ni del resumen escrito (9) — parece off-by-one sobre
el resumen ya errado, restando el ítem del Hero que ya se arregló en
PR 1/4 (9−1=8). Uso la tabla real (11 filas CAMBIAR) como base de
comparación, no el resumen.

| Punto de `RELEVAMIENTO-ESPACIADO.md` | ¿Coincide con hoy? |
|---|---|
| Hero apertura `pt-40`→`pt-32` | **Ya resuelto** (PR 1/4, mergeado). Hoy es `pt-32`, clasificado OK — no aparece en mi lista de CAMBIAR. |
| Separador tras Hero (×4) `my-16 md:my-24`→`my-12 md:my-12` | **Parcialmente resuelto y con valor distinto al propuesto.** PR 2/4 arregló *solo* la 1ª instancia (línea 32), con `mt-4 mb-8 md:mt-6 md:mb-12` (asimétrico), no `my-12 md:my-12` como proponía este documento. Las otras 3 instancias (líneas 70, 113, 144) siguen sin tocar — coinciden con mis hallazgos #12, #23, #30. |
| Misión — margen `mb-32`→`mb-20` | **Coincide** con mi #2. |
| Visión — margen `mb-32`→`mb-20` | **Coincide** con mi #13. |
| Visión — paneles internos `p-8 md:p-16 lg:p-20` | **Coincide** con mis #15/#18, mismo diagnóstico (el `md:` es el problema) y misma propuesta. |
| Visión — título `mb-10`→`mb-12` | **Coincide** con mi #16. |
| Visión — bloque decorativo `mb-10`→`mb-12` | **Coincide** con mi #19. |
| Equipo — margen `mb-32`→`mb-20` | **Coincide** con mi #24. |
| Equipo — fila título+subtítulo `mb-14`→`mb-12` | **Coincide** con mi #26. |
| CTA — padding vertical `py-24 md:py-32`→`py-20 md:py-20` | **Coincide** con mi #32 (incluida la razón: mismo patrón que el Newsletter del Home). |
| CTA — subtítulo `mb-10`→`mb-12` | **Coincide** con mi #35. |

**Lo que él tenía y a mí no me apareció como CAMBIAR:** ninguno — los
11 puntos de su tabla real están cubiertos (10 siguen vigentes, 1 ya
resuelto).

**Lo que encontré yo que él no tenía:**
- Los 3 de `TeamCard.astro` (`mb-5`, `mb-1`, `mt-3`) — su tabla se
  detiene en "Equipo — grid de tarjetas | gap-8 | OK" y no entra al
  componente de la tarjeta individual. Mismo patrón que pasó con
  `ContactForm.astro` en el relevamiento de Contacto: un componente
  completo resumido en una sola fila del padre.
- Los 2 `py-3` de los botones de la CTA (categoría **INTERNO**, nueva
  hoy) — su tabla nombra `gap-4` de la fila de botones pero no entra a
  cada botón individual.
- 4 filas **OK** que tampoco tenía: `mb-4` del símbolo dentro del
  círculo de Misión (línea 47), `space-y-6` de la columna izquierda de
  Visión (línea 83 — su tabla solo tenía una fila "párrafos finales"
  para lo que en realidad son dos bloques `space-y-6` separados, uno
  por columna), `lg:mt-12` del stagger de tarjetas del equipo (línea
  132), y los `gap-2` de cada botón de la CTA (líneas 161, 168). Ninguno
  cambia el resultado (todos en escala), pero completan el inventario.

## 8. Instancias de `CelestialLine`

**Cuatro**, todas en `Institucional.astro`:

| Línea | Posición | ¿Override? |
|---|---|---|
| 32 | Tras el Hero | **Sí** — `class="mt-4 mb-8 md:mt-6 md:mb-12"` (PR 2/4) |
| 70 | Entre Misión y Visión | **No** — usa el default `my-16 md:my-24` |
| 113 | Entre Visión y Equipo | **No** — usa el default `my-16 md:my-24` |
| 144 | Entre Equipo y CTA | **No** — usa el default `my-16 md:my-24` |

Solo la primera tiene override. Las otras tres son las que faltan si se
quiere terminar de aplicar la decisión vigente (override por página) en
toda la sección.
