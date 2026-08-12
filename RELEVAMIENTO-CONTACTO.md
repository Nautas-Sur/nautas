# Relevamiento de espaciado — Contacto (deuda 14, prep. PR 3/4)

Solo lectura. No se modificó ningún archivo de `src/`, solo este documento.

- **Branch:** `relevamiento-contacto`, creada sobre `main` (`ab7bd14`).
- Ya están mergeados a `main`: PR 1/4 (`espaciado-1-hero`, `pt-40`→`pt-32`
  en la rama `centered`/`default` de `HeroSection.astro`) y PR 2/4
  (`espaciado-2-celestialline`, override `mt-4 mb-8 md:mt-6 md:mb-12` en
  el primer `<CelestialLine />` de Institucional y Proyectos, sin tocar
  el default del componente).
- Escala del proyecto: **8 / 16 / 24 / 32 / 48 / 80** (px). Excepción
  única: `pt-32` (128px), reservada para despejar el header fijo.

## 1. Los 3 puntos que RELEVAMIENTO-ESPACIADO.md marcó como CAMBIAR para Contacto

Textuales, de la sección "### Contacto" de `RELEVAMIENTO-ESPACIADO.md`:

| Sección | Clase actual | Propuesta |
|---|---|---|
| Bloque hero-like — cierre | `pb-16` (64px) | `pb-12` (48px, iguala el `pb-12` del Hero del Home) |
| Grid de 2 columnas (info / formulario) | `gap-16` (64px) | `gap-12` (48px, iguala el `gap-12` del grid del Hero del Home) |
| Separador antes de redes sociales | `my-16 md:my-24` (default de `CelestialLine`, 64px/96px) | `my-12 md:my-12` (48px) |

## 2 y 4. Inventario completo, en orden de aparición, con clasificación

Filtro: `pt/pb/py/mt/mb/my/gap/space-y` y también `p-*` (4 lados) cuando
aporta espaciado vertical. Verificado con grep dedicado sobre ambos
archivos (no a mano) para no repetir el error de método que ya se
documentó en `RELEVAMIENTO-ESPACIADO.md` (el `p-*` que un filtro
anterior no vio).

### `Contacto.astro`

| # | Línea | Clase | Valor | Estado | Nota |
|---|---|---|---|---|---|
| 1 | 19 | `pt-32` | 128px | **OK** | Excepción — este bloque no usa `HeroSection`, es un `<section>` a mano, pero cumple la misma función: despejar el header fijo. No es coincidencia de número, es la misma razón de fondo. |
| 2 | 19 | `pb-16` | 64px | **CAMBIAR** | Punto 1 del relevamiento de ayer, sigue igual. |
| 3 | 20 | `gap-16` | 64px | **CAMBIAR** | Punto 2 del relevamiento de ayer, sigue igual. |
| 4 | 23 | `mb-6` (eyebrow) | 24px | **OK** | |
| 5 | 26 | `mb-4` (h1) | 16px | **OK** | |
| 6 | 29 | `mb-12` (tagline) | 48px | **OK** | |
| 7 | 33 | `space-y-8` (bloque de datos) | 32px | **OK** | |
| 8 | 35 | `mb-2` (dato: email) | 8px | **OK** | |
| 9 | 44 | `mb-2` (dato: youtube) | 8px | **OK** | |
| 10 | 53 | `mb-2` (dato: ubicación) | 8px | **OK** | |
| 11 | 62 | `mb-2` (dato: tiempo de respuesta) | 8px | **OK** | |
| 12 | 71 | `<CelestialLine />` sin override → default `my-16 md:my-24` | 64px / 96px | **CAMBIAR** | Punto 3 del relevamiento de ayer — ver sección 3, el valor propuesto cambió. |
| 13 | 74 | `gap-4` (fila de íconos sociales) | 16px | **OK** | **No estaba en la tabla de `RELEVAMIENTO-ESPACIADO.md`** — el relevamiento de ayer saltaba directo del separador al panel del formulario. Está en escala, no cambia nada, pero lo sumo para que el inventario quede completo. |
| 14 | 126 | `p-8 md:p-12` (panel del formulario, escrito a mano) | 32px / 48px | **OK** | Coincide con la variante `lg` de `GlassPanel`, ya señalado ayer. |
| 15 | 127 | `mb-8` (título del formulario) | 32px | **OK** | |

**Subtotal `Contacto.astro`: 12 OK, 3 CAMBIAR, 0 NO SÉ.**

### `ContactForm.astro` (instanciado sin override — `<ContactForm locale={locale} />`, el componente no acepta prop `class`)

| # | Línea | Clase | Valor | Estado | Nota |
|---|---|---|---|---|---|
| 16 | 18 | `space-y-6` (form) | 24px | **OK** | Ya estaba en el relevamiento de ayer. |
| 17 | 25 | `mb-2` (label nombre) | 8px | **OK** | |
| 18 | 33 | `py-3` (input nombre) | 12px | **CAMBIAR** | **Nuevo hallazgo**, no estaba en el relevamiento de ayer (que resumía todo `ContactForm` en dos líneas). Es padding de campo de formulario, no ritmo de sección — lo marco igual porque 12px no está en la escala. |
| 19 | 39 | `mb-2` (label email) | 8px | **OK** | |
| 20 | 47 | `py-3` (input email) | 12px | **CAMBIAR** | Mismo caso que #18. |
| 21 | 53 | `mb-3` (label asunto) | 12px | **CAMBIAR** | **Nuevo hallazgo**. |
| 22 | 56 | `gap-2` (fila de pills de asunto) | 8px | **OK** | |
| 23 | 60 | `py-2` (cada pill/tag de asunto) | 8px | **OK** | **Nuevo hallazgo** (estaba dentro del "resumen" de ayer), pero da OK. |
| 24 | 69 | `mb-2` (label mensaje) | 8px | **OK** | |
| 25 | 77 | `py-3` (textarea mensaje) | 12px | **CAMBIAR** | Mismo caso que #18. |
| 26 | 85 | `gap-2` (botón enviar, ícono+texto) | 8px | **OK** | **Nuevo hallazgo**. |
| 27 | 85 | `py-3` (botón enviar) | 12px | **CAMBIAR** | **Nuevo hallazgo**. |
| 28 | 91 | `p-4` (caja de éxito) | 16px | **OK** | **Nuevo hallazgo**. |
| 29 | 94 | `p-4` (caja de error) | 16px | **OK** | **Nuevo hallazgo**. |

**Subtotal `ContactForm.astro`: 9 OK, 5 CAMBIAR, 0 NO SÉ.**

## Conteo total

| Archivo | OK | CAMBIAR | NO SÉ | Total |
|---|---|---|---|---|
| `Contacto.astro` | 12 | 3 | 0 | 15 |
| `ContactForm.astro` | 9 | 5 | 0 | 14 |
| **Total** | **21** | **8** | **0** | **29** |

**Cero NO SÉ.** No se disparó la condición de parada de la tarea.

El relevamiento de ayer contaba 12 líneas para Contacto (9 OK, 3
CAMBIAR) porque resumía `ContactForm.astro` en dos entradas. Repasando
`ContactForm.astro` línea por línea aparecen 5 `CAMBIAR` más, todos
`py-3`/`mb-3` de 12px (padding de inputs y label de "asunto") — ningún
valor nuevo en escala rota nada grave, pero el inventario completo
correcto es 29 líneas, no 12.

## 3. Vigencia de los 3 puntos de ayer

1. **`pb-16` → propuesta `pb-12`: sigue vigente tal cual.** La clase no
   cambió desde ayer (`Contacto.astro:19`).
2. **`gap-16` → propuesta `gap-12`: sigue vigente tal cual.** Tampoco
   cambió (`Contacto.astro:20`).
3. **CelestialLine (separador antes de redes sociales): el hallazgo
   sigue vigente, pero la propuesta de valor quedó desactualizada.**
   `RELEVAMIENTO-ESPACIADO.md` proponía tocar el **default** del
   componente a `my-12 md:my-12` (simétrico). Eso ya no es la decisión
   vigente: hoy la regla es **override por página, nunca el default**
   (confirmado en el contexto de este pedido), y el valor que
   efectivamente se usó al implementar esto en Institucional y
   Proyectos (PR 2/4, `946e747`) fue **`mt-4 mb-8 md:mt-6 md:mb-12`**
   (asimétrico), no `my-12 md:my-12`.

   Dato aparte, no una recomendación: en Institucional y Proyectos ese
   `CelestialLine` va *inmediatamente después del Hero* (arriba ya hay
   `pb-20` del Hero, abajo no hay nada — de ahí la asimetría). En
   Contacto, el `CelestialLine` de la línea 71 está en una posición
   distinta: entre el bloque de datos de contacto (que termina en
   `mb-2`, 8px) y la fila de íconos sociales (`gap-4`, sin padding
   propio arriba). No es el mismo contexto estructural que Institucional
   y Proyectos, así que ni la asimetría de PR 2/4 ni el `my-12 md:my-12`
   original aplican mecánicamente acá — es una decisión a tomar
   aparte, no algo que este relevamiento resuelva.

## 6. Instancias de `CelestialLine` en Contacto

**Una sola.** `Contacto.astro:71`, `<CelestialLine />` sin prop `class`
→ usa el default del componente (`my-16 md:my-24`). No hay override.
