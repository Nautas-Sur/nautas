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
    hero_title: z.string(),
    hero_subtitle: z.string(),
    hero_image: z.string().optional(),
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
    episodes: z.array(z.object({
      number: z.number(),
      title: i18nString,
      description: i18nString.optional(),
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
    voices: z.array(z.union([z.string(), z.object({ name: z.string() })])).transform((arr) => arr.map((v) => (typeof v
=== 'string' ? v : v.name))).optional(),
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