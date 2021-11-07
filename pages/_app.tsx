import { css, Global } from '@emotion/react'
import emotionReset from 'emotion-reset'
import { appWithTranslation } from 'next-i18next'
import React from 'react'
import Layout from '../components/Layout'
import { AuthProvider } from '../lib/auth'
import { color } from '../styles'

function MyApp({ Component, pageProps }) {
  return (
    <AuthProvider>
      <Global
        styles={css`
          ${emotionReset}
          @import url('https://fonts.googleapis.com/css2?family=Courier+Prime:wght@400;700&display=swap');
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;700&display=swap');
          *,
          html,
          body {
            font-family: 'Montserrat', sans-serif;
            color: ${color.content.dark};
          }
          *,
          *::after,
          *::before {
            box-sizing: border-box;
            -moz-osx-font-smoothing: grayscale;
            -webkit-font-smoothing: antialiased;
            font-smoothing: antialiased;
          }
        `}
      />
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </AuthProvider>
  )
}

export default appWithTranslation(MyApp)
