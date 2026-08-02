import { config, collection, singleton, fields } from '@keystatic/core';

const ASTERISK_HINT = 'Para poner una parte en itálica, encerrala entre asteriscos: *así*';
const SEO_HINT = 'No se ve en la página. Aparece en Google y al compartir el link.';
const ORDER_HINT = 'Se muestran en orden, uno debajo del otro.';

export default config({
  storage: import.meta.env.DEV ? { kind: 'local' } : { kind: 'cloud' },
  cloud: {
    project: 'nautas/nautas',
  },
  // NOTA: content.config.ts define hero_image (bilingüe, opcional)
  // que no se registra acá a propósito: no lo consume ningún .astro
  // y no existe en ningún .yaml. Slot reservado para imágenes de
  // encabezado (previsto para Fase 3). Si se empieza a usar, hay
  // que agregarlo acá.
  singletons: {
    inicio: singleton({
      label: 'Página: Inicio',
      path: 'src/content/pages/inicio',
      format: { data: 'yaml' },
      schema: {
        // --- SEO y metadatos ---
        title: fields.object({
          es: fields.text({ label: 'Español', validation: { isRequired: true }, description: SEO_HINT }),
          en: fields.text({ label: 'English', validation: { isRequired: true }, description: SEO_HINT }),
        }, { label: 'Título de la página (para buscadores)' }),
        description: fields.object({
          es: fields.text({ label: 'Español', multiline: true, validation: { isRequired: true }, description: SEO_HINT }),
          en: fields.text({ label: 'English', multiline: true, validation: { isRequired: true }, description: SEO_HINT }),
        }, { label: 'Descripción (para buscadores y redes)' }),
        // --- Encabezado ---
        hero_eyebrow: fields.object({
          es: fields.text({ label: 'Español' }),
          en: fields.text({ label: 'English' }),
        }, { label: 'Etiqueta superior' }),
        hero_title: fields.object({
          es: fields.text({ label: 'Español', description: ASTERISK_HINT }),
          en: fields.text({ label: 'English', description: ASTERISK_HINT }),
        }, { label: 'Título principal' }),
        hero_subtitle: fields.object({
          es: fields.text({ label: 'Español', multiline: true }),
          en: fields.text({ label: 'English', multiline: true }),
        }, { label: 'Subtítulo' }),
        // --- Los tres pilares ---
        pillars_title: fields.object({
          es: fields.text({ label: 'Español', description: ASTERISK_HINT }),
          en: fields.text({ label: 'English', description: ASTERISK_HINT }),
        }, { label: 'Título de la sección de los tres pilares' }),
        pillar_arte_title: fields.object({
          es: fields.text({ label: 'Español' }),
          en: fields.text({ label: 'English' }),
        }, { label: 'Título del pilar Arte' }),
        pillar_arte_desc: fields.object({
          es: fields.text({ label: 'Español', multiline: true }),
          en: fields.text({ label: 'English', multiline: true }),
        }, { label: 'Descripción del pilar Arte' }),
        pillar_ciencia_title: fields.object({
          es: fields.text({ label: 'Español' }),
          en: fields.text({ label: 'English' }),
        }, { label: 'Título del pilar Ciencia' }),
        pillar_ciencia_desc: fields.object({
          es: fields.text({ label: 'Español', multiline: true }),
          en: fields.text({ label: 'English', multiline: true }),
        }, { label: 'Descripción del pilar Ciencia' }),
        pillar_consciencia_title: fields.object({
          es: fields.text({ label: 'Español' }),
          en: fields.text({ label: 'English' }),
        }, { label: 'Título del pilar Consciencia' }),
        pillar_consciencia_desc: fields.object({
          es: fields.text({ label: 'Español', multiline: true }),
          en: fields.text({ label: 'English', multiline: true }),
        }, { label: 'Descripción del pilar Consciencia' }),
        // --- Cita de visión ---
        vision_quote: fields.object({
          es: fields.text({ label: 'Español', multiline: true }),
          en: fields.text({ label: 'English', multiline: true }),
        }, { label: 'Texto de la cita' }),
        // --- Newsletter ---
        newsletter_title: fields.object({
          es: fields.text({ label: 'Español' }),
          en: fields.text({ label: 'English' }),
        }, { label: 'Título de la sección de newsletter' }),
        newsletter_subtitle: fields.object({
          es: fields.text({ label: 'Español', multiline: true }),
          en: fields.text({ label: 'English', multiline: true }),
        }, { label: 'Texto de la sección de newsletter' }),
      },
    }),
    institucional: singleton({
      label: 'Página: Institucional',
      path: 'src/content/pages/institucional',
      format: { data: 'yaml' },
      schema: {
        // --- SEO y metadatos ---
        title: fields.object({
          es: fields.text({ label: 'Español', validation: { isRequired: true }, description: SEO_HINT }),
          en: fields.text({ label: 'English', validation: { isRequired: true }, description: SEO_HINT }),
        }, { label: 'Título de la página (para buscadores)' }),
        description: fields.object({
          es: fields.text({ label: 'Español', multiline: true, validation: { isRequired: true }, description: SEO_HINT }),
          en: fields.text({ label: 'English', multiline: true, validation: { isRequired: true }, description: SEO_HINT }),
        }, { label: 'Descripción (para buscadores y redes)' }),
        // --- Encabezado ---
        hero_title: fields.object({
          es: fields.text({ label: 'Español', description: ASTERISK_HINT }),
          en: fields.text({ label: 'English', description: ASTERISK_HINT }),
        }, { label: 'Título principal' }),
        hero_subtitle: fields.object({
          es: fields.text({ label: 'Español', multiline: true }),
          en: fields.text({ label: 'English', multiline: true }),
        }, { label: 'Subtítulo' }),
        // --- Misión ---
        mission_title: fields.object({
          es: fields.text({ label: 'Español', description: ASTERISK_HINT }),
          en: fields.text({ label: 'English', description: ASTERISK_HINT }),
        }, { label: 'Título de la sección de misión' }),
        mission_p1: fields.object({
          es: fields.text({ label: 'Español', multiline: true, description: ORDER_HINT }),
          en: fields.text({ label: 'English', multiline: true, description: ORDER_HINT }),
        }, { label: 'Párrafo 1' }),
        mission_p2: fields.object({
          es: fields.text({ label: 'Español', multiline: true, description: ORDER_HINT }),
          en: fields.text({ label: 'English', multiline: true, description: ORDER_HINT }),
        }, { label: 'Párrafo 2' }),
        mission_p3: fields.object({
          es: fields.text({ label: 'Español', multiline: true, description: ORDER_HINT }),
          en: fields.text({ label: 'English', multiline: true, description: ORDER_HINT }),
        }, { label: 'Párrafo 3' }),
        mission_p4: fields.object({
          es: fields.text({ label: 'Español', multiline: true, description: ORDER_HINT }),
          en: fields.text({ label: 'English', multiline: true, description: ORDER_HINT }),
        }, { label: 'Párrafo 4' }),
        mission_p5: fields.object({
          es: fields.text({ label: 'Español', multiline: true, description: ORDER_HINT }),
          en: fields.text({ label: 'English', multiline: true, description: ORDER_HINT }),
        }, { label: 'Párrafo 5' }),
        mission_cta: fields.object({
          es: fields.text({ label: 'Español' }),
          en: fields.text({ label: 'English' }),
        }, { label: 'Frase de cierre' }),
        // --- Visión ---
        vision_title: fields.object({
          es: fields.text({ label: 'Español', description: ASTERISK_HINT }),
          en: fields.text({ label: 'English', description: ASTERISK_HINT }),
        }, { label: 'Título de la sección de visión' }),
        vision_p1: fields.object({
          es: fields.text({ label: 'Español', multiline: true, description: ORDER_HINT }),
          en: fields.text({ label: 'English', multiline: true, description: ORDER_HINT }),
        }, { label: 'Párrafo 1' }),
        vision_p2: fields.object({
          es: fields.text({ label: 'Español', multiline: true, description: ORDER_HINT }),
          en: fields.text({ label: 'English', multiline: true, description: ORDER_HINT }),
        }, { label: 'Párrafo 2' }),
        vision_p3: fields.object({
          es: fields.text({ label: 'Español', multiline: true, description: ORDER_HINT }),
          en: fields.text({ label: 'English', multiline: true, description: ORDER_HINT }),
        }, { label: 'Párrafo 3' }),
        vision_blockquote: fields.object({
          es: fields.text({ label: 'Español', multiline: true }),
          en: fields.text({ label: 'English', multiline: true }),
        }, { label: 'Cita destacada' }),
        vision_p4: fields.object({
          es: fields.text({ label: 'Español', multiline: true, description: ORDER_HINT }),
          en: fields.text({ label: 'English', multiline: true, description: ORDER_HINT }),
        }, { label: 'Párrafo 4' }),
        vision_p5: fields.object({
          es: fields.text({ label: 'Español', multiline: true, description: ORDER_HINT }),
          en: fields.text({ label: 'English', multiline: true, description: ORDER_HINT }),
        }, { label: 'Párrafo 5' }),
        // --- Equipo ---
        team_title: fields.object({
          es: fields.text({ label: 'Español', description: ASTERISK_HINT }),
          en: fields.text({ label: 'English', description: ASTERISK_HINT }),
        }, { label: 'Título de la sección de equipo' }),
        team_subtitle: fields.object({
          es: fields.text({ label: 'Español' }),
          en: fields.text({ label: 'English' }),
        }, { label: 'Subtítulo de la sección de equipo' }),
        // --- Llamado a la acción ---
        cta_title: fields.object({
          es: fields.text({ label: 'Español', description: ASTERISK_HINT }),
          en: fields.text({ label: 'English', description: ASTERISK_HINT }),
        }, { label: 'Título del llamado a la acción' }),
        cta_subtitle: fields.object({
          es: fields.text({ label: 'Español' }),
          en: fields.text({ label: 'English' }),
        }, { label: 'Subtítulo del llamado a la acción' }),
      },
    }),
    proyectos: singleton({
      label: 'Página: Proyectos',
      path: 'src/content/pages/proyectos',
      format: { data: 'yaml' },
      schema: {
        // --- SEO y metadatos ---
        title: fields.object({
          es: fields.text({ label: 'Español', validation: { isRequired: true }, description: SEO_HINT }),
          en: fields.text({ label: 'English', validation: { isRequired: true }, description: SEO_HINT }),
        }, { label: 'Título de la página (para buscadores)' }),
        description: fields.object({
          es: fields.text({ label: 'Español', multiline: true, validation: { isRequired: true }, description: SEO_HINT }),
          en: fields.text({ label: 'English', multiline: true, validation: { isRequired: true }, description: SEO_HINT }),
        }, { label: 'Descripción (para buscadores y redes)' }),
        // --- Encabezado ---
        hero_eyebrow: fields.object({
          es: fields.text({ label: 'Español' }),
          en: fields.text({ label: 'English' }),
        }, { label: 'Etiqueta superior' }),
        hero_title: fields.object({
          es: fields.text({ label: 'Español', description: ASTERISK_HINT }),
          en: fields.text({ label: 'English', description: ASTERISK_HINT }),
        }, { label: 'Título principal' }),
        hero_subtitle: fields.object({
          es: fields.text({ label: 'Español', multiline: true }),
          en: fields.text({ label: 'English', multiline: true }),
        }, { label: 'Subtítulo' }),
        // --- Títulos de sección ---
        completed_title: fields.object({
          es: fields.text({ label: 'Español', description: ASTERISK_HINT }),
          en: fields.text({ label: 'English', description: ASTERISK_HINT }),
        }, { label: 'Título de la sección de producciones' }),
        in_dev_title: fields.object({
          es: fields.text({ label: 'Español', description: ASTERISK_HINT }),
          en: fields.text({ label: 'English', description: ASTERISK_HINT }),
        }, { label: 'Título de la sección en desarrollo' }),
      },
    }),
    archivo: singleton({
      label: 'Página: Archivo',
      path: 'src/content/pages/archivo',
      format: { data: 'yaml' },
      schema: {
        // --- SEO y metadatos ---
        title: fields.object({
          es: fields.text({ label: 'Español', validation: { isRequired: true }, description: SEO_HINT }),
          en: fields.text({ label: 'English', validation: { isRequired: true }, description: SEO_HINT }),
        }, { label: 'Título de la página (para buscadores)' }),
        description: fields.object({
          es: fields.text({ label: 'Español', multiline: true, validation: { isRequired: true }, description: SEO_HINT }),
          en: fields.text({ label: 'English', multiline: true, validation: { isRequired: true }, description: SEO_HINT }),
        }, { label: 'Descripción (para buscadores y redes)' }),
        // --- Encabezado ---
        hero_eyebrow: fields.object({
          es: fields.text({ label: 'Español' }),
          en: fields.text({ label: 'English' }),
        }, { label: 'Etiqueta superior' }),
        hero_title: fields.object({
          es: fields.text({ label: 'Español' }),
          en: fields.text({ label: 'English' }),
        }, { label: 'Título principal' }),
        hero_subtitle: fields.object({
          es: fields.text({ label: 'Español', multiline: true }),
          en: fields.text({ label: 'English', multiline: true }),
        }, { label: 'Subtítulo' }),
      },
    }),
    contacto: singleton({
      label: 'Página: Contacto',
      path: 'src/content/pages/contacto',
      format: { data: 'yaml' },
      schema: {
        // --- SEO y metadatos ---
        title: fields.object({
          es: fields.text({ label: 'Español', validation: { isRequired: true }, description: SEO_HINT }),
          en: fields.text({ label: 'English', validation: { isRequired: true }, description: SEO_HINT }),
        }, { label: 'Título de la página (para buscadores)' }),
        description: fields.object({
          es: fields.text({ label: 'Español', multiline: true, validation: { isRequired: true }, description: SEO_HINT }),
          en: fields.text({ label: 'English', multiline: true, validation: { isRequired: true }, description: SEO_HINT }),
        }, { label: 'Descripción (para buscadores y redes)' }),
        // --- Encabezado ---
        hero_title: fields.object({
          es: fields.text({ label: 'Español' }),
          en: fields.text({ label: 'English' }),
        }, { label: 'Título principal' }),
        contact_tagline: fields.object({
          es: fields.text({ label: 'Español' }),
          en: fields.text({ label: 'English' }),
        }, { label: 'Frase debajo del título' }),
        // --- Datos de contacto ---
        email_label: fields.object({
          es: fields.text({ label: 'Español' }),
          en: fields.text({ label: 'English' }),
        }, { label: 'Etiqueta del campo de email' }),
        email: fields.object({
          es: fields.text({ label: 'Español' }),
          en: fields.text({ label: 'English' }),
        }, { label: 'Dirección de email' }),
        youtube_label: fields.object({
          es: fields.text({ label: 'Español' }),
          en: fields.text({ label: 'English' }),
        }, { label: 'Etiqueta del campo de YouTube' }),
        youtube_url: fields.object({
          es: fields.text({ label: 'Español' }),
          en: fields.text({ label: 'English' }),
        }, { label: 'Link de YouTube' }),
        youtube_display: fields.object({
          es: fields.text({ label: 'Español' }),
          en: fields.text({ label: 'English' }),
        }, { label: 'Texto visible del link de YouTube' }),
        location_label: fields.object({
          es: fields.text({ label: 'Español' }),
          en: fields.text({ label: 'English' }),
        }, { label: 'Etiqueta del campo de ubicación' }),
        location: fields.object({
          es: fields.text({ label: 'Español' }),
          en: fields.text({ label: 'English' }),
        }, { label: 'Ubicación' }),
        response_label: fields.object({
          es: fields.text({ label: 'Español' }),
          en: fields.text({ label: 'English' }),
        }, { label: 'Etiqueta del tiempo de respuesta' }),
        response_time: fields.object({
          es: fields.text({ label: 'Español' }),
          en: fields.text({ label: 'English' }),
        }, { label: 'Tiempo de respuesta' }),
        // --- Formulario ---
        form_title: fields.object({
          es: fields.text({ label: 'Español' }),
          en: fields.text({ label: 'English' }),
        }, { label: 'Título del formulario' }),
      },
    }),
  },
  collections: {
    projects: collection({
      label: 'Proyectos',
      slugField: 'title',
      path: 'src/content/projects/*',
      format: { data: 'yaml' },
      schema: {
        title: fields.slug({ name: { label: 'Título', description: 'Este texto genera la dirección (URL) del proyecto. Evitá cambiarlo en un proyecto ya publicado: rompe los links que ya existen.' } }),
        kind: fields.text({ label: 'Tipo', description: 'Categoría del proyecto que se muestra en la tarjeta. Ej: Serie Documental, Podcast, Programa Educativo.', validation: { isRequired: true } }),
        pillar: fields.select({
          label: 'Pilar',
          options: [
            { label: 'Arte', value: 'arte' },
            { label: 'Ciencia', value: 'ciencia' },
            { label: 'Consciencia', value: 'consciencia' },
          ],
          defaultValue: 'arte',
        }),
        status: fields.select({
          label: 'Estado',
          options: [
            { label: 'Completado', value: 'completed' },
            { label: 'En desarrollo', value: 'in_development' },
          ],
          defaultValue: 'in_development',
        }),
        featured: fields.checkbox({ label: 'Destacado', defaultValue: false, description: 'Si está tildado, el proyecto aparece en la sección "Producción Destacada" del inicio. Solo funciona en proyectos con estado Completado, y si hay varios tildados se muestra únicamente el primero.' }),
        year: fields.text({ label: 'Año', description: 'Ej: 2024, o un rango: 2023–2024.' }),
        tagline: fields.object({
          es: fields.text({ label: 'Español', validation: { isRequired: true } }),
          en: fields.text({ label: 'Inglés', validation: { isRequired: true } }),
        }, { label: 'Frase / Lema', description: 'Frase corta que resume el proyecto. Aparece debajo del título.' }),
        description: fields.object({
          es: fields.text({ label: 'Español', multiline: true, validation: { isRequired: true } }),
          en: fields.text({ label: 'Inglés', multiline: true, validation: { isRequired: true } }),
        }, { label: 'Descripción' }),
        heroImage: fields.image({
          label: 'Imagen de portada',
          description: '16:9 · mínimo 1280×720 px (ideal 1920×1080) · sujeto centrado, se recorta a cuadrado en algunas vistas · JPG, menos de 500 KB',
          directory: 'public/images/projects',
          publicPath: '/images/projects/',
        }),
        heroAlt: fields.text({ label: 'Texto alternativo de la portada', description: 'Descripción corta de lo que se ve en la imagen. La leen los lectores de pantalla (personas no videntes) y aparece si la imagen no carga. Ej: "Mujer mayor caminando por un bosque de niebla".' }),
        playlistId: fields.text({ label: 'ID de playlist YouTube', description: 'Se obtiene de la URL de la playlist en YouTube: es la parte que aparece después de "list=". Ejemplo: en youtube.com/playlist?list=PLabc123, el ID es PLabc123.' }),
        featuredVideoId: fields.text({ label: 'ID de video destacado (trailer)', description: 'ID del video del trailer o adelanto. Se obtiene de la URL del video en YouTube: la parte después de "v=" (o después de "youtu.be/"). Ejemplo: en youtube.com/watch?v=abc123, el ID es abc123. Dejar vacío si el proyecto no tiene trailer.' }),
        episodes: fields.array(
          fields.object({
            number: fields.integer({ label: 'Número', validation: { isRequired: true } }),
            videoId: fields.text({ label: 'ID de video YouTube', description: 'ID del video del episodio en YouTube: la parte después de "v=" en la URL (o después de "youtu.be/"). Ejemplo: en youtube.com/watch?v=abc123, el ID es abc123.' }),
            title: fields.object({
              es: fields.text({ label: 'Español', validation: { isRequired: true } }),
              en: fields.text({ label: 'Inglés', validation: { isRequired: true } }),
            }, { label: 'Título' }),
            description: fields.object({
              es: fields.text({ label: 'Español', multiline: true }),
              en: fields.text({ label: 'Inglés', multiline: true }),
            }, { label: 'Descripción' }),
          }, { label: 'Episodio' }),
          { label: 'Episodios', itemLabel: (props) => props.fields.title.fields.es.value || 'Episodio' }
        ),
        phases: fields.array(
          fields.object({
            letter: fields.text({ label: 'Letra', description: 'Letra que identifica la fase: A, B, C…', validation: { isRequired: true } }),
            title: fields.object({
              es: fields.text({ label: 'Español', validation: { isRequired: true } }),
              en: fields.text({ label: 'Inglés', validation: { isRequired: true } }),
            }, { label: 'Título' }),
            description: fields.object({
              es: fields.text({ label: 'Español', multiline: true, validation: { isRequired: true } }),
              en: fields.text({ label: 'Inglés', multiline: true, validation: { isRequired: true } }),
            }, { label: 'Descripción' }),
          }, { label: 'Fase' }),
          { label: 'Fases', itemLabel: (props) => props.fields.letter.value || 'Fase' }
        ),
        featureCards: fields.array(
          fields.object({
            icon: fields.select({
              label: 'Ícono',
              description: 'Elegí el ícono que aparece en la tarjeta.',
              options: [
                { value: 'forest',       label: '✾ Bosque / naturaleza' },
                { value: 'eco',          label: '✾ Ecología' },
                { value: 'spa',          label: '✾ Bienestar / spa' },
                { value: 'groups',       label: '◯ Comunidad / grupo' },
                { value: 'person',       label: '◯ Persona' },
                { value: 'diversity_3',  label: '◯ Diversidad' },
                { value: 'movie',        label: '▷ Cine / video' },
                { value: 'play_circle',  label: '▷ Reproducir / play' },
                { value: 'mic',          label: '◐ Micrófono / audio' },
                { value: 'school',       label: '◆ Educación / escuela' },
                { value: 'book',         label: '◆ Libro' },
                { value: 'menu_book',    label: '◆ Manual / guía' },
                { value: 'lightbulb',    label: '✦ Idea / innovación' },
                { value: 'healing',      label: '✚ Salud / sanación' },
                { value: 'favorite',     label: '♡ Amor / favorito' },
                { value: 'forum',        label: '◇ Foro / debate' },
                { value: 'chat',         label: '◇ Chat / conversación' },
                { value: 'auto_awesome', label: '✦ Destello / especial' },
                { value: 'public',       label: '⊙ Mundo / global' },
                { value: 'psychology',   label: '❍ Psicología / mente' },
                { value: 'palette',      label: '◐ Arte / paleta' },
                { value: 'science',      label: '✧ Ciencia / investigación' },
              ],
              defaultValue: 'auto_awesome',
            }),
            title: fields.object({
              es: fields.text({ label: 'Español', validation: { isRequired: true } }),
              en: fields.text({ label: 'Inglés', validation: { isRequired: true } }),
            }, { label: 'Título' }),
            description: fields.object({
              es: fields.text({ label: 'Español', multiline: true, validation: { isRequired: true } }),
              en: fields.text({ label: 'Inglés', multiline: true, validation: { isRequired: true } }),
            }, { label: 'Descripción' }),
          }, { label: 'Tarjeta' }),
          { label: 'Tarjetas destacadas', itemLabel: (props) => props.fields.title.fields.es.value || 'Card' }
        ),
        voices: fields.array(
          fields.text({ label: 'Voz' }),
          { label: 'Voces', itemLabel: (props) => props.value || 'Voz', description: 'Nombres de los protagonistas o entrevistados del proyecto. Aparecen como etiquetas en la página del proyecto. Sumá uno por cada persona (por ejemplo, los 12 entrevistados de Voces de la Tierra).' }
        ),
        ctaText: fields.object({
          es: fields.text({ label: 'Español', validation: { isRequired: true } }),
          en: fields.text({ label: 'Inglés', validation: { isRequired: true } }),
        }, { label: 'Texto del botón' }),
        ctaLink: fields.text({ label: 'Link del botón', description: 'URL completa adonde lleva el botón, incluyendo https://.' }),
      },
    }),
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
  },
});
