import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: 'mxik',
  base: '/mxik-js/',
  description: 'API Client for tasnif.soliq.uz',
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: 'API Reference', link: '/api' },
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/azabroflovski/mxik-js' },
    ],
  },
})
