import { config, collection, fields } from '@keystatic/core';

export default config({
  storage: {
    kind: 'local',
  },
  collections: {
    projects: collection({
      label: 'Proyectos',
      slugField: 'title',
      path: 'src/content/projects/*',
      format: { data: 'yaml', contentField: 'content' },
      schema: {
        title: fields.slug({ name: { label: 'Título' } }),
        kind: fields.text({ label: 'Tipo' }),
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
        featured: fields.checkbox({ label: 'Destacado', defaultValue: false }),
        year: fields.text({ label: 'Año' }),
        tagline: fields.object({
          es: fields.text({ label: 'Español' }),
          en: fields.text({ label: 'Inglés' }),
        }, { label: 'Tagline' }),
        description: fields.object({
          es: fields.text({ label: 'Español', multiline: true }),
          en: fields.text({ label: 'Inglés', multiline: true }),
        }, { label: 'Descripción' }),
        heroImage: fields.text({ label: 'Imagen de portada (ruta)' }),
        playlistId: fields.text({ label: 'ID de playlist YouTube' }),
        featuredVideoId: fields.text({ label: 'ID de video destacado (trailer)' }),
        ctaText: fields.object({
          es: fields.text({ label: 'Español' }),
          en: fields.text({ label: 'Inglés' }),
        }, { label: 'Texto del botón CTA' }),
        ctaLink: fields.url({ label: 'Link del CTA' }),
        voices: fields.array(
          fields.text({ label: 'Voz' }),
          { label: 'Voces', itemLabel: (props) => props.value || 'Voz' }
        ),
        episodes: fields.array(
          fields.object({
            number: fields.integer({ label: 'Número' }),
            videoId: fields.text({ label: 'ID de video YouTube' }),
            title: fields.object({
              es: fields.text({ label: 'Español' }),
              en: fields.text({ label: 'Inglés' }),
            }, { label: 'Título' }),
            description: fields.object({
              es: fields.text({ label: 'Español', multiline: true }),
              en: fields.text({ label: 'Inglés', multiline: true }),
            }, { label: 'Descripción' }),
          }, { label: 'Episodio' }),
          { label: 'Episodios', itemLabel: (props) => props.fields.title.fields.es.value || 'Episodio' }
        ),
        content: fields.text({ label: 'Notas internas', multiline: true }),
      },
    }),
  },
});
