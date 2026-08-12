// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import react from '@astrojs/react';
import keystatic from '@keystatic/astro';

import vercel from '@astrojs/vercel';

import sitemap from '@astrojs/sitemap';

import { alternatePath } from './src/lib/routes';

// https://astro.build/config
export default defineConfig({
  site: 'https://nautas.org.ar',
  publicDir: './public',
  integrations: [
    react(),
    keystatic(),
    sitemap({
      i18n: {
        defaultLocale: 'es',
        locales: {
          es: 'es-AR',
          en: 'en',
        },
      },
      filter: (page) =>
        !page.includes('/keystatic') && !page.includes('/en/producciones'),
      serialize(item) {
        const path = new URL(item.url).pathname;
        const withSlash = (p) => (p.endsWith('/') ? p : p + '/');
        const site = 'https://nautas.org.ar';
        return {
          ...item,
          links: [
            { lang: 'es-AR', url: site + withSlash(alternatePath(path, 'es')) },
            { lang: 'en', url: site + withSlash(alternatePath(path, 'en')) },
          ],
        };
      },
    }),
  ],

  i18n: {
    defaultLocale: 'es',
    locales: ['es', 'en'],
    routing: {
      prefixDefaultLocale: false,
      redirectToDefaultLocale: false,
    },
    fallback: {
      en: 'es',
    },
  },

  redirects: {
    '/proyectos': '/producciones',
    '/en/proyectos': '/en/productions',
    '/proyectos/[...slug]': '/producciones/[...slug]',
    '/en/proyectos/[...slug]': '/en/productions/[...slug]',
  },

  vite: {
    plugins: [tailwindcss()],
  },

  adapter: vercel(),
});