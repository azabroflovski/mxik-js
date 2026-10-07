import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: 'MXIK',
  base: '/mxik-js/',
  description: 'API Client for tasnif.soliq.uz',
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: 'Docs', link: '/guide/getting-started' },
      { text: 'API Reference', link: '/api' },
    ],

    sidebar: [
      {
        text: 'Guide',
        items: [
          { text: 'Getting Started', link: '/guide/getting-started' },
          { text: 'Migrating from 1.1', link: '/guide/migration' },
          { text: 'API Reference', link: '/api' },
        ],
      },
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/azabroflovski/mxik-js' },
    ],

    footer: {
      copyright: '&copy; azabroflovski',
    },
  },
})
