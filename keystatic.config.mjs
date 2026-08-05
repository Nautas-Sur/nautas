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
        // --- Portada ---
        hero_eyebrow: fields.object({
          es: fields.text({ label: 'Español' }),
          en: fields.text({ label: 'English' }),
        }, { label: 'Portada — Etiqueta superior' }),
        hero_title: fields.object({
          es: fields.text({ label: 'Español', description: ASTERISK_HINT }),
          en: fields.text({ label: 'English', description: ASTERISK_HINT }),
        }, { label: 'Portada — Título principal' }),
        hero_subtitle: fields.object({
          es: fields.text({ label: 'Español', multiline: true }),
          en: fields.text({ label: 'English', multiline: true }),
        }, { label: 'Portada — Texto de presentación' }),
        // --- Los tres pilares ---
        pillars_title: fields.object({
          es: fields.text({ label: 'Español', description: ASTERISK_HINT }),
          en: fields.text({ label: 'English', description: ASTERISK_HINT }),
        }, { label: 'Pilares — Título de sección' }),
        pillar_arte_title: fields.object({
          es: fields.text({ label: 'Español' }),
          en: fields.text({ label: 'English' }),
        }, { label: 'Pilares — Arte: título' }),
        pillar_arte_desc: fields.object({
          es: fields.text({ label: 'Español', multiline: true }),
          en: fields.text({ label: 'English', multiline: true }),
        }, { label: 'Pilares — Arte: descripción' }),
        pillar_ciencia_title: fields.object({
          es: fields.text({ label: 'Español' }),
          en: fields.text({ label: 'English' }),
        }, { label: 'Pilares — Ciencia: título' }),
        pillar_ciencia_desc: fields.object({
          es: fields.text({ label: 'Español', multiline: true }),
          en: fields.text({ label: 'English', multiline: true }),
        }, { label: 'Pilares — Ciencia: descripción' }),
        pillar_consciencia_title: fields.object({
          es: fields.text({ label: 'Español' }),
          en: fields.text({ label: 'English' }),
        }, { label: 'Pilares — Consciencia: título' }),
        pillar_consciencia_desc: fields.object({
          es: fields.text({ label: 'Español', multiline: true }),
          en: fields.text({ label: 'English', multiline: true }),
        }, { label: 'Pilares — Consciencia: descripción' }),
        // --- Cita de visión ---
        vision_quote: fields.object({
          es: fields.text({ label: 'Español', multiline: true }),
          en: fields.text({ label: 'English', multiline: true }),
        }, { label: 'Cita de visión' }),
        // --- Newsletter ---
        newsletter_title: fields.object({
          es: fields.text({ label: 'Español' }),
          en: fields.text({ label: 'English' }),
        }, { label: 'Newsletter — Título' }),
        newsletter_subtitle: fields.object({
          es: fields.text({ label: 'Español', multiline: true }),
          en: fields.text({ label: 'English', multiline: true }),
        }, { label: 'Newsletter — Subtítulo' }),
        // --- SEO y metadatos ---
        title: fields.object({
          es: fields.text({ label: 'Español', validation: { isRequired: true }, description: SEO_HINT }),
          en: fields.text({ label: 'English', validation: { isRequired: true }, description: SEO_HINT }),
        }, { label: 'SEO — Título para buscadores' }),
        description: fields.object({
          es: fields.text({ label: 'Español', multiline: true, validation: { isRequired: true }, description: SEO_HINT }),
          en: fields.text({ label: 'English', multiline: true, validation: { isRequired: true }, description: SEO_HINT }),
        }, { label: 'SEO — Descripción para buscadores' }),
      },
    }),
    institucional: singleton({
      label: 'Página: Institucional',
      path: 'src/content/pages/institucional',
      format: { data: 'yaml' },
      schema: {
        // --- Portada ---
        hero_title: fields.object({
          es: fields.text({ label: 'Español', description: ASTERISK_HINT }),
          en: fields.text({ label: 'English', description: ASTERISK_HINT }),
        }, { label: 'Portada — Título principal' }),
        hero_subtitle: fields.object({
          es: fields.text({ label: 'Español', multiline: true }),
          en: fields.text({ label: 'English', multiline: true }),
        }, { label: 'Portada — Texto de presentación' }),
        // --- Misión ---
        mission_eyebrow: fields.object({
          es: fields.text({ label: 'Español' }),
          en: fields.text({ label: 'English' }),
        }, {
          label: 'Misión — etiqueta sobre el título',
          description: 'Texto chico en minúscula que aparece arriba del título de la sección, precedido por //. El título en sí es el campo de abajo.',
        }),
        mission_title: fields.object({
          es: fields.text({ label: 'Español', description: ASTERISK_HINT }),
          en: fields.text({ label: 'English', description: ASTERISK_HINT }),
        }, { label: 'Misión — Título' }),
        mission_p1: fields.object({
          es: fields.text({ label: 'Español', multiline: true, description: ORDER_HINT }),
          en: fields.text({ label: 'English', multiline: true, description: ORDER_HINT }),
        }, { label: 'Misión — Párrafo 1' }),
        mission_p2: fields.object({
          es: fields.text({ label: 'Español', multiline: true, description: ORDER_HINT }),
          en: fields.text({ label: 'English', multiline: true, description: ORDER_HINT }),
        }, { label: 'Misión — Párrafo 2' }),
        mission_p3: fields.object({
          es: fields.text({ label: 'Español', multiline: true, description: ORDER_HINT }),
          en: fields.text({ label: 'English', multiline: true, description: ORDER_HINT }),
        }, { label: 'Misión — Párrafo 3' }),
        mission_p4: fields.object({
          es: fields.text({ label: 'Español', multiline: true, description: ORDER_HINT }),
          en: fields.text({ label: 'English', multiline: true, description: ORDER_HINT }),
        }, { label: 'Misión — Párrafo 4' }),
        mission_p5: fields.object({
          es: fields.text({ label: 'Español', multiline: true, description: ORDER_HINT }),
          en: fields.text({ label: 'English', multiline: true, description: ORDER_HINT }),
        }, { label: 'Misión — Párrafo 5' }),
        mission_cta: fields.object({
          es: fields.text({ label: 'Español' }),
          en: fields.text({ label: 'English' }),
        }, { label: 'Misión — Frase de cierre' }),
        // --- Visión ---
        vision_eyebrow: fields.object({
          es: fields.text({ label: 'Español' }),
          en: fields.text({ label: 'English' }),
        }, {
          label: 'Visión — etiqueta sobre el título',
          description: 'Ídem, para la sección Visión.',
        }),
        vision_title: fields.object({
          es: fields.text({ label: 'Español', description: ASTERISK_HINT }),
          en: fields.text({ label: 'English', description: ASTERISK_HINT }),
        }, { label: 'Visión — Título' }),
        vision_p1: fields.object({
          es: fields.text({ label: 'Español', multiline: true, description: ORDER_HINT }),
          en: fields.text({ label: 'English', multiline: true, description: ORDER_HINT }),
        }, { label: 'Visión — Párrafo 1' }),
        vision_p2: fields.object({
          es: fields.text({ label: 'Español', multiline: true, description: ORDER_HINT }),
          en: fields.text({ label: 'English', multiline: true, description: ORDER_HINT }),
        }, { label: 'Visión — Párrafo 2' }),
        vision_p3: fields.object({
          es: fields.text({ label: 'Español', multiline: true, description: ORDER_HINT }),
          en: fields.text({ label: 'English', multiline: true, description: ORDER_HINT }),
        }, { label: 'Visión — Párrafo 3' }),
        vision_blockquote: fields.object({
          es: fields.text({ label: 'Español', multiline: true }),
          en: fields.text({ label: 'English', multiline: true }),
        }, { label: 'Visión — Cita destacada' }),
        vision_p4: fields.object({
          es: fields.text({ label: 'Español', multiline: true, description: ORDER_HINT }),
          en: fields.text({ label: 'English', multiline: true, description: ORDER_HINT }),
        }, { label: 'Visión — Párrafo 4' }),
        vision_p5: fields.object({
          es: fields.text({ label: 'Español', multiline: true, description: ORDER_HINT }),
          en: fields.text({ label: 'English', multiline: true, description: ORDER_HINT }),
        }, { label: 'Visión — Párrafo 5' }),
        // --- Equipo ---
        team_eyebrow: fields.object({
          es: fields.text({ label: 'Español' }),
          en: fields.text({ label: 'English' }),
        }, {
          label: 'Equipo — etiqueta sobre el título',
          description: 'Ídem, para la sección Equipo.',
        }),
        team_title: fields.object({
          es: fields.text({ label: 'Español', description: ASTERISK_HINT }),
          en: fields.text({ label: 'English', description: ASTERISK_HINT }),
        }, { label: 'Equipo — Título' }),
        team_subtitle: fields.object({
          es: fields.text({ label: 'Español' }),
          en: fields.text({ label: 'English' }),
        }, { label: 'Equipo — Subtítulo' }),
        // --- Llamado final ---
        cta_eyebrow: fields.object({
          es: fields.text({ label: 'Español' }),
          en: fields.text({ label: 'English' }),
        }, {
          label: 'Cierre — etiqueta sobre el título',
          description: 'Ídem, para la sección de cierre de la página.',
        }),
        cta_title: fields.object({
          es: fields.text({ label: 'Español', description: ASTERISK_HINT }),
          en: fields.text({ label: 'English', description: ASTERISK_HINT }),
        }, { label: 'Llamado final — Título' }),
        cta_subtitle: fields.object({
          es: fields.text({ label: 'Español' }),
          en: fields.text({ label: 'English' }),
        }, { label: 'Llamado final — Subtítulo' }),
        cta_button_contact: fields.object({
          es: fields.text({ label: 'Español' }),
          en: fields.text({ label: 'English' }),
        }, {
          label: 'Cierre — texto del botón principal',
          description: 'El botón sólido que lleva a la página de Contacto.',
        }),
        cta_button_projects: fields.object({
          es: fields.text({ label: 'Español' }),
          en: fields.text({ label: 'English' }),
        }, {
          label: 'Cierre — texto del botón secundario',
          description: 'El botón con borde que lleva a la página de Proyectos.',
        }),
        // --- SEO y metadatos ---
        title: fields.object({
          es: fields.text({ label: 'Español', validation: { isRequired: true }, description: SEO_HINT }),
          en: fields.text({ label: 'English', validation: { isRequired: true }, description: SEO_HINT }),
        }, { label: 'SEO — Título para buscadores' }),
        description: fields.object({
          es: fields.text({ label: 'Español', multiline: true, validation: { isRequired: true }, description: SEO_HINT }),
          en: fields.text({ label: 'English', multiline: true, validation: { isRequired: true }, description: SEO_HINT }),
        }, { label: 'SEO — Descripción para buscadores' }),
      },
    }),
    proyectos: singleton({
      label: 'Página: Proyectos',
      path: 'src/content/pages/proyectos',
      format: { data: 'yaml' },
      schema: {
        // --- Portada ---
        hero_eyebrow: fields.object({
          es: fields.text({ label: 'Español' }),
          en: fields.text({ label: 'English' }),
        }, { label: 'Portada — Etiqueta superior' }),
        hero_title: fields.object({
          es: fields.text({ label: 'Español', description: ASTERISK_HINT }),
          en: fields.text({ label: 'English', description: ASTERISK_HINT }),
        }, { label: 'Portada — Título principal' }),
        hero_subtitle: fields.object({
          es: fields.text({ label: 'Español', multiline: true }),
          en: fields.text({ label: 'English', multiline: true }),
        }, { label: 'Portada — Texto de presentación' }),
        // --- Secciones ---
        completed_title: fields.object({
          es: fields.text({ label: 'Español', description: ASTERISK_HINT }),
          en: fields.text({ label: 'English', description: ASTERISK_HINT }),
        }, { label: 'Secciones — Título de Producciones' }),
        in_dev_title: fields.object({
          es: fields.text({ label: 'Español', description: ASTERISK_HINT }),
          en: fields.text({ label: 'English', description: ASTERISK_HINT }),
        }, { label: 'Secciones — Título de En Desarrollo' }),
        // --- SEO y metadatos ---
        title: fields.object({
          es: fields.text({ label: 'Español', validation: { isRequired: true }, description: SEO_HINT }),
          en: fields.text({ label: 'English', validation: { isRequired: true }, description: SEO_HINT }),
        }, { label: 'SEO — Título para buscadores' }),
        description: fields.object({
          es: fields.text({ label: 'Español', multiline: true, validation: { isRequired: true }, description: SEO_HINT }),
          en: fields.text({ label: 'English', multiline: true, validation: { isRequired: true }, description: SEO_HINT }),
        }, { label: 'SEO — Descripción para buscadores' }),
      },
    }),
    archivo: singleton({
      label: 'Página: Archivo',
      path: 'src/content/pages/archivo',
      format: { data: 'yaml' },
      schema: {
        // --- Portada ---
        hero_eyebrow: fields.object({
          es: fields.text({ label: 'Español' }),
          en: fields.text({ label: 'English' }),
        }, { label: 'Portada — Etiqueta superior' }),
        hero_title: fields.object({
          es: fields.text({ label: 'Español' }),
          en: fields.text({ label: 'English' }),
        }, { label: 'Portada — Título principal' }),
        hero_subtitle: fields.object({
          es: fields.text({ label: 'Español', multiline: true }),
          en: fields.text({ label: 'English', multiline: true }),
        }, { label: 'Portada — Texto de presentación' }),
        // --- SEO y metadatos ---
        title: fields.object({
          es: fields.text({ label: 'Español', validation: { isRequired: true }, description: SEO_HINT }),
          en: fields.text({ label: 'English', validation: { isRequired: true }, description: SEO_HINT }),
        }, { label: 'SEO — Título para buscadores' }),
        description: fields.object({
          es: fields.text({ label: 'Español', multiline: true, validation: { isRequired: true }, description: SEO_HINT }),
          en: fields.text({ label: 'English', multiline: true, validation: { isRequired: true }, description: SEO_HINT }),
        }, { label: 'SEO — Descripción para buscadores' }),
      },
    }),
    contacto: singleton({
      label: 'Página: Contacto',
      path: 'src/content/pages/contacto',
      format: { data: 'yaml' },
      schema: {
        // --- Portada ---
        contact_eyebrow: fields.object({
          es: fields.text({ label: 'Español' }),
          en: fields.text({ label: 'English' }),
        }, {
          label: 'Encabezado — etiqueta sobre el título',
          description: "Texto chico en minúscula arriba del título de la página, precedido por //. OJO: es distinto del título principal, que también dice 'Escribinos.' — este es la línea chica de arriba.",
        }),
        hero_title: fields.object({
          es: fields.text({ label: 'Español' }),
          en: fields.text({ label: 'English' }),
        }, { label: 'Portada — Título principal' }),
        contact_tagline: fields.object({
          es: fields.text({ label: 'Español' }),
          en: fields.text({ label: 'English' }),
        }, { label: 'Portada — Texto de presentación' }),
        // --- Datos de contacto ---
        email_label: fields.object({
          es: fields.text({ label: 'Español' }),
          en: fields.text({ label: 'English' }),
        }, { label: 'Datos — Etiqueta del campo de email' }),
        email: fields.object({
          es: fields.text({ label: 'Español' }),
          en: fields.text({ label: 'English' }),
        }, { label: 'Datos — Dirección de email' }),
        youtube_label: fields.object({
          es: fields.text({ label: 'Español' }),
          en: fields.text({ label: 'English' }),
        }, { label: 'Datos — Etiqueta del campo de YouTube' }),
        youtube_url: fields.object({
          es: fields.text({ label: 'Español' }),
          en: fields.text({ label: 'English' }),
        }, { label: 'Datos — Link de YouTube' }),
        youtube_display: fields.object({
          es: fields.text({ label: 'Español' }),
          en: fields.text({ label: 'English' }),
        }, { label: 'Datos — Texto visible del link de YouTube' }),
        location_label: fields.object({
          es: fields.text({ label: 'Español' }),
          en: fields.text({ label: 'English' }),
        }, { label: 'Datos — Etiqueta del campo de ubicación' }),
        location: fields.object({
          es: fields.text({ label: 'Español' }),
          en: fields.text({ label: 'English' }),
        }, { label: 'Datos — Ubicación' }),
        response_label: fields.object({
          es: fields.text({ label: 'Español' }),
          en: fields.text({ label: 'English' }),
        }, { label: 'Datos — Etiqueta del tiempo de respuesta' }),
        response_time: fields.object({
          es: fields.text({ label: 'Español' }),
          en: fields.text({ label: 'English' }),
        }, { label: 'Datos — Tiempo de respuesta' }),
        // --- Formulario ---
        form_title: fields.object({
          es: fields.text({ label: 'Español' }),
          en: fields.text({ label: 'English' }),
        }, { label: 'Formulario — Título' }),
        // --- SEO y metadatos ---
        title: fields.object({
          es: fields.text({ label: 'Español', validation: { isRequired: true }, description: SEO_HINT }),
          en: fields.text({ label: 'English', validation: { isRequired: true }, description: SEO_HINT }),
        }, { label: 'SEO — Título para buscadores' }),
        description: fields.object({
          es: fields.text({ label: 'Español', multiline: true, validation: { isRequired: true }, description: SEO_HINT }),
          en: fields.text({ label: 'English', multiline: true, validation: { isRequired: true }, description: SEO_HINT }),
        }, { label: 'SEO — Descripción para buscadores' }),
      },
    }),
    // Textos que aparecen en TODAS las páginas de proyecto. Un cambio acá
    // afecta a todos los proyectos.
    // (Keystatic Singleton no admite una `description` a nivel de colección,
    // por eso queda documentado acá como comentario.)
    ui: singleton({
      label: 'Textos de interfaz',
      path: 'src/content/ui/textos',
      format: { data: 'yaml' },
      schema: {
        back_to_archive: fields.object({
          es: fields.text({ label: 'Español' }),
          en: fields.text({ label: 'English' }),
        }, { label: 'Detalle — Link de vuelta al archivo' }),
        voices_eyebrow: fields.object({
          es: fields.text({ label: 'Español' }),
          en: fields.text({ label: 'English' }),
        }, { label: 'Detalle — Voces: etiqueta superior' }),
        voices_title: fields.object({
          es: fields.text({ label: 'Español' }),
          en: fields.text({ label: 'English' }),
        }, { label: 'Detalle — Voces: título' }),
        phases_eyebrow: fields.object({
          es: fields.text({ label: 'Español' }),
          en: fields.text({ label: 'English' }),
        }, { label: 'Detalle — Fases: etiqueta superior' }),
        phases_title: fields.object({
          es: fields.text({ label: 'Español' }),
          en: fields.text({ label: 'English' }),
        }, { label: 'Detalle — Fases: título' }),
        trailer_title: fields.object({
          es: fields.text({ label: 'Español' }),
          en: fields.text({ label: 'English' }),
        }, { label: 'Detalle — Trailer: título' }),
        trailer_label: fields.object({
          es: fields.text({ label: 'Español' }),
          en: fields.text({ label: 'English' }),
        }, { label: 'Detalle — Trailer: etiqueta' }),
        episodes_title: fields.object({
          es: fields.text({ label: 'Español' }),
          en: fields.text({ label: 'English' }),
        }, { label: 'Detalle — Episodios: título' }),
        episodes_count_label: fields.object({
          es: fields.text({ label: 'Español' }),
          en: fields.text({ label: 'English' }),
        }, { label: 'Detalle — Episodios: palabra del contador' }),
        project_cta_eyebrow: fields.object({
          es: fields.text({ label: 'Español' }),
          en: fields.text({ label: 'English' }),
        }, { label: 'Detalle — Caja lateral: etiqueta superior' }),
        project_cta_title: fields.object({
          es: fields.text({ label: 'Español' }),
          en: fields.text({ label: 'English' }),
        }, { label: 'Detalle — Caja lateral: título' }),
        project_cta_text: fields.object({
          es: fields.text({ label: 'Español', multiline: true }),
          en: fields.text({ label: 'English', multiline: true }),
        }, { label: 'Detalle — Caja lateral: texto' }),
        related_eyebrow: fields.object({
          es: fields.text({ label: 'Español' }),
          en: fields.text({ label: 'English' }),
        }, { label: 'Relacionados — Etiqueta superior' }),
        related_title: fields.object({
          es: fields.text({ label: 'Español' }),
          en: fields.text({ label: 'English' }),
        }, { label: 'Relacionados — Título' }),
        read_more: fields.object({
          es: fields.text({ label: 'Español' }),
          en: fields.text({ label: 'English' }),
        }, { label: 'Leer más — Etiqueta para expandir' }),
        read_less: fields.object({
          es: fields.text({ label: 'Español' }),
          en: fields.text({ label: 'English' }),
        }, { label: 'Leer más — Etiqueta para colapsar' }),
        episodes_separator: fields.object({
          es: fields.text({ label: 'Español' }),
          en: fields.text({ label: 'English' }),
        }, {
          label: 'Episodios — separador debajo del adelanto',
          description: 'Aparece entre el adelanto y la lista de episodios, sólo en proyectos que tienen adelanto. Se muestra en minúscula y precedido por //.',
        }),
        episode_item_label: fields.object({
          es: fields.text({ label: 'Español' }),
          en: fields.text({ label: 'English' }),
        }, {
          label: 'Episodios — etiqueta de cada ítem',
          description: "La palabra que acompaña al número en cada episodio de la lista: '// episodio 01'. En singular.",
        }),
        now_playing_label: fields.object({
          es: fields.text({ label: 'Español' }),
          en: fields.text({ label: 'English' }),
        }, {
          label: 'Episodios — indicador del que se está viendo',
          description: 'Etiqueta sobre la miniatura del episodio que se está reproduciendo.',
        }),
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
        order: fields.integer({
          label: 'Orden',
          description: 'Número más alto = aparece primero en la grilla. Se recomienda numerar de 10 en 10 (10, 20, 30...) para poder insertar un proyecto en el medio más adelante sin tener que renumerar todo. Un proyecto nuevo nace en 100, arriba de todos, hasta que lo reacomodes. Si dos proyectos quedan con el mismo número, se ordenan alfabéticamente por título entre ellos.',
          defaultValue: 100,
          validation: { isRequired: true },
        }),
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
