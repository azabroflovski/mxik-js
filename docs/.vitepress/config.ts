import { defineConfig } from 'vitepress'
import pkg from '../../package.json' with { type: 'json' }

const repo = 'https://github.com/azabroflovski/mxik-js'

export default defineConfig({
  title: 'mxik',
  description: 'Typed JavaScript client for tasnif.soliq.uz: find MXIK (IKPU) codes by keyword, barcode, brand or certificate number.',
  base: '/mxik-js/',
  cleanUrls: true,
  lastUpdated: true,

  themeConfig: {
    nav: [
      { text: 'Guide', link: '/guide/getting-started', activeMatch: '/guide/' },
      { text: 'API reference', link: '/api' },
      {
        text: `v${pkg.version}`,
        items: [
          { text: 'Changelog', link: `${repo}/blob/master/CHANGELOG.md` },
          { text: 'npm', link: 'https://www.npmjs.com/package/mxik' },
        ],
      },
    ],

    sidebar: [
      {
        text: 'Guide',
        items: [
          { text: 'Getting started', link: '/guide/getting-started' },
          { text: 'Searching', link: '/guide/searching' },
          { text: 'Client options', link: '/guide/options' },
          { text: 'Cache', link: '/guide/cache' },
          { text: 'Errors', link: '/guide/errors' },
        ],
      },
      {
        text: 'Reference',
        items: [
          { text: 'API reference', link: '/api' },
          { text: 'Migrating from 1.1', link: '/guide/migration' },
        ],
      },
    ],

    search: { provider: 'local' },

    editLink: {
      pattern: `${repo}/edit/master/docs/:path`,
      text: 'Edit this page on GitHub',
    },

    socialLinks: [
      { icon: 'github', link: repo },
    ],

    footer: {
      message: 'Unofficial client, not affiliated with the State Tax Committee of Uzbekistan or tasnif.soliq.uz.<br>Released under the MIT License.',
      copyright: 'Copyright © 2022-present azabroflovski',
    },
  },
})
