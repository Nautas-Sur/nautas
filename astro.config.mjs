// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import react from '@astrojs/react';
import keystatic from '@keystatic/astro';

import vercel from '@astrojs/vercel';

// https://astro.build/config
export default defineConfig({
  site: 'https://nautas.org.ar',
  publicDir: './public',
  integrations: [react(), keystatic()],

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