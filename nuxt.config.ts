// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  ssr: false,

  modules: ['@nuxtjs/mcp-toolkit'],

  imports: {
    dirs: ['types'],
  },

  mcp: {
    name: 'Tuesday PM',
    route: '/mcp',
  },

  app: {
    head: {
      title: 'Tuesday',
      meta: [
        { name: 'description', content: 'AI-First Project Management Platform' },
      ],
      link: [
        {
          rel: 'preconnect',
          href: 'https://fonts.googleapis.com',
        },
        {
          rel: 'preconnect',
          href: 'https://fonts.gstatic.com',
          crossorigin: '',
        },
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;1,9..40,400&family=Figtree:wght@400;500;600;700&display=swap',
        },
      ],
    },
  },

  css: ['~/assets/css/main.css'],
  nitro: {
    experimental: {
      websocket: true,
    },
  },
})
