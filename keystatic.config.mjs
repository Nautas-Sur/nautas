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
        heroImage: fields.image({
          label: 'Imagen de portada',
          description: '16:9 · mínimo 1280×720 px (ideal 1920×1080) · sujeto centrado, se recorta a cuadrado en algunas vistas · JPG, menos de 500 KB',
          directory: 'public/images/projects',
          publicPath: '/images/projects/',
        }),
        heroAlt: fields.text({ label: 'Texto alternativo de la portada' }),
        playlistId: fields.text({ label: 'ID de playlist YouTube' }),
        featuredVideoId: fields.text({ label: 'ID de video destacado (trailer)' }),
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
        phases: fields.array(
          fields.object({
            letter: fields.text({ label: 'Letra' }),
            title: fields.object({
              es: fields.text({ label: 'Español' }),
              en: fields.text({ label: 'Inglés' }),
            }, { label: 'Título' }),
            description: fields.object({
              es: fields.text({ label: 'Español', multiline: true }),
              en: fields.text({ label: 'Inglés', multiline: true }),
            }, { label: 'Descripción' }),
          }, { label: 'Fase' }),
          { label: 'Fases', itemLabel: (props) => props.fields.letter.value || 'Fase' }
        ),
        featureCards: fields.array(
          fields.object({
            icon: fields.text({ label: 'Ícono' }),
            title: fields.object({
              es: fields.text({ label: 'Español' }),
              en: fields.text({ label: 'Inglés' }),
            }, { label: 'Título' }),
            description: fields.object({
              es: fields.text({ label: 'Español', multiline: true }),
              en: fields.text({ label: 'Inglés', multiline: true }),
            }, { label: 'Descripción' }),
          }, { label: 'Feature card' }),
          { label: 'Feature cards', itemLabel: (props) => props.fields.title.fields.es.value || 'Card' }
        ),
        voices: fields.array(
          fields.text({ label: 'Voz' }),
          { label: 'Voces', itemLabel: (props) => props.value || 'Voz' }
        ),
        ctaText: fields.object({
          es: fields.text({ label: 'Español' }),
          en: fields.text({ label: 'Inglés' }),
        }, { label: 'Texto del botón CTA' }),
        ctaLink: fields.text({ label: 'Link del CTA (URL)' }),
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
          es: fields.text({ label: 'Español' }),
          en: fields.text({ label: 'Inglés' }),
        }, { label: 'Rol' }),
        bio: fields.object({
          es: fields.text({ label: 'Español', multiline: true }),
          en: fields.text({ label: 'Inglés', multiline: true }),
        }, { label: 'Biografía' }),
        order: fields.integer({ label: 'Orden' }),
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
