import { config, collection, fields } from '@keystatic/core';

export default config({
  storage: import.meta.env.DEV ? { kind: 'local' } : { kind: 'cloud' },
  cloud: {
    project: 'nautas/nautas',
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
