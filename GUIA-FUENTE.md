# Fuente de verdad del panel de Keystatic

Insumo de trabajo para reescribir la guía de editoras. Todo el contenido
sale de `keystatic.config.mjs`, `src/content.config.ts` y `src/content/`
tal como están en `main` a la fecha de este documento. No se usó ninguna
acta ni la guía vieja como fuente. Documento de solo lectura: no cambia
nada del sitio.

---

## 1. Estructura del panel

Orden verificado a mano en el panel local (`/keystatic`), no inferido del
código: en la barra lateral, **Colecciones aparece antes que
Singletons**, aunque en `keystatic.config.mjs` el bloque `singletons` está
escrito primero en el archivo.

### Colecciones (COLLECTIONS)

| Orden | Label en el panel | Clave interna | Ruta de contenido |
|---|---|---|---|
| 1 | Producciones | `projects` | `src/content/projects/*` |
| 2 | Equipo | `team` | `src/content/team/*` |

### Singletons (SINGLETONS)

| Orden | Label en el panel | Clave interna | Archivo |
|---|---|---|---|
| 1 | Página: Inicio | `inicio` | `src/content/pages/inicio.yaml` |
| 2 | Página: Institucional | `institucional` | `src/content/pages/institucional.yaml` |
| 3 | Página: Producciones | `proyectos` | `src/content/pages/proyectos.yaml` |
| 4 | Página: Archivo | `archivo` | `src/content/pages/archivo.yaml` |
| 5 | Página: Contacto | `contacto` | `src/content/pages/contacto.yaml` |
| 6 | Textos de interfaz | `ui` | `src/content/ui/textos.yaml` |

Nota estructural: la clave interna del singleton de Producciones sigue
siendo `proyectos` (y su archivo `pages/proyectos.yaml`), aunque el
`label` que ve la editora ya dice "Página: Producciones". Es deliberado
— cambiar la clave o el archivo movería contenido y rompería la lectura
que hace el código (`getEntry('pages', 'proyectos')` en
`Proyectos.astro:12`).

Nota sobre `content.config.ts`: el schema Zod de `pages` (usado por las 5
páginas) declara un superset compartido de ~50 campos posibles
(`hero_eyebrow`, `pillars_title`, `mission_p1`, `contact_eyebrow`, etc.),
todos opcionales salvo `title`/`description`. Cada singleton de
`keystatic.config.mjs` solo expone en el panel el subconjunto que esa
página realmente usa (ver sección 2). Un campo que no aparece en el panel
de una página tampoco tiene forma de cargarse — no es un campo "oculto",
directamente no hay UI para él ahí.

Campo reservado sin UI: `content.config.ts` declara `hero_image`
(bilingüe, opcional) en el schema de `pages`, pero `keystatic.config.mjs`
no lo registra en ningún singleton a propósito (comentario en el propio
archivo, líneas 13-17): no lo consume ningún `.astro` todavía. Slot
reservado para Fase 3, sin efecto hoy.

---

## 2. Campo por campo

Convenciones de esta sección:
- **Tipo de campo**: tomado literalmente de la función `fields.*` usada.
- **Bilingüe**: Sí = el campo es un `fields.object({ es, en })` con dos
  cajas (Español/Inglés). No = campo único.
- **Requerido**: `validation: { isRequired: true }` en Keystatic. Para
  campos bilingües, se indica si ES y EN son requeridos por separado
  cuando difieren (no difieren en ningún campo de este proyecto: siempre
  van los dos o ninguno).

### 2.1 Página: Inicio (`inicio`)

| # | Campo (clave) | Label | Description | Tipo | Bilingüe | Requerido |
|---|---|---|---|---|---|---|
| 1 | `hero_eyebrow` | Portada — Etiqueta superior | — | Texto | Sí | No |
| 2 | `hero_title` | Portada — Título principal | Para poner una parte en itálica, encerrala entre asteriscos: *así*. Solo funciona en los campos que tienen esta indicación. | Texto | Sí | No |
| 3 | `hero_subtitle` | Portada — Texto de presentación | Para poner una parte en itálica, encerrala entre asteriscos: *así*. Solo funciona en los campos que tienen esta indicación. En la página se muestra solo el primer párrafo: el resto aparece al tocar "leer más". Escribí el primer párrafo de modo que se entienda solo. | Texto largo | Sí | No |
| 4 | `hero_cta_primary` | Portada — Botón principal | — | Texto | Sí | Sí |
| 5 | `hero_cta_secondary` | Portada — Botón secundario | — | Texto | Sí | Sí |
| 6 | `pillars_eyebrow` | Pilares — Etiqueta superior | — | Texto | Sí | Sí |
| 7 | `pillars_title` | Pilares — Título de sección | Para poner una parte en itálica, encerrala entre asteriscos: *así*. Solo funciona en los campos que tienen esta indicación. | Texto | Sí | No |
| 8 | `pillar_arte_title` | Pilares — Arte: título | — | Texto | Sí | No |
| 9 | `pillar_arte_desc` | Pilares — Arte: descripción | Para poner una parte en itálica, encerrala entre asteriscos: *así*. Solo funciona en los campos que tienen esta indicación. En la página se muestra solo el primer párrafo: el resto aparece al tocar "leer más". Escribí el primer párrafo de modo que se entienda solo. | Texto largo | Sí | No |
| 10 | `pillar_ciencia_title` | Pilares — Ciencia: título | — | Texto | Sí | No |
| 11 | `pillar_ciencia_desc` | Pilares — Ciencia: descripción | (mismo texto que `pillar_arte_desc`) | Texto largo | Sí | No |
| 12 | `pillar_consciencia_title` | Pilares — Consciencia: título | — | Texto | Sí | No |
| 13 | `pillar_consciencia_desc` | Pilares — Consciencia: descripción | (mismo texto que `pillar_arte_desc`) | Texto largo | Sí | No |
| 14 | `featured_eyebrow` | Producción Destacada — Etiqueta superior | — | Texto | Sí | Sí |
| 15 | `featured_title` | Producción Destacada — Título | Para poner una parte en itálica, encerrala entre asteriscos: *así*. Solo funciona en los campos que tienen esta indicación. | Texto | Sí | Sí |
| 16 | `featured_cta` | Producción Destacada — Texto del link | — | Texto | Sí | Sí |
| 17 | `vision_eyebrow` | Visión — Etiqueta superior | — | Texto | Sí | Sí |
| 18 | `vision_quote` | Cita de visión | — | Texto largo | Sí | No |
| 19 | `newsletter_eyebrow` | Newsletter — Etiqueta superior | — | Texto | Sí | Sí |
| 20 | `newsletter_title` | Newsletter — Título | — | Texto | Sí | No |
| 21 | `newsletter_subtitle` | Newsletter — Subtítulo | — | Texto largo | Sí | No |
| 22 | `newsletter_placeholder` | Newsletter — Ejemplo dentro del campo de email | — | Texto | Sí | Sí |
| 23 | `newsletter_cta` | Newsletter — Texto del botón | — | Texto | Sí | Sí |
| 24 | `title` | SEO — Título para buscadores | No se ve en la página. Aparece en Google y al compartir el link. | Texto | Sí | Sí |
| 25 | `description` | SEO — Descripción para buscadores | No se ve en la página. Aparece en Google y al compartir el link. | Texto largo | Sí | Sí |

### 2.2 Página: Institucional (`institucional`)

| # | Campo (clave) | Label | Description | Tipo | Bilingüe | Requerido |
|---|---|---|---|---|---|---|
| 1 | `hero_title` | Portada — Título principal | Para poner una parte en itálica, encerrala entre asteriscos: *así*. Solo funciona en los campos que tienen esta indicación. | Texto | Sí | No |
| 2 | `hero_subtitle` | Portada — Texto de presentación | Para poner una parte en itálica, encerrala entre asteriscos: *así*. Solo funciona en los campos que tienen esta indicación. | Texto largo | Sí | No |
| 3 | `mission_eyebrow` | Misión — etiqueta sobre el título | Texto chico en minúscula que aparece arriba del título de la sección, precedido por //. El título en sí es el campo de abajo. | Texto | Sí | No |
| 4 | `mission_title` | Misión — Título | Para poner una parte en itálica, encerrala entre asteriscos: *así*. Solo funciona en los campos que tienen esta indicación. | Texto | Sí | No |
| 5 | `mission_p1` | Misión — Párrafo 1 | Se muestran en orden, uno debajo del otro. | Texto largo | Sí | No |
| 6 | `mission_p2` | Misión — Párrafo 2 | Se muestran en orden, uno debajo del otro. | Texto largo | Sí | No |
| 7 | `mission_p3` | Misión — Párrafo 3 | Se muestran en orden, uno debajo del otro. | Texto largo | Sí | No |
| 8 | `mission_p4` | Misión — Párrafo 4 | Se muestran en orden, uno debajo del otro. | Texto largo | Sí | No |
| 9 | `mission_p5` | Misión — Párrafo 5 | Se muestran en orden, uno debajo del otro. | Texto largo | Sí | No |
| 10 | `mission_cta` | Misión — Frase de cierre | — | Texto | Sí | No |
| 11 | `vision_eyebrow` | Visión — etiqueta sobre el título | Ídem, para la sección Visión. | Texto | Sí | No |
| 12 | `vision_title` | Visión — Título | Para poner una parte en itálica, encerrala entre asteriscos: *así*. Solo funciona en los campos que tienen esta indicación. | Texto | Sí | No |
| 13 | `vision_p1` | Visión — Párrafo 1 | Se muestran en orden, uno debajo del otro. | Texto largo | Sí | No |
| 14 | `vision_p2` | Visión — Párrafo 2 | Se muestran en orden, uno debajo del otro. | Texto largo | Sí | No |
| 15 | `vision_p3` | Visión — Párrafo 3 | Se muestran en orden, uno debajo del otro. | Texto largo | Sí | No |
| 16 | `vision_blockquote` | Visión — Cita destacada | — | Texto largo | Sí | No |
| 17 | `vision_p4` | Visión — Párrafo 4 | Se muestran en orden, uno debajo del otro. | Texto largo | Sí | No |
| 18 | `vision_p5` | Visión — Párrafo 5 | Se muestran en orden, uno debajo del otro. | Texto largo | Sí | No |
| 19 | `team_eyebrow` | Equipo — etiqueta sobre el título | Ídem, para la sección Equipo. | Texto | Sí | No |
| 20 | `team_title` | Equipo — Título | Para poner una parte en itálica, encerrala entre asteriscos: *así*. Solo funciona en los campos que tienen esta indicación. | Texto | Sí | No |
| 21 | `team_subtitle` | Equipo — Subtítulo | — | Texto | Sí | No |
| 22 | `cta_eyebrow` | Cierre — etiqueta sobre el título | Ídem, para la sección de cierre de la página. | Texto | Sí | No |
| 23 | `cta_title` | Llamado final — Título | Para poner una parte en itálica, encerrala entre asteriscos: *así*. Solo funciona en los campos que tienen esta indicación. | Texto | Sí | No |
| 24 | `cta_subtitle` | Llamado final — Subtítulo | — | Texto | Sí | No |
| 25 | `cta_button_contact` | Cierre — texto del botón principal | El botón sólido que lleva a la página de Contacto. | Texto | Sí | No |
| 26 | `cta_button_projects` | Cierre — texto del botón secundario | El botón con borde que lleva a la página de Producciones. | Texto | Sí | No |
| 27 | `title` | SEO — Título para buscadores | No se ve en la página. Aparece en Google y al compartir el link. | Texto | Sí | Sí |
| 28 | `description` | SEO — Descripción para buscadores | No se ve en la página. Aparece en Google y al compartir el link. | Texto largo | Sí | Sí |

### 2.3 Página: Producciones (`proyectos`)

| # | Campo (clave) | Label | Description | Tipo | Bilingüe | Requerido |
|---|---|---|---|---|---|---|
| 1 | `hero_eyebrow` | Portada — Etiqueta superior | — | Texto | Sí | No |
| 2 | `hero_title` | Portada — Título principal | Para poner una parte en itálica, encerrala entre asteriscos: *así*. Solo funciona en los campos que tienen esta indicación. | Texto | Sí | No |
| 3 | `hero_subtitle` | Portada — Texto de presentación | Para poner una parte en itálica, encerrala entre asteriscos: *así*. Solo funciona en los campos que tienen esta indicación. | Texto largo | Sí | No |
| 4 | `title` | SEO — Título para buscadores | No se ve en la página. Aparece en Google y al compartir el link. | Texto | Sí | Sí |
| 5 | `description` | SEO — Descripción para buscadores | No se ve en la página. Aparece en Google y al compartir el link. | Texto largo | Sí | Sí |

### 2.4 Página: Archivo (`archivo`)

| # | Campo (clave) | Label | Description | Tipo | Bilingüe | Requerido |
|---|---|---|---|---|---|---|
| 1 | `hero_title` | Portada — Título principal | Para poner una parte en itálica, encerrala entre asteriscos: *así*. Solo funciona en los campos que tienen esta indicación. | Texto | Sí | No |
| 2 | `hero_subtitle` | Portada — Texto de presentación | Para poner una parte en itálica, encerrala entre asteriscos: *así*. Solo funciona en los campos que tienen esta indicación. | Texto largo | Sí | No |
| 3 | `title` | SEO — Título para buscadores | No se ve en la página. Aparece en Google y al compartir el link. | Texto | Sí | Sí |
| 4 | `description` | SEO — Descripción para buscadores | No se ve en la página. Aparece en Google y al compartir el link. | Texto largo | Sí | Sí |

### 2.5 Página: Contacto (`contacto`)

| # | Campo (clave) | Label | Description | Tipo | Bilingüe | Requerido |
|---|---|---|---|---|---|---|
| 1 | `contact_eyebrow` | Encabezado — etiqueta sobre el título | Texto chico en minúscula arriba del título de la página, precedido por //. OJO: es distinto del título principal, que también dice 'Escribinos.' — este es la línea chica de arriba. | Texto | Sí | No |
| 2 | `hero_title` | Portada — Título principal | Para poner una parte en itálica, encerrala entre asteriscos: *así*. Solo funciona en los campos que tienen esta indicación. | Texto | Sí | No |
| 3 | `contact_tagline` | Portada — Texto de presentación | — | Texto | Sí | No |
| 4 | `email_label` | Datos — Etiqueta del campo de email | — | Texto | Sí | No |
| 5 | `email` | Datos — Dirección de email | — | Texto | Sí | No |
| 6 | `youtube_label` | Datos — Etiqueta del campo de YouTube | — | Texto | Sí | No |
| 7 | `youtube_url` | Datos — Link de YouTube | — | Texto | Sí | No |
| 8 | `youtube_display` | Datos — Texto visible del link de YouTube | — | Texto | Sí | No |
| 9 | `location_label` | Datos — Etiqueta del campo de ubicación | — | Texto | Sí | No |
| 10 | `location` | Datos — Ubicación | — | Texto | Sí | No |
| 11 | `response_label` | Datos — Etiqueta del tiempo de respuesta | — | Texto | Sí | No |
| 12 | `response_time` | Datos — Tiempo de respuesta | — | Texto | Sí | No |
| 13 | `form_title` | Formulario — Título | — | Texto | Sí | No |
| 14 | `title` | SEO — Título para buscadores | No se ve en la página. Aparece en Google y al compartir el link. | Texto | Sí | Sí |
| 15 | `description` | SEO — Descripción para buscadores | No se ve en la página. Aparece en Google y al compartir el link. | Texto largo | Sí | Sí |

### 2.6 Textos de interfaz (`ui`)

Comentario de origen en el propio `keystatic.config.mjs` (líneas 403-406,
antes de la declaración del singleton): *"Textos que aparecen en TODAS
las páginas de proyecto. Un cambio acá afecta a todos los proyectos."*
— hoy desactualizado a medias: los primeros 5 campos (`nav_*`) no son de
la página de proyecto, son del menú de todo el sitio.

| # | Campo (clave) | Label | Description | Tipo | Bilingüe | Requerido |
|---|---|---|---|---|---|---|
| 1 | `nav_inicio` | Navegación — Inicio | Aparece en el menú de arriba y en el pie de página, en todas las páginas del sitio. | Texto | Sí | Sí |
| 2 | `nav_institucional` | Navegación — Institucional | Aparece en el menú de arriba y en el pie de página, en todas las páginas del sitio. | Texto | Sí | Sí |
| 3 | `nav_producciones` | Navegación — Producciones | Aparece en el menú de arriba y en el pie de página, en todas las páginas del sitio. | Texto | Sí | Sí |
| 4 | `nav_contacto` | Navegación — Contacto | Aparece en el menú de arriba, en todas las páginas del sitio. No aparece en el pie de página (decisión intencional: el pie no repite el link de Contacto). | Texto | Sí | Sí |
| 5 | `nav_archivo` | Navegación — Archivo | Aparece en el menú de arriba y en el pie de página, en todas las páginas del sitio. | Texto | Sí | Sí |
| 6 | `back_to_archive` | Detalle — Link de vuelta al archivo | — | Texto | Sí | No |
| 7 | `voices_eyebrow` | Detalle — Voces: etiqueta superior | — | Texto | Sí | No |
| 8 | `voices_title` | Detalle — Voces: título | — | Texto | Sí | No |
| 9 | `phases_eyebrow` | Detalle — Fases: etiqueta superior | — | Texto | Sí | No |
| 10 | `phases_title` | Detalle — Fases: título | — | Texto | Sí | No |
| 11 | `trailer_title` | Detalle — Trailer: título | — | Texto | Sí | No |
| 12 | `trailer_label` | Detalle — Trailer: etiqueta | — | Texto | Sí | No |
| 13 | `episodes_title` | Detalle — Episodios: título | — | Texto | Sí | No |
| 14 | `episodes_count_label` | Detalle — Episodios: palabra del contador | — | Texto | Sí | No |
| 15 | `project_cta_eyebrow` | Detalle — Caja lateral: etiqueta superior | — | Texto | Sí | No |
| 16 | `project_cta_title` | Detalle — Caja lateral: título | — | Texto | Sí | No |
| 17 | `project_cta_text` | Detalle — Caja lateral: texto | — | Texto largo | Sí | No |
| 18 | `related_eyebrow` | Relacionados — Etiqueta superior | — | Texto | Sí | No |
| 19 | `related_title` | Relacionados — Título | — | Texto | Sí | No |
| 20 | `read_more` | Leer más — Etiqueta para expandir | — | Texto | Sí | No |
| 21 | `read_less` | Leer más — Etiqueta para colapsar | — | Texto | Sí | No |
| 22 | `episodes_separator` | Episodios — separador debajo del adelanto | Aparece entre el adelanto y la lista de episodios, sólo en producciones que tienen adelanto. Se muestra en minúscula y precedido por //. | Texto | Sí | No |
| 23 | `episode_item_label` | Episodios — etiqueta de cada ítem | La palabra que acompaña al número en cada episodio de la lista: '// episodio 01'. En singular. | Texto | Sí | No |
| 24 | `now_playing_label` | Episodios — indicador del que se está viendo | Etiqueta sobre la miniatura del episodio que se está reproduciendo. | Texto | Sí | No |

### 2.7 Colección: Producciones (`projects`)

| # | Campo (clave) | Label | Description | Tipo | Bilingüe | Requerido |
|---|---|---|---|---|---|---|
| 1 | `title` | Título | Este texto genera la dirección (URL) de la producción. Evitá cambiarlo en una producción ya publicada: rompe los links que ya existen. | Slug (genera URL) | No | Sí (es el slug) |
| 2 | `order` | Orden | Número más alto = aparece primero en la grilla. Se recomienda numerar de 10 en 10 (10, 20, 30...) para poder insertar una producción en el medio más adelante sin tener que renumerar todo. Una producción nueva nace en 100, arriba de todas, hasta que la reacomodes. Si dos producciones quedan con el mismo número, se ordenan alfabéticamente por título entre ellas. | Número entero (default 100) | No | Sí |
| 3 | `kind` | Tipo | Categoría de la producción que se muestra en la tarjeta. No es una lista cerrada: hoy incluye, entre otras, Serie Documental, Podcast, Programa Educativo, Programa de Salud y Programa de Educación Ambiental. Podés escribir un valor nuevo si ninguno de los existentes encaja, pero antes de eso conviene revisar las producciones ya cargadas y reusar el mismo texto: "Documental" y "documental" son dos categorías distintas para el sitio, no una sola con mayúscula distinta. | Texto libre | No | Sí |
| 4 | `pillar` | Pilar | — | Selector (Arte / Ciencia / Consciencia), default Arte | No | No |
| 5 | `status` | Estado | — | Selector (Completado / En desarrollo), default En desarrollo | No | No |
| 6 | `featured` | Destacado | Si está tildado, la producción aparece en la sección "Producción Destacada" del inicio, sin importar su estado (completado o en desarrollo). Si hay varios tildados, se muestra el que tenga el número de Orden más alto. | Casilla (sí/no), default No | No | No |
| 7 | `year` | Año | Ej: 2024, o un rango: 2023–2024. | Texto | No | No |
| 8 | `tagline` | Frase / Lema | Frase corta que resume la producción. Aparece debajo del título. | Texto | Sí | Sí |
| 9 | `description` | Descripción | Para poner una parte en itálica, encerrala entre asteriscos: *así*. Solo funciona en los campos que tienen esta indicación. | Texto largo | Sí | Sí |
| 10 | `heroImage` | Imagen de portada | 16:9 · mínimo 1280×720 px (ideal 1920×1080) · sujeto centrado, se recorta a cuadrado en algunas vistas · JPG, menos de 500 KB | Imagen | No | No |
| 11 | `heroAlt` | Texto alternativo de la portada | Descripción corta de lo que se ve en la imagen. La leen los lectores de pantalla (personas no videntes) y aparece si la imagen no carga. Ej: "Mujer mayor caminando por un bosque de niebla". | Texto | No | No |
| 12 | `playlistId` | ID de playlist YouTube | Se obtiene de la URL de la playlist en YouTube: es la parte que aparece después de "list=". Ejemplo: en youtube.com/playlist?list=PLabc123, el ID es PLabc123. | Texto | No | No |
| 13 | `featuredVideoId` | ID de video destacado (trailer) | ID del video del trailer o adelanto. Se obtiene de la URL del video en YouTube: la parte después de "v=" (o después de "youtu.be/"). Ejemplo: en youtube.com/watch?v=abc123, el ID es abc123. Dejar vacío si la producción no tiene trailer. | Texto | No | No |
| 14 | `episodes` | Episodios | (item label: título en español del episodio, o "Episodio" si está vacío) | Lista repetible | — | No |
| 15 | `phases` | Fases | (item label: la letra de la fase, o "Fase" si está vacía) | Lista repetible | — | No |
| 16 | `featureCards` | Tarjetas destacadas | (item label: título en español de la tarjeta, o "Card" si está vacío) | Lista repetible | — | No |
| 17 | `voices` | Voces | Nombres de los protagonistas o entrevistados de la producción. Aparecen como etiquetas en la página de la producción. Sumá uno por cada persona (por ejemplo, los 12 entrevistados de Voces de la Tierra). | Lista repetible (texto simple) | No | No |
| 18 | `ctaText` | Texto del botón | — | Texto | Sí | Sí |
| 19 | `ctaLink` | Link del botón | URL completa adonde lleva el botón, incluyendo https://. | Texto | No | No |

**Sub-campos de `episodes` (array de objetos, label de cada ítem "Episodio"):**

| Campo (clave) | Label | Description | Tipo | Bilingüe | Requerido |
|---|---|---|---|---|---|
| `number` | Número | — | Número entero | No | Sí |
| `videoId` | ID de video YouTube | ID del video del episodio en YouTube: la parte después de "v=" en la URL (o después de "youtu.be/"). Ejemplo: en youtube.com/watch?v=abc123, el ID es abc123. | Texto | No | Sí |
| `title` | Título | — | Texto | Sí | Sí |
| `description` | Descripción | Para poner una parte en itálica, encerrala entre asteriscos: *así*. Solo funciona en los campos que tienen esta indicación. | Texto largo | Sí | Sí |

**Sub-campos de `phases` (array de objetos, label de cada ítem "Fase"):**

| Campo (clave) | Label | Description | Tipo | Bilingüe | Requerido |
|---|---|---|---|---|---|
| `letter` | Letra | Letra que identifica la fase: A, B, C… | Texto | No | Sí |
| `title` | Título | — | Texto | Sí | Sí |
| `description` | Descripción | Para poner una parte en itálica, encerrala entre asteriscos: *así*. Solo funciona en los campos que tienen esta indicación. | Texto largo | Sí | Sí |

**Sub-campos de `featureCards` (array de objetos, label de cada ítem "Tarjeta"):**

| Campo (clave) | Label | Description | Tipo | Bilingüe | Requerido |
|---|---|---|---|---|---|
| `icon` | Ícono | Elegí el ícono que aparece en la tarjeta. | Selector (22 opciones fijas, default `auto_awesome`) | No | No |
| `title` | Título | — | Texto | Sí | Sí |
| `description` | Descripción | Para poner una parte en itálica, encerrala entre asteriscos: *así*. Solo funciona en los campos que tienen esta indicación. | Texto largo | Sí | Sí |

Las 22 opciones de `icon` (valor → glosa del label en el panel): `forest`
✾ Bosque/naturaleza, `eco` ✾ Ecología, `spa` ✾ Bienestar/spa, `groups` ◯
Comunidad/grupo, `person` ◯ Persona, `diversity_3` ◯ Diversidad, `movie`
▷ Cine/video, `play_circle` ▷ Reproducir/play, `mic` ◐ Micrófono/audio,
`school` ◆ Educación/escuela, `book` ◆ Libro, `menu_book` ◆
Manual/guía, `lightbulb` ✦ Idea/innovación, `healing` ✚ Salud/sanación,
`favorite` ♡ Amor/favorito, `forum` ◇ Foro/debate, `chat` ◇
Chat/conversación, `auto_awesome` ✦ Destello/especial, `public` ⊙
Mundo/global, `psychology` ❍ Psicología/mente, `palette` ◐ Arte/paleta,
`science` ✧ Ciencia/investigación.

**Sub-campo de `voices` (array de texto simple, no de objetos, label de
cada ítem el propio valor o "Voz" si está vacío):** un campo de texto
único, requerido, label "Voz", sin bilingüe.

### 2.8 Colección: Equipo (`team`)

| # | Campo (clave) | Label | Description | Tipo | Bilingüe | Requerido |
|---|---|---|---|---|---|---|
| 1 | `name` | Nombre | — | Slug (genera URL/id) | No | Sí (es el slug) |
| 2 | `role` | Rol | — | Texto | Sí | Sí |
| 3 | `bio` | Biografía | — | Texto largo | Sí | Sí |
| 4 | `order` | Orden | Número más alto = aparece primero en la página. Se recomienda numerar de 10 en 10 (10, 20, 30...) para poder insertar un miembro en el medio más adelante sin tener que renumerar todo. Un miembro nuevo nace en 100, arriba de todos, hasta que lo reacomodes. Si dos miembros quedan con el mismo número, se ordenan alfabéticamente por nombre entre ellos. | Número entero (default 100) | No | Sí |
| 5 | `photo` | Foto | Retrato vertical 3:4 · mínimo 600×800 px (ideal 900×1200) · cara/torso centrados · JPG, menos de 500 KB | Imagen | No | No (explícito `isRequired: false`) |
| 6 | `photoAlt` | Texto alternativo de la foto | Descripción corta de lo que se ve en la foto. La leen los lectores de pantalla (personas no videntes) y aparece si la foto no carga. Ej: "Mujer sonriendo, retrato de estudio". Si se deja vacío, se usa el nombre de la persona. | Texto | No | No |

---

## 3. Dónde se ve cada sección

URLs tomadas de `src/lib/routes.ts` y de la estructura real de
`src/pages/` (no de memoria).

| Singleton / Colección | URL en español | URL en inglés | Notas |
|---|---|---|---|
| Página: Inicio (`inicio`) | `/` | `/en/` | — |
| Página: Institucional (`institucional`) | `/institucional` | `/en/institucional` | El segmento de la URL NO se traduce a "about" en inglés — solo el rótulo del menú dice "About", la ruta sigue en español en ambos idiomas. |
| Página: Producciones (`proyectos`) | `/producciones` | `/en/productions` | Único par de rutas con segmento traducido de verdad (`producciones` ↔ `productions`), vía `productionsPath()` en `routes.ts`. |
| Página: Archivo (`archivo`) | `/archivo` | `/en/archivo` | Segmento sin traducir, igual que Institucional. |
| Página: Contacto (`contacto`) | `/contacto` | `/en/contacto` | Segmento sin traducir, igual que Institucional. |
| Textos de interfaz (`ui`) | Aparece en TODAS las páginas del sitio (Header y Footer, campos `nav_*`) y en cada página de detalle de producción (el resto de los campos) | — | No tiene una URL propia: es un conjunto de textos compartidos, no una página. |
| Colección: Producciones — cada ítem | `/producciones/{slug}` | `/en/productions/{slug}` | `{slug}` sale del campo `title` (es un `fields.slug`). Vía `productionPath(locale, id)` en `routes.ts`. |
| Colección: Equipo — cada ítem | Sección "Equipo" dentro de `/institucional` (no tiene página propia) | Sección "Equipo" dentro de `/en/institucional` | Se renderiza con `getCollection('team')` en `Institucional.astro:18`, no hay ruta `/equipo`. |

---

## 4. Comportamientos que la editora no puede deducir del panel

### 4.a Campos que aceptan asteriscos para énfasis (`*así*` → itálica)

Confirmado por dos vías: (1) el campo usa `ASTERISK_HINT` o
`READ_MORE_HINT` en `keystatic.config.mjs` (así lo dice su propia
description), y (2) el código realmente llama a `em()` sobre ese valor
antes de mostrarlo. Las dos coinciden en todos los casos de esta lista.

| Singleton/Colección | Campo (clave) |
|---|---|
| Inicio | `hero_title`, `hero_subtitle`, `pillars_title`, `pillar_arte_desc`, `pillar_ciencia_desc`, `pillar_consciencia_desc`, `featured_title` |
| Institucional | `hero_title`, `hero_subtitle`, `mission_title`, `vision_title`, `team_title`, `cta_title` |
| Producciones (página) | `hero_title`, `hero_subtitle` |
| Archivo | `hero_title`, `hero_subtitle` |
| Contacto | `hero_title` (`contact_tagline` NO acepta asteriscos, aunque está al lado) |
| Producciones (colección, cada ítem) | `tagline`, `description`, `episodes[].description`, `phases[].description`, `featureCards[].description` |

**Ojo con los párrafos largos de Institucional**: `mission_p1`–`mission_p5`
y `vision_p1`–`vision_p5` NO aceptan asteriscos (su description es
`ORDER_HINT`, solo habla de orden, no de énfasis) — a pesar de tener el
mismo aspecto de texto largo que sí lo permite en otros campos.
`vision_blockquote` tampoco.

### 4.b Campos que se cortan con "leer más"

Mecanismo `subtitleReadMore` (dentro de `HeroSection`) o componente
`<ReadMore>` explícito.

| Página/lugar | Campo | Mecanismo |
|---|---|---|
| Inicio, Institucional, Producciones (página), Archivo | `hero_subtitle` | `subtitleReadMore={true}` en `HeroSection` |
| Inicio — sección Pilares | `pillar_arte_desc`, `pillar_ciencia_desc`, `pillar_consciencia_desc` | `<ReadMore mode="paragraph">` (`Inicio.astro:130`) |
| Inicio — sección Producción Destacada | `description` de la producción destacada (colección Producciones) | `<ReadMore lines={3}>` (`Inicio.astro:179`) |

**Contacto NO usa "leer más" en ningún campo** (no usa el componente
`HeroSection`, arma su propio encabezado a mano).

**El mismo campo se comporta distinto según dónde se muestra**: la
`description` de una producción se ve truncada con "leer más" cuando
aparece como Producción Destacada en Inicio, pero se ve completa, sin
truncar, en la página de detalle de esa misma producción
(`ProyectoDetalle.astro:128-136`, split por párrafos, sin `<ReadMore>`).

### 4.c Regla de la caja CTA lateral de las producciones

Código real (`ProyectoDetalle.astro:225`):

```
{data.ctaLink && data.ctaText && (
```

La caja aparece solo si **ambos** campos tienen valor: **Link del botón**
(`ctaLink`) y **Texto del botón** (`ctaText`). En la práctica, el gate
funcional es **Link del botón**: `ctaText` es requerido en Keystatic
(`validation: { isRequired: true }` en ambos idiomas), así que Keystatic
no deja guardar una producción sin él — casi nunca puede faltar. `ctaLink`
NO es requerido, así que es el único de los dos que en la práctica decide
si la caja aparece o no.

### 4.d Orden de Equipo y de Producciones

Mismo criterio para las dos colecciones (`src/lib/sortProjects.ts`,
`src/lib/sortTeam.ts`): **orden descendente por el campo Orden (número
más alto primero)**, y a igualdad de número, alfabético por Título/Nombre
en español (`localeCompare` con locale `'es'`). Coincide exactamente con
lo que ya dice la description del campo Orden en cada colección — el
código no agrega ninguna regla adicional no documentada ahí.

### 4.e Dónde escribe Keystatic las imágenes, y si renombra el archivo

Los dos campos de imagen (`heroImage` en Producciones, `photo` en
Equipo) declaran:

- Producciones: `directory: 'public/images/projects'`,
  `publicPath: '/images/projects/'`
- Equipo: `directory: 'public/images/team'`,
  `publicPath: '/images/team/'`

Verificado contra el contenido real: Keystatic **sí renombra** el
archivo subido. No conserva el nombre original del archivo que sube la
editora — lo guarda siempre como `heroImage.jpg` (Producciones) o
`photo.jpg` (Equipo), dentro de una subcarpeta con el slug de esa
producción/persona. Ejemplos reales:

```
public/images/projects/el-nexo/heroImage.jpg
public/images/projects/pulso-terrestre/heroImage.jpg
public/images/team/carolina-maren/photo.jpg
```

Esto significa que volver a subir una imagen nueva para la misma
producción **reemplaza el archivo en el mismo lugar** (mismo nombre,
misma carpeta) — no queda un archivo viejo con otro nombre dando vueltas.
También significa que la carpeta de la imagen depende del slug vigente
en el momento de la subida: si el título (y por lo tanto el slug) se
cambia después de subir la imagen, la carpeta de la imagen no se
renombra sola. Esto es coherente con la propia advertencia del campo
Título: "Evitá cambiarlo en una producción ya publicada: rompe los links
que ya existen" — el mismo motivo aplica también a la imagen.

---

## 5. Valores reales del campo Tipo

Verificado con `grep -n "^kind:" src/content/projects/*.yaml` sobre los 7
archivos de contenido — no contra el ejemplo de la description ni contra
ningún acta.

| Valor de `kind` | Producciones que lo usan |
|---|---|
| Serie Documental | 3 (`hermanita-sudamerica`, `pulso-terrestre`, `voces-de-la-tierra`) |
| Podcast | 1 (`el-nexo`) |
| Programa Educativo | 1 (`educare`) |
| Programa de Salud | 1 (`holomedicina`) |
| Programa de Educación Ambiental | 1 (`sustento-gaia`) |

Total: 5 valores distintos sobre 7 producciones. El campo es texto libre
(`fields.text`, sin `options`): no hay una lista cerrada que se pueda
agotar ni opciones declaradas que nadie use — ver sección 2.7.

---

## Hallazgos no pedidos

1. **Posible mismatch de mayúsculas en dos carpetas de imágenes.** El
   contenido referencia rutas en minúscula
   (`/images/projects/educare/heroImage.jpg`,
   `/images/projects/holomedicina/heroImage.jpg`), pero las carpetas
   reales en disco son `public/images/projects/EduCare/` y
   `public/images/projects/Holomedicina/` (con mayúscula). En Windows
   esto no se nota porque el sistema de archivos no distingue mayúsculas.
   Si el servidor de producción sí las distingue (Linux, que es lo usual
   en hosting), esas dos imágenes de portada podrían no cargar. No lo
   verifiqué contra el sitio en vivo — este documento es de solo lectura
   sobre el repo — pero es un punto concreto para chequear antes de
   escribir la guía, y posiblemente antes de eso.

2. **`content.config.ts` no bloquea campos fuera del panel.** El schema
   de `pages` es un superset compartido por las 5 páginas (ver sección
   1). Si alguna vez se edita un YAML de página a mano (no desde el
   panel) y se le agrega un campo que no está registrado en el
   `keystatic.config.mjs` de esa página puntual, Zod no se queja (el
   campo es válido para la colección `pages` en general) pero tampoco
   hay forma de editarlo desde el panel — quedaría un campo "mudo".

3. **El campo `kind` no es un selector.** La Tarea 5 de este pedido
   asume implícitamente comparar "valores reales" contra algo declarado
   en el panel, pero `kind` es `fields.text` libre, no `fields.select`.
   No hay lista para agotar ni opciones sin uso — solo hay 5 valores
   reales sobre texto libre. Ya está reflejado así en la sección 5, lo
   marco acá para que quede explícito que no es un descuido de este
   documento.

4. **Los rótulos de menú (`nav_*`) no tienen fallback en el código.**
   Desde la limpieza de fallbacks muertos (rama
   `limpieza-fallbacks-nav`), si alguno de los 5 campos `nav_*` de
   Textos de interfaz quedara vacío, el build falla (son requeridos en
   `content.config.ts`) en vez de mostrar un rótulo hardcodeado. Vale la
   pena que la guía nueva mencione que estos 5 campos son los únicos de
   todo el panel que, si faltan, rompen el sitio entero en vez de
   mostrarse en blanco.

5. **El campo Orden de Equipo tiene un default distinto entre los dos
   archivos de schema.** En `keystatic.config.mjs` (línea 686), `order`
   de Equipo es requerido y nace en 100, igual que el de Producciones.
   Pero en `content.config.ts:128`, el mismo campo está declarado
   `z.number().default(0)` — un valor por defecto de Zod que en
   Producciones (`content.config.ts:86`) ni siquiera existe (`order:
   z.number()`, sin `.default()`, porque ahí sí es puramente requerido).
   En uso normal del panel esto no se nota — Keystatic exige el campo y
   lo completa en 100 antes de guardar — pero es una inconsistencia real
   entre ambos archivos, no algo que se pueda ver mirando solo uno de
   los dos.
