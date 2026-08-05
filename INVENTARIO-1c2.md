# Inventario de strings hardcodeados — Fase 1c-2

> **Nota de contexto (04/08).** Este inventario se relevó el 03/08 sobre la
> estructura de archivos ANTERIOR a la unificación ES/EN de ese mismo día.
> Los paths que menciona (`src/pages/institucional.astro`,
> `src/pages/en/institucional.astro`, etc.) ya no existen: todo bajó a
> componentes compartidos en `src/components/pages/`. Los códigos de string
> (#N), los textos y la clasificación siguen siendo válidos; las
> **ubicaciones no**. Verificar contra el código actual antes de usar.
>
> Se rescata desde una branch local sin mergear para que no se pierda.

Alcance confirmado (Paso 0): Inicio, Institucional, Contacto y Proyectos (listado), en ES y EN.
Archivo (`archivo.astro`) queda fuera. El detalle de proyecto (`proyectos/[...slug].astro`) se
audita aparte, en el Anexo, por decisión explícita del pedido (auditoría de cobertura de la
colección `ui` creada en Fase 1c-1).

Archivos reales bajo `src/pages/` (confirmado por `ls`, no por notas viejas):

- ES: `index.astro`, `institucional.astro`, `contacto.astro`, `proyectos.astro`, `proyectos/[...slug].astro`, `archivo.astro`
- EN: `en/index.astro`, `en/institucional.astro`, `en/contacto.astro`, `en/proyectos.astro`, `en/proyectos/[...slug].astro`, `en/archivo.astro`

Dato importante: el par ES/EN de cada página (p. ej. `index.astro` y `en/index.astro`) es
**código idéntico** — ambos archivos contienen el mismo ternario `locale === 'en' ? … : …` y
resuelven el idioma en runtime vía `Astro.currentLocale`. Esto significa que cada fila de este
inventario se repite dos veces (una por archivo) con el mismo texto ES y el mismo texto EN en
ambas filas — no hay contenido distinto entre el archivo ES y el archivo EN de una misma página.

---

## 1. Componentes con set:html interno

Recorrido completo de `src/components/*.astro` (14 archivos) y `src/layouts/BaseLayout.astro`.
Único componente que aplica `set:html` (o equivalente) sobre una prop:

| Componente | Prop | Línea(s) | Detalle |
|---|---|---|---|
| `HeroSection.astro` | `title` | 86, 126, 147 | `<Fragment set:html={title} />` — una vez por cada variante (`split`, `centered`, `default`). Las 3 ramas usan la misma prop `title` sin sanitizar. |

No se encontró ningún otro `set:html`, `innerHTML` ni directiva equivalente en el resto de
componentes ni en `BaseLayout.astro` (verificado también con grep de `innerHTML|set:html|set:text`
sobre todo `src/`).

**Verificación cruzada con el hallazgo de ayer:** en las 3 llamadas a `<HeroSection>` dentro del
alcance de este inventario (Inicio, Institucional, Proyectos), la prop `title` siempre se arma como
`em(t(d?.hero_title)) ?? ''` — es decir, siempre pasa por `em()` antes de llegar al `set:html`
interno. Hoy no hay ningún literal hardcodeado con asteriscos sin pasar por `em()` en esas 3
llamadas. El riesgo que motivó este inventario sigue siendo válido como advertencia de proceso (un
grep en páginas no detecta esto), pero el código actual de las 4 páginas en alcance ya lo maneja
bien. (La 4ª llamada a `HeroSection`, en `archivo.astro`, queda fuera del alcance por pedido
explícito.)

Nota aparte: `proyectos/[...slug].astro` importa `HeroSection` pero **no lo usa** — la sección hero
de esa página está armada a mano con su propio `<section>`. Import muerto, no afecta el inventario.

---

## 2. Inventario

Columnas: **Render** = "directo" (interpolación normal `{...}`) o "set:html directo (en página)"
cuando la página misma aplica `set:html` sobre un ternario/CMS sin pasar por un componente (ninguna
fila de esta tabla pasa por el `set:html` interno de HeroSection — ver nota arriba).

| # | Archivo | Línea | Texto ES | Texto EN | Render | Duplicado | ¿Ya en CMS? | Clasificación | Fase 3 |
|---|---|---|---|---|---|---|---|---|---|
| 01 | src/pages/index.astro | 58 | Ver proyectos | View projects | directo | 26 | no | CHROME | — |
| 01 | src/pages/en/index.astro | 58 | Ver proyectos | View projects | directo | 26 | no | CHROME | — |
| 02 | src/pages/index.astro | 65 | Quiénes somos | About us | directo | — | no | EDITORIAL | — |
| 02 | src/pages/en/index.astro | 65 | Quiénes somos | About us | directo | — | no | EDITORIAL | — |
| 03 | src/pages/index.astro | 90 | tres caminos, un horizonte | three paths, one horizon | directo | — | no | EDITORIAL | — |
| 03 | src/pages/en/index.astro | 90 | tres caminos, un horizonte | three paths, one horizon | directo | — | no | EDITORIAL | — |
| 04 | src/pages/index.astro | 94 | Tres Pilares, Un Universo | Three Pillars, One Universe | set:html directo (en página) | — | sí — inicio.yaml:`pillars_title` | TECNICO | — |
| 04 | src/pages/en/index.astro | 94 | Tres Pilares, Un Universo | Three Pillars, One Universe | set:html directo (en página) | — | sí — inicio.yaml:`pillars_title` | TECNICO | — |
| 05 | src/pages/index.astro | 24 | Arte | Art | directo | — | sí — inicio.yaml:`pillar_arte_title` | TECNICO | — |
| 05 | src/pages/en/index.astro | 24 | Arte | Art | directo | — | sí — inicio.yaml:`pillar_arte_title` | TECNICO | — |
| 06 | src/pages/index.astro | 29 | Ciencia | Science | directo | — | sí — inicio.yaml:`pillar_ciencia_title` | TECNICO | — |
| 06 | src/pages/en/index.astro | 29 | Ciencia | Science | directo | — | sí — inicio.yaml:`pillar_ciencia_title` | TECNICO | — |
| 07 | src/pages/index.astro | 34 | Consciencia | Consciousness | directo | — | sí — inicio.yaml:`pillar_consciencia_title` | TECNICO | — |
| 07 | src/pages/en/index.astro | 34 | Consciencia | Consciousness | directo | — | sí — inicio.yaml:`pillar_consciencia_title` | TECNICO | — |
| 08 | src/pages/index.astro | 42 | Inicio | Home | directo (prop `title` de BaseLayout) | — | sí — inicio.yaml:`title` | TECNICO | — |
| 08 | src/pages/en/index.astro | 42 | Inicio | Home | directo (prop `title` de BaseLayout) | — | sí — inicio.yaml:`title` | TECNICO | — |
| 09 | src/pages/index.astro | 134 | destacado | featured | directo | — | no | EDITORIAL | — |
| 09 | src/pages/en/index.astro | 134 | destacado | featured | directo | — | no | EDITORIAL | — |
| 10 | src/pages/index.astro | 137 | Producción \<em\>Destacada\</em\> | Featured \<em\>Production\</em\> | **set:html directo (en página)** | — | no | EDITORIAL — ⚠ hardcodeado permanente, sin campo CMS que lo respalde | — |
| 10 | src/pages/en/index.astro | 137 | Producción \<em\>Destacada\</em\> | Featured \<em\>Production\</em\> | **set:html directo (en página)** | — | no | EDITORIAL — ⚠ hardcodeado permanente, sin campo CMS que lo respalde | — |
| 11 | src/pages/index.astro | 171 | Ver proyecto | View project | directo | — | no | EDITORIAL | — |
| 11 | src/pages/en/index.astro | 171 | Ver proyecto | View project | directo | — | no | EDITORIAL | — |
| 12 | src/pages/index.astro | 183 | archivo | archive | directo | — | no | EDITORIAL | — |
| 12 | src/pages/en/index.astro | 183 | archivo | archive | directo | — | no | EDITORIAL | — |
| 13 | src/pages/index.astro | 185 | Producciones | Productions | directo | 36 | no | CHROME — ⚠ mismo texto que #36 pero ahí sí está en CMS (inconsistencia) | — |
| 13 | src/pages/en/index.astro | 185 | Producciones | Productions | directo | 36 | no | CHROME — ⚠ mismo texto que #36 pero ahí sí está en CMS (inconsistencia) | — |
| 14 | src/pages/index.astro | 209 | en el horizonte | on the horizon | directo | — | no | EDITORIAL | — |
| 14 | src/pages/en/index.astro | 209 | en el horizonte | on the horizon | directo | — | no | EDITORIAL | — |
| 15 | src/pages/index.astro | 211 | En Desarrollo | In Development | directo | 37 | no | CHROME — ⚠ mismo texto que #37 pero ahí sí está en CMS (inconsistencia) | — |
| 15 | src/pages/en/index.astro | 211 | En Desarrollo | In Development | directo | 37 | no | CHROME — ⚠ mismo texto que #37 pero ahí sí está en CMS (inconsistencia) | — |
| 16 | src/pages/index.astro | 235 | visión | vision | directo | 22 | no | CHROME | — |
| 16 | src/pages/en/index.astro | 235 | visión | vision | directo | 22 | no | CHROME | — |
| 17 | src/pages/index.astro | 266 | bitácora | logbook | directo | — | no | EDITORIAL | — |
| 17 | src/pages/en/index.astro | 266 | bitácora | logbook | directo | — | no | EDITORIAL | — |
| 18 | src/pages/index.astro | 293 | estelar@navegante.com | stellar@navigator.com | directo (placeholder) | — | no (existe en i18n/*.json muerto: `home.newsletter_placeholder`) | TECNICO | — |
| 18 | src/pages/en/index.astro | 293 | estelar@navegante.com | stellar@navigator.com | directo (placeholder) | — | no (ídem) | TECNICO | — |
| 19 | src/pages/index.astro | 305 | embarcate | embark | directo | — | no | EDITORIAL | — |
| 19 | src/pages/en/index.astro | 305 | embarcate | embark | directo | — | no | EDITORIAL | — |
| 20 | src/pages/institucional.astro | 32 | misión | mission | directo | — | no | EDITORIAL | — |
| 20 | src/pages/en/institucional.astro | 32 | misión | mission | directo | — | no | EDITORIAL | — |
| 21 | src/pages/institucional.astro | 44 | evolución cultural | cultural evolution | directo | — | no | EDITORIAL | — |
| 21 | src/pages/en/institucional.astro | 44 | evolución cultural | cultural evolution | directo | — | no | EDITORIAL | — |
| 22 | src/pages/institucional.astro | 73 | visión | vision | directo | 16 | no | CHROME | — |
| 22 | src/pages/en/institucional.astro | 73 | visión | vision | directo | 16 | no | CHROME | — |
| 23 | src/pages/institucional.astro | 116 | equipo | team | directo | — | no | EDITORIAL | — |
| 23 | src/pages/en/institucional.astro | 116 | equipo | team | directo | — | no | EDITORIAL | — |
| 24 | src/pages/institucional.astro | 148 | embarcate | set sail | directo | — | no | EDITORIAL — ⚠ ES coincide con #19 pero EN difiere (ver Dudas) | — |
| 24 | src/pages/en/institucional.astro | 148 | embarcate | set sail | directo | — | no | EDITORIAL | — |
| 25 | src/pages/institucional.astro | 161 | Contactanos | Contact us | directo | — | no | EDITORIAL | — |
| 25 | src/pages/en/institucional.astro | 161 | Contactanos | Contact us | directo | — | no | EDITORIAL | — |
| 26 | src/pages/institucional.astro | 168 | Ver proyectos | View projects | directo | 01 | no | CHROME | — |
| 26 | src/pages/en/institucional.astro | 168 | Ver proyectos | View projects | directo | 01 | no | CHROME | — |
| 27 | src/pages/contacto.astro | 23 | escribínos | write to us | directo | — | no | EDITORIAL | — |
| 27 | src/pages/en/contacto.astro | 23 | escribínos | write to us | directo | — | no | EDITORIAL | — |
| 28 | src/pages/contacto.astro | 53 | ubicación | location | directo (fallback de `t(d?.location_label)`) | — | sí — contacto.yaml:`location_label` | TECNICO | — |
| 28 | src/pages/en/contacto.astro | 53 | ubicación | location | directo (fallback) | — | sí — contacto.yaml:`location_label` | TECNICO | — |
| 29 | src/pages/contacto.astro | 62 | tiempo de respuesta | response time | directo (fallback de `t(d?.response_label)`) | — | sí — contacto.yaml:`response_label` | TECNICO | — |
| 29 | src/pages/en/contacto.astro | 62 | tiempo de respuesta | response time | directo (fallback) | — | sí — contacto.yaml:`response_label` | TECNICO | — |
| 30 | src/pages/contacto.astro | 65 | 3 a 5 días hábiles | 3-5 business days | directo (fallback de `t(d?.response_time)`) | — | sí — contacto.yaml:`response_time` | TECNICO | — |
| 30 | src/pages/en/contacto.astro | 65 | 3 a 5 días hábiles | 3-5 business days | directo (fallback) | — | sí — contacto.yaml:`response_time` | TECNICO | — |
| 31 | src/pages/contacto.astro | 127 | Enviá tu mensaje | Send your message | directo (fallback de `t(d?.form_title)`) | — | sí — contacto.yaml:`form_title` | TECNICO | — |
| 31 | src/pages/en/contacto.astro | 127 | Enviá tu mensaje | Send your message | directo (fallback) | — | sí — contacto.yaml:`form_title` | TECNICO | — |
| 32 | src/pages/contacto.astro | 78 | Instagram | Instagram | directo (`aria-label`) | — | no | TECNICO | — |
| 32 | src/pages/en/contacto.astro | 78 | Instagram | Instagram | directo (`aria-label`) | — | no | TECNICO | — |
| 33 | src/pages/contacto.astro | 91 | Facebook | Facebook | directo (`aria-label`) | — | no | TECNICO | — |
| 33 | src/pages/en/contacto.astro | 91 | Facebook | Facebook | directo (`aria-label`) | — | no | TECNICO | — |
| 34 | src/pages/contacto.astro | 102 | YouTube | YouTube | directo (`aria-label`) | — | no | TECNICO | — |
| 34 | src/pages/en/contacto.astro | 102 | YouTube | YouTube | directo (`aria-label`) | — | no | TECNICO | — |
| 35 | src/pages/contacto.astro | 114 | Linktree | Linktree | directo (`aria-label`) | — | no | TECNICO | — |
| 35 | src/pages/en/contacto.astro | 114 | Linktree | Linktree | directo (`aria-label`) | — | no | TECNICO | — |
| 36 | src/pages/proyectos.astro | 37 | Producciones | Productions | set:html directo (en página) | 13 | sí — proyectos.yaml:`completed_title` (CMS trae `*Producciones*`/`*Productions*`, con asteriscos que `em()` sí procesa) | TECNICO | — |
| 36 | src/pages/en/proyectos.astro | 37 | Producciones | Productions | set:html directo (en página) | 13 | sí — proyectos.yaml:`completed_title` | TECNICO | — |
| 37 | src/pages/proyectos.astro | 62 | En Desarrollo | In Development | set:html directo (en página) | 15 | sí — proyectos.yaml:`in_dev_title` (CMS trae `En *Desarrollo*`/`In *Development*`) | TECNICO | — |
| 37 | src/pages/en/proyectos.astro | 62 | En Desarrollo | In Development | set:html directo (en página) | 15 | sí — proyectos.yaml:`in_dev_title` | TECNICO | — |

37 strings únicos × 2 archivos (ES/EN) = 74 filas.

---

## Anexo — Detalle de proyecto (auditoría de 1c-1)

Página `proyectos/[...slug].astro` / `en/proyectos/[...slug].astro`, más los componentes que
invoca (`EpisodeList.astro`, `PillarBadge.astro`) leídos directamente para no repetir el error de
HeroSection. Columna extra **Cubierto por ui**: indica si el string ya tiene campo equivalente en
`src/content/ui/textos.yaml` (14 campos, creados en Fase 1c-1).

| # | Archivo | Línea | Texto ES | Texto EN | Render | Duplicado | ¿Ya en CMS? | Clasificación | Fase 3 | Cubierto por ui |
|---|---|---|---|---|---|---|---|---|---|---|
| A01 | src/pages/proyectos/[...slug].astro | 90 | volver al archivo | back to archive | directo | — | sí — ui/textos.yaml | TECNICO | — | sí — `back_to_archive` |
| A01 | src/pages/en/proyectos/[...slug].astro | 90 | volver al archivo | back to archive | directo | — | sí | TECNICO | — | sí — `back_to_archive` |
| A02 | src/pages/proyectos/[...slug].astro | 101 | terminado / en desarrollo | completed / in progress | directo (badge de estado) | componente ProjectCard.astro (mismo texto, líneas 38-39) | no | TECNICO | **SI** — badge de estado | **no** — sin campo en ui.yaml |
| A02 | src/pages/en/proyectos/[...slug].astro | 101 | terminado / en desarrollo | completed / in progress | directo | ídem | no | TECNICO | **SI** | **no** |
| A03 | src/pages/proyectos/[...slug].astro | 173 | voces destacadas | featured voices | directo | — | sí — ui/textos.yaml | TECNICO | — | sí — `voices_eyebrow` |
| A03 | src/pages/en/proyectos/[...slug].astro | 173 | voces destacadas | featured voices | directo | — | sí | TECNICO | — | sí — `voices_eyebrow` |
| A04 | src/pages/proyectos/[...slug].astro | 175 | Voces Destacadas | Featured Voices | directo | — | sí | TECNICO | — | sí — `voices_title` |
| A04 | src/pages/en/proyectos/[...slug].astro | 175 | Voces Destacadas | Featured Voices | directo | — | sí | TECNICO | — | sí — `voices_title` |
| A05 | src/pages/proyectos/[...slug].astro | 190 | fases del programa | program phases | directo | — | sí | TECNICO | — | sí — `phases_eyebrow` |
| A05 | src/pages/en/proyectos/[...slug].astro | 190 | fases del programa | program phases | directo | — | sí | TECNICO | — | sí — `phases_eyebrow` |
| A06 | src/pages/proyectos/[...slug].astro | 192 | Fases del Programa | Program Phases | directo | — | sí | TECNICO | — | sí — `phases_title` |
| A06 | src/pages/en/proyectos/[...slug].astro | 192 | Fases del Programa | Program Phases | directo | — | sí | TECNICO | — | sí — `phases_title` |
| A07 | src/pages/proyectos/[...slug].astro | 225 | Adelanto de la serie | Series trailer | prop → EpisodeList | — | sí | TECNICO | — | sí — `trailer_title` |
| A07 | src/pages/en/proyectos/[...slug].astro | 225 | Adelanto de la serie | Series trailer | prop → EpisodeList | — | sí | TECNICO | — | sí — `trailer_title` |
| A08 | src/pages/proyectos/[...slug].astro | 226 | adelanto | trailer | prop → EpisodeList | — | sí | TECNICO | — | sí — `trailer_label` |
| A08 | src/pages/en/proyectos/[...slug].astro | 226 | adelanto | trailer | prop → EpisodeList | — | sí | TECNICO | — | sí — `trailer_label` |
| A09 | src/pages/proyectos/[...slug].astro | 229 | Episodios | Episodes | prop → EpisodeList | — | sí | TECNICO | — | sí — `episodes_title` |
| A09 | src/pages/en/proyectos/[...slug].astro | 229 | Episodios | Episodes | prop → EpisodeList | — | sí | TECNICO | — | sí — `episodes_title` |
| A10 | src/pages/proyectos/[...slug].astro | 230 | VIDEOS | VIDEOS | prop → EpisodeList | — | sí | TECNICO | — | sí — `episodes_count_label` |
| A10 | src/pages/en/proyectos/[...slug].astro | 230 | VIDEOS | VIDEOS | prop → EpisodeList | — | sí | TECNICO | — | sí — `episodes_count_label` |
| A11 | src/pages/proyectos/[...slug].astro | 240 | continuar la travesía | continue the voyage | directo | — | sí | TECNICO | — | sí — `project_cta_eyebrow` |
| A11 | src/pages/en/proyectos/[...slug].astro | 240 | continuar la travesía | continue the voyage | directo | — | sí | TECNICO | — | sí — `project_cta_eyebrow` |
| A12 | src/pages/proyectos/[...slug].astro | 243 | Explorá la Serie | Explore the Series | directo | — | sí | TECNICO | — | sí — `project_cta_title` |
| A12 | src/pages/en/proyectos/[...slug].astro | 243 | Explorá la Serie | Explore the Series | directo | — | sí | TECNICO | — | sí — `project_cta_title` |
| A13 | src/pages/proyectos/[...slug].astro | 246 | Contenidos holísticos y sensitivos en armonía con el planeta. | Holistic and sensitive content in harmony with the planet. | directo | — | sí | TECNICO | — | sí — `project_cta_text` |
| A13 | src/pages/en/proyectos/[...slug].astro | 246 | Contenidos holísticos y sensitivos en armonía con el planeta. | Holistic and sensitive content in harmony with the planet. | directo | — | sí | TECNICO | — | sí — `project_cta_text` |
| A14 | src/pages/proyectos/[...slug].astro | 273 | mismas aguas | same waters | directo | — | sí | TECNICO | **SI** — sección Producciones Relacionadas | sí — `related_eyebrow` |
| A14 | src/pages/en/proyectos/[...slug].astro | 273 | mismas aguas | same waters | directo | — | sí | TECNICO | **SI** | sí — `related_eyebrow` |
| A15 | src/pages/proyectos/[...slug].astro | 276 | Producciones Relacionadas | Related Productions | directo | — | sí | TECNICO | **SI** — sección Producciones Relacionadas | sí — `related_title` |
| A15 | src/pages/en/proyectos/[...slug].astro | 276 | Producciones Relacionadas | Related Productions | directo | — | sí | TECNICO | **SI** | sí — `related_title` |
| A16 | src/components/EpisodeList.astro | 104 | episodios | episodes | directo (separador entre trailer y lista) | — | no | TECNICO | — | **no** — sin prop, 100% interno |
| A17 | src/components/EpisodeList.astro | 146 | reproduciendo | now playing | directo (chip sobre episodio activo) | — | no | TECNICO | — | **no** |
| A18 | src/components/EpisodeList.astro | 167 | episodio | episode | directo (prefijo antes del número) | — | no | TECNICO | — | **no** |
| A19 | src/components/PillarBadge.astro | 16-18 | Arte / Ciencia / Consciencia | Art / Science / Consciousness | directo (etiqueta dentro del badge) | usado también en ProjectCard.astro y en el listado de Proyectos Relacionados de esta misma página | no | TECNICO | **SI** — etiqueta de pilar | **no** — hardcodeado en el componente, no es prop |

19 strings únicos: A01–A15 (15, × 2 archivos = 30 filas) + A16–A19 (4, un solo archivo componente
cada uno = 4 filas). Total 34 filas.

---

## Resumen

**Inventario principal** (Inicio, Institucional, Contacto, Proyectos-listado — ES+EN):

- Strings únicos: **37**
- Filas totales (ES + EN): 74
- EDITORIAL: 15
- CHROME: 6
- TECNICO: 16
- Marcados Fase 3 = SI: 0
- Pasan por `set:html` (directo en página, ninguno vía HeroSection): 4 (#04, #10, #36, #37)

**Anexo — Detalle de proyecto** (contado aparte, no se suma al principal):

- Strings únicos: **19**
- Filas totales: 34
- Cubiertos por `ui/textos.yaml`: 14
- NO cubiertos por `ui/textos.yaml`: 5 (A02, A16, A17, A18, A19)
- Marcados Fase 3 = SI: 4 (A02 badge de estado, A14 y A15 Producciones Relacionadas, A19 etiqueta de pilar)

---

## Dudas

1. **Header.astro y Footer.astro quedan fuera del alcance literal, pero renderizan en las 4
   páginas del inventario.** Paso 2 pedía recorrer "los archivos del alcance" (las páginas), y
   ninguno de los dos es una página — son componentes de layout invocados desde `BaseLayout.astro`.
   Sin embargo, ambos tienen bastante texto bilingüe hardcodeado que se repite en absolutamente
   todas las páginas del sitio: nav links (Inicio/Home, Institucional/About, Proyectos/Projects,
   Contacto/Contact, Archivo/Archive), tagline de marca ("desde un puerto del sur"/"from a southern
   port", "Tejemos arte, ciencia y consciencia..."), headers de columna ("navegar"/"navigate",
   "conectar"/"connect", "legal"/"legal"), links legales (Política de Privacidad/Privacy Policy,
   Términos de Servicio/Terms of Service — ambos con `href="#"`, sin página real todavía), CTA
   "A bordo"/"Get on board", y la frase de cierre "navegamos sin apuro"/"navigating without haste".
   No los incluí en la tabla principal porque no son "páginas", pero si Fase 1c-2 va a tocar CHROME,
   probablemente valga la pena un inventario aparte de estos dos componentes antes de extraer nada,
   porque afectan a todo el sitio, no sólo a las 4 páginas de este documento.

2. **`src/i18n/es.json` y `en.json` no están conectados a nada.** Verifiqué con grep que ningún
   archivo bajo `src/` los importa. Tienen claves que se solapan parcialmente con contenido real
   (`home.pillars_title`, `contact.form_success`, etc.) pero con textos ligeramente distintos a los
   que hoy están en producción (p. ej. `vision_quote` en el JSON dice "a través del lente de la
   ciencia y el alma" mientras que `inicio.yaml` dice sólo "Somos expresiones del universo
   experimentándose a sí mismo", sin esa segunda cláusula). Parecen resto de una implementación
   i18n anterior a la migración a Keystatic. No los tomé como fuente de "¿ya en CMS?" salvo mención
   puntual, porque no reflejan lo que el sitio muestra hoy. Recomendaría confirmar si se pueden
   borrar directamente en una tarea aparte (no toqué nada, es sólo una observación).

3. **`#02` "Quiénes somos"/"About us" y `#25` "Contactanos"/"Contact us"**: cada uno aparece una
   sola vez en el alcance (Inicio y Institucional respectivamente) pero cumplen el mismo rol de CTA
   secundario que sí se duplica (#01/#26 "Ver proyectos"). Los dejé como EDITORIAL en vez de CHROME
   porque textualmente no se repiten, pero funcionalmente son parte del mismo patrón de "botones de
   cierre de sección". Lo señalo por si la directora prefiere tratarlos como un mismo bloque CHROME
   de "CTAs de navegación cruzada" en vez de EDITORIAL individual.

4. **`#19` "embarcate"/"embark" vs `#24` "embarcate"/"set sail"**: el texto en español es idéntico
   en ambas (Inicio y Institucional), pero el inglés difiere ("embark" vs "set sail"). No sé si es
   intencional (variación estilística) o un descuido de traducción. Lo dejé como dos strings
   distintos (no marqué Duplicado) porque el par ES/EN completo no es idéntico, pero quería
   señalarlo explícitamente.

5. **`#13`/`#36` ("Producciones"/"Productions") y `#15`/`#37` ("En Desarrollo"/"In Development")**:
   son el mismo texto visible en dos páginas (Inicio y Proyectos), pero con dos mecanismos de render
   distintos — en Inicio están hardcodeados sin respaldo de CMS, en Proyectos ya viven en
   `proyectos.yaml` (`completed_title`, `in_dev_title`) vía `set:html` + `em()`. Es una inconsistencia
   real: si alguien edita el título en Keystatic hoy, cambia en Proyectos pero no en Inicio. Vale la
   pena decidir en la extracción si Inicio debería leer del mismo campo de `proyectos.yaml` o si
   necesita el suyo propio en `inicio.yaml`.

6. **Pillar section titles en Inicio (`#05`, `#06`, `#07`: Arte/Ciencia/Consciencia)** vs. la
   etiqueta de pilar de `PillarBadge.astro` (Anexo A19, mismas 3 palabras)**: son visualmente el
   mismo texto pero cumplen roles distintos — en Inicio son títulos de sección (parte de la
   identidad estructural del sitio, "los 3 pilares de Nautas"), en PillarBadge son una etiqueta/tag
   corta aplicada a cada proyecto. Marqué Fase 3 = SI sólo en A19 (la etiqueta-tag), no en
   `#05`-`#07` (los títulos de sección), porque entiendo que el rediseño apunta a los badges de
   proyecto, no a la estructura de "3 pilares" de la home. Pero es una lectura mía — si el rediseño
   también toca la sección de pilares de Inicio, `#05`-`#07` también deberían marcarse SI.

7. **Aria-labels de redes sociales en `contacto.astro`** (`#32`-`#35`: Instagram/Facebook/
   YouTube/Linktree) son idénticos en ES y EN (nombres de marca) y se repiten también en
   `Footer.astro` (fuera de alcance, ver punto 1) y en los `socialLinks` de ese mismo componente.
   Los incluí porque el Paso 2 pide explícitamente registrar `aria-label`, aunque no varíen por
   idioma.

8. **`A02` (badge de estado "terminado"/"en desarrollo") no tiene ningún campo en `ui/textos.yaml`
   ni en ningún otro YAML** — vive hardcodeado tanto en `proyectos/[...slug].astro` como en
   `ProjectCard.astro` (usado en Inicio y en el listado de Proyectos). Como está marcado Fase 3 =
   SI por pedido explícito, probablemente no haya que extraerlo — pero lo marco como el hallazgo
   más "accionable" de la auditoría 1c-1, ya que confirma que faltó cubrir el badge de estado en esa
   fase, y no fue un descuido menor sino un string que ni siquiera vive en un solo lugar (está
   duplicado en 2 componentes distintos con la misma redacción exacta).
