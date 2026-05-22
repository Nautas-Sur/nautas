import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const i18nString = z.object({
  es: z.string(),
  en: z.string(),
});

const pagesCollection = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/pages' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    // Hero (todas las páginas)
    hero_eyebrow: z.string().optional(),
    hero_title: z.string().optional(),
    hero_subtitle: z.string().optional(),
    hero_image: z.string().optional(),
    // === INICIO ===
    pillars_title: z.string().optional(),
    pillar_arte_title: z.string().optional(),
    pillar_arte_desc: z.string().optional(),
    pillar_ciencia_title: z.string().optional(),
    pillar_ciencia_desc: z.string().optional(),
    pillar_consciencia_title: z.string().optional(),
    pillar_consciencia_desc: z.string().optional(),
    vision_quote: z.string().optional(),
    newsletter_title: z.string().optional(),
    newsletter_subtitle: z.string().optional(),
    // === INSTITUCIONAL ===
    mission_title: z.string().optional(),
    mission_p1: z.string().optional(),
    mission_p2: z.string().optional(),
    mission_p3: z.string().optional(),
    mission_p4: z.string().optional(),
    mission_p5: z.string().optional(),
    mission_cta: z.string().optional(),
    vision_title: z.string().optional(),
    vision_p1: z.string().optional(),
    vision_p2: z.string().optional(),
    vision_p3: z.string().optional(),
    vision_blockquote: z.string().optional(),
    vision_p4: z.string().optional(),
    vision_p5: z.string().optional(),
    team_title: z.string().optional(),
    team_subtitle: z.string().optional(),
    cta_title: z.string().optional(),
    cta_subtitle: z.string().optional(),
    // === PROYECTOS / ARCHIVO ===
    completed_title: z.string().optional(),
    in_dev_title: z.string().optional(),
    // === CONTACTO ===
    contact_tagline: z.string().optional(),
    email_label: z.string().optional(),
    email: z.string().optional(),
    youtube_label: z.string().optional(),
    youtube_url: z.string().optional(),
    youtube_display: z.string().optional(),
    location_label: z.string().optional(),
    location: z.string().optional(),
    response_label: z.string().optional(),
    response_time: z.string().optional(),
    form_title: z.string().optional(),
  }),
});

const projectsCollection = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/projects' }),
  schema: z.object({
    title: z.string(),
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
  loader: glob({ pattern: '**/*.md', base: './src/content/team' }),
  schema: z.object({
    name: z.string(),
    role: i18nString,
    bio: i18nString.optional(),
    photo: z.string().optional(),
    photoAlt: z.string().optional(),
    order: z.number().default(0),
  }),
});

export const collections = {
  pages: pagesCollection,
  projects: projectsCollection,
  team: teamCollection,
};
