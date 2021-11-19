import { css, Global } from '@emotion/react'
import React from 'react'
import emotionReset from 'emotion-reset'
import { color } from '../styles'
import Layout from '../components/Layout'
import { AuthProvider } from '../lib/auth'
import { appWithTranslation } from 'next-i18next'
import { PageLoadEventProvider } from '../utils/pageLoadEventContext'

function MyApp({ Component, pageProps }) {
  return (
    <PageLoadEventProvider>
      <AuthProvider>
        <Global
          styles={css`
            @import url('https://fonts.googleapis.com/css2?family=Courier+Prime:wght@400;700&family=Inter:wght@300;400;500;700&display=swap');
            ${emotionReset}
            *,
            html,
            body {
              font-family: 'Inter', sans-serif;
              color: ${color.content.dark};
              overscroll-behavior-y: none;
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
    </PageLoadEventProvider>
  )
}

export default appWithTranslation(MyApp)
