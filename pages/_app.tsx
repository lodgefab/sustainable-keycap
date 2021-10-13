import { css, Global } from '@emotion/react'
import React from 'react'
import emotionReset from 'emotion-reset'
import { color } from '../styles'
import Layout from '../components/Layout'

function MyApp({ Component, pageProps }) {
  return (
    <>
      <Global
        styles={css`
          ${emotionReset}
          @import url('https://fonts.googleapis.com/css2?family=Noto+Serif+JP:wght@200;300;400;500;600;700&display=swap');
          @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700&display=swap');
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
    </>
  )
}

export default MyApp
