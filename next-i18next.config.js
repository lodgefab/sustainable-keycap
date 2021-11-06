module.exports = {
  i18n: {
    defaultNS: 'translation',
    localeExtension: 'json',
    defaultLocale: 'ja',
    locales: ['ja', 'en'],
  },
  domains: [
    {
      domain: 'localhost:3000/en',
      defaultLocale: 'en',
    },
    {
      domain: 'localhost:3000',
      defaultLocale: 'ja',
    },
  ],
}
