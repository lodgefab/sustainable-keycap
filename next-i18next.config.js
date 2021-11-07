const path = require('path')

const domain = process.env.VERCEL_URL || 'localhost:3000'

module.exports = {
  i18n: {
    defaultNS: 'translation',
    localeExtension: 'ts',
    defaultLocale: 'ja',
    locales: ['ja', 'en'],
  },
  localePath: path.resolve('./public/locales'),
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
