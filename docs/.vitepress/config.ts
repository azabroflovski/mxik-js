import type { DefaultTheme } from 'vitepress'
import { defineConfig } from 'vitepress'
import pkg from '../../packages/mxik/package.json' with { type: 'json' }

const repo = 'https://github.com/azabroflovski/mxik-js'

interface Labels {
  guide: string
  reference: string
  gettingStarted: string
  searching: string
  options: string
  catalog: string
  cache: string
  errors: string
  api: string
  migration: string
  changelog: string
}

function themeConfig(prefix: string, t: Labels): DefaultTheme.Config {
  return {
    nav: [
      { text: t.guide, link: `${prefix}/guide/getting-started`, activeMatch: `${prefix}/guide/` },
      { text: t.api, link: `${prefix}/api` },
      {
        text: `v${pkg.version}`,
        items: [
          { text: t.changelog, link: `${repo}/blob/master/CHANGELOG.md` },
          { text: 'npm', link: 'https://www.npmjs.com/package/mxik' },
        ],
      },
    ],
    sidebar: [
      {
        text: t.guide,
        items: [
          { text: t.gettingStarted, link: `${prefix}/guide/getting-started` },
          { text: t.searching, link: `${prefix}/guide/searching` },
          { text: t.catalog, link: `${prefix}/guide/catalog` },
          { text: t.options, link: `${prefix}/guide/options` },
          { text: t.cache, link: `${prefix}/guide/cache` },
          { text: t.errors, link: `${prefix}/guide/errors` },
        ],
      },
      {
        text: t.reference,
        items: [
          { text: t.api, link: `${prefix}/api` },
          { text: t.migration, link: `${prefix}/guide/migration` },
        ],
      },
    ],
  }
}

export default defineConfig({
  title: 'mxik',
  base: '/mxik-js/',
  cleanUrls: true,
  lastUpdated: true,

  locales: {
    root: {
      label: 'English',
      lang: 'en',
      description: 'JavaScript client for tasnif.soliq.uz: search MXIK (IKPU) codes by keyword, barcode, brand or certificate number.',
      themeConfig: {
        ...themeConfig('', {
          guide: 'Guide',
          reference: 'Reference',
          gettingStarted: 'Getting started',
          searching: 'Searching',
          catalog: 'Catalog',
          options: 'Client options',
          cache: 'Cache',
          errors: 'Errors',
          api: 'API reference',
          migration: 'Migrating from 1.1',
          changelog: 'Changelog',
        }),
        editLink: { pattern: `${repo}/edit/master/docs/:path`, text: 'Edit this page on GitHub' },
        footer: {
          message: 'Unofficial client, not affiliated with the Tax Committee of Uzbekistan or tasnif.soliq.uz.<br>Released under the MIT License.',
          copyright: 'Copyright © 2022-present azabroflovski',
        },
      },
    },

    ru: {
      label: 'Русский',
      lang: 'ru',
      description: 'JavaScript-клиент для tasnif.soliq.uz: поиск кодов ИКПУ (MXIK) по названию, штрихкоду, бренду и номеру сертификата.',
      themeConfig: {
        ...themeConfig('/ru', {
          guide: 'Руководство',
          reference: 'Справочник',
          gettingStarted: 'Начало работы',
          searching: 'Поиск',
          catalog: 'Каталог',
          options: 'Настройки клиента',
          cache: 'Кеш',
          errors: 'Ошибки',
          api: 'Справочник API',
          migration: 'Переход с 1.1',
          changelog: 'Список изменений',
        }),
        editLink: { pattern: `${repo}/edit/master/docs/:path`, text: 'Изменить страницу на GitHub' },
        footer: {
          message: 'Неофициальный клиент, не связан с Налоговым комитетом Узбекистана и tasnif.soliq.uz.<br>Распространяется под лицензией MIT.',
          copyright: '© 2022 – настоящее время, azabroflovski',
        },
        outline: { label: 'На этой странице' },
        docFooter: { prev: 'Предыдущая страница', next: 'Следующая страница' },
        lastUpdated: { text: 'Обновлено' },
        langMenuLabel: 'Язык',
        returnToTopLabel: 'Наверх',
        sidebarMenuLabel: 'Меню',
        darkModeSwitchLabel: 'Тема',
        lightModeSwitchTitle: 'Светлая тема',
        darkModeSwitchTitle: 'Тёмная тема',
        skipToContentLabel: 'Перейти к содержимому',
        notFound: {
          title: 'Страница не найдена',
          quote: 'Возможно, ссылка устарела или в адресе опечатка.',
          linkText: 'На главную',
        },
      },
    },

    uz: {
      label: 'Oʻzbekcha',
      lang: 'uz-Latn',
      description: 'tasnif.soliq.uz uchun JavaScript mijozi: MXIK kodlarini nomi, shtrix-kodi, brendi va sertifikat raqami boʻyicha qidirish.',
      themeConfig: {
        ...themeConfig('/uz', {
          guide: 'Qoʻllanma',
          reference: 'Maʼlumotnoma',
          gettingStarted: 'Boshlash',
          searching: 'Qidiruv',
          catalog: 'Katalog',
          options: 'Mijoz sozlamalari',
          cache: 'Kesh',
          errors: 'Xatolar',
          api: 'API maʼlumotnomasi',
          migration: '1.1 versiyadan oʻtish',
          changelog: 'Oʻzgarishlar roʻyxati',
        }),
        editLink: { pattern: `${repo}/edit/master/docs/:path`, text: 'Sahifani GitHubʼda tahrirlash' },
        footer: {
          message: 'Norasmiy mijoz, Oʻzbekiston Soliq qoʻmitasi va tasnif.soliq.uz bilan bogʻliq emas.<br>MIT litsenziyasi asosida tarqatiladi.',
          copyright: '© 2022 – hozirgacha, azabroflovski',
        },
        outline: { label: 'Ushbu sahifada' },
        docFooter: { prev: 'Oldingi sahifa', next: 'Keyingi sahifa' },
        lastUpdated: { text: 'Yangilangan' },
        langMenuLabel: 'Til',
        returnToTopLabel: 'Yuqoriga',
        sidebarMenuLabel: 'Menyu',
        darkModeSwitchLabel: 'Mavzu',
        lightModeSwitchTitle: 'Yorugʻ mavzu',
        darkModeSwitchTitle: 'Qorongʻi mavzu',
        skipToContentLabel: 'Asosiy mazmunga oʻtish',
        notFound: {
          title: 'Sahifa topilmadi',
          quote: 'Havola eskirgan yoki manzilda xato boʻlishi mumkin.',
          linkText: 'Bosh sahifaga',
        },
      },
    },
  },

  themeConfig: {
    socialLinks: [{ icon: 'github', link: repo }],
    search: {
      provider: 'local',
      options: {
        locales: {
          ru: {
            translations: {
              button: { buttonText: 'Поиск', buttonAriaLabel: 'Поиск' },
              modal: {
                displayDetails: 'Подробный список',
                resetButtonTitle: 'Сбросить',
                backButtonTitle: 'Закрыть',
                noResultsText: 'Ничего не найдено по запросу',
                footer: { selectText: 'выбрать', navigateText: 'перейти', closeText: 'закрыть' },
              },
            },
          },
          uz: {
            translations: {
              button: { buttonText: 'Qidirish', buttonAriaLabel: 'Qidirish' },
              modal: {
                displayDetails: 'Batafsil roʻyxat',
                resetButtonTitle: 'Tozalash',
                backButtonTitle: 'Yopish',
                noResultsText: 'Hech narsa topilmadi',
                footer: { selectText: 'tanlash', navigateText: 'oʻtish', closeText: 'yopish' },
              },
            },
          },
        },
      },
    },
  },
})
