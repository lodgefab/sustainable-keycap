const domain = process.env.VERCEL_URL || 'localhost:3000'

module.exports = {
  i18n: {
    defaultNS: 'translation',
    localeExtension: 'ts',
    defaultLocale: 'ja',
    locales: ['ja', 'en'],
  },
  domains: [
    {
      domain: `${domain}/en`,
      defaultLocale: 'en',
    },
    {
      domain: `${domain}`,
      defaultLocale: 'ja',
    },
  ],
}
