import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const i18nString = z.object({
  es: z.string(),
  en: z.string(),
});

const bi = z.object({ es: z.string(), en: z.string() });

const pagesCollection = defineCollection({
  loader: glob({ pattern: '**/*.yaml', base: './src/content/pages' }),
  schema: z.object({
    title: bi,
    description: bi,
    // Hero (todas las páginas)
    hero_eyebrow: bi.optional(),
    hero_title: bi.optional(),
    hero_subtitle: bi.optional(),
    hero_image: bi.optional(),
    // === INICIO ===
    pillars_title: bi.optional(),
    pillar_arte_title: bi.optional(),
    pillar_arte_desc: bi.optional(),
    pillar_ciencia_title: bi.optional(),
    pillar_ciencia_desc: bi.optional(),
    pillar_consciencia_title: bi.optional(),
    pillar_consciencia_desc: bi.optional(),
    vision_quote: bi.optional(),
    newsletter_title: bi.optional(),
    newsletter_subtitle: bi.optional(),
    // === INSTITUCIONAL ===
    mission_eyebrow: bi.optional(),
    mission_title: bi.optional(),
    mission_p1: bi.optional(),
    mission_p2: bi.optional(),
    mission_p3: bi.optional(),
    mission_p4: bi.optional(),
    mission_p5: bi.optional(),
    mission_cta: bi.optional(),
    vision_eyebrow: bi.optional(),
    vision_title: bi.optional(),
    vision_p1: bi.optional(),
    vision_p2: bi.optional(),
    vision_p3: bi.optional(),
    vision_blockquote: bi.optional(),
    vision_p4: bi.optional(),
    vision_p5: bi.optional(),
    team_eyebrow: bi.optional(),
    team_title: bi.optional(),
    team_subtitle: bi.optional(),
    cta_eyebrow: bi.optional(),
    cta_title: bi.optional(),
    cta_subtitle: bi.optional(),
    cta_button_contact: bi.optional(),
    cta_button_projects: bi.optional(),
    // === CONTACTO ===
    contact_eyebrow: bi.optional(),
    contact_tagline: bi.optional(),
    email_label: bi.optional(),
    email: bi.optional(),
    youtube_label: bi.optional(),
    youtube_url: bi.optional(),
    youtube_display: bi.optional(),
    location_label: bi.optional(),
    location: bi.optional(),
    response_label: bi.optional(),
    response_time: bi.optional(),
    form_title: bi.optional(),
  }),
});

const projectsCollection = defineCollection({
  loader: glob({ pattern: '**/*.yaml', base: './src/content/projects' }),
  schema: z.object({
    title: z.string(),
    order: z.number(),
    kind: z.string(),
    pillar: z.enum(['arte', 'ciencia', 'consciencia']),
    status: z.enum(['completed', 'in_development']),
    featured: z.boolean().default(false),
    year: z.string().optional(),
    tagline: i18nString,
    description: i18nString,
    heroImage: z.string().optional(),
    heroAlt: z.string().optional(),
    playlistId: z.string().optional(),
    featuredVideoId: z.string().optional(),
    episodes: z.array(z.object({
      number: z.number(),
      title: i18nString,
      description: i18nString.optional(),
      videoId: z.string().optional(),
    })).optional(),
    phases: z.array(z.object({
      letter: z.string(),
      title: i18nString,
      description: i18nString,
    })).optional(),
    featureCards: z.array(z.object({
      icon: z.string(),
      title: i18nString,
      description: i18nString,
    })).optional(),
    voices: z.array(z.union([z.string(), z.object({ name: z.string() })])).transform((arr) => arr.map((v) => (typeof v === 'string' ? v : v.name))).optional(),
    ctaText: i18nString.optional(),
    ctaLink: z.string().optional(),
  }),
});

const teamCollection = defineCollection({
  loader: glob({ pattern: '**/*.yaml', base: './src/content/team' }),
  schema: z.object({
    name: z.string(),
    role: i18nString,
    bio: i18nString.optional(),
    photo: z.string().optional(),
    photoAlt: z.string().optional(),
    order: z.number().default(0),
  }),
});

const uiCollection = defineCollection({
  loader: glob({ pattern: '**/*.yaml', base: './src/content/ui' }),
  schema: z.object({
    // === DETALLE DE PROYECTO ===
    back_to_archive: bi.optional(),
    voices_eyebrow: bi.optional(),
    voices_title: bi.optional(),
    phases_eyebrow: bi.optional(),
    phases_title: bi.optional(),
    trailer_title: bi.optional(),
    trailer_label: bi.optional(),
    episodes_title: bi.optional(),
    episodes_count_label: bi.optional(),
    project_cta_eyebrow: bi.optional(),
    project_cta_title: bi.optional(),
    project_cta_text: bi.optional(),
    related_eyebrow: bi.optional(),
    related_title: bi.optional(),
    read_more: bi.optional(),
    read_less: bi.optional(),
    episodes_separator: bi.optional(),
    episode_item_label: bi.optional(),
    now_playing_label: bi.optional(),
  }),
});

export const collections = {
  pages: pagesCollection,
  projects: projectsCollection,
  team: teamCollection,
  ui: uiCollection,
};
