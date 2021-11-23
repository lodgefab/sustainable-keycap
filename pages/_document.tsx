import Document, { Html, Head, Main, NextScript } from 'next/document'
import React from 'react'

class MyDocument extends Document {
  static async getInitialProps(ctx) {
    const initialProps = await Document.getInitialProps(ctx)
    return { ...initialProps }
  }

  render() {
    return (
      <Html>
        <Head>
          <meta
            name='description'
            content='#ANYCAPは、廃棄プラスチックを使ってキーキャップを自作するオープンソースコミュニティです。家庭やオフィスで出るプラゴミを原材料としたキーキャップを製作し、手法やデータを公開することを通じて、仲間の輪を広げる活動を行なっています。'
          />

          {/* OGP関係タグ */}
          <meta property='og:site_name' content='#ANYCAP' />
          <meta property='og:image' content='/public/images/photos/OGP.jpg' />
          <meta
            property='og:description'
            content='#ANYCAPは、廃棄プラスチックを使ってキーキャップを自作するオープンソースコミュニティです。家庭やオフィスで出るプラゴミを原材料としたキーキャップを製作し、手法やデータを公開することを通じて、仲間の輪を広げる活動を行なっています。'
          />
          <meta property='og:title' content='#ANYCAP' />
          <meta property='og:type' content='website' />
          <meta property='og:url' content='https://anycap.xyz' />
          <meta property='og:locale' content='ja_JP' />
          <meta property='og:locale' content='en_US' />

          {/* Twitter関係タグ */}
          <meta
            name='twitter:description'
            content='#ANYCAPは、廃棄プラスチックを使ってキーキャップを自作するオープンソースコミュニティです。家庭やオフィスで出るプラゴミを原材料としたキーキャップを製作し、手法やデータを公開することを通じて、仲間の輪を広げる活動を行なっています。'
          />
          <meta name='twitter:image' content='/public/images/photos/OGP.jpg' />
          <meta name='twitter:app:country' content='' />
          <meta name='twitter:card' content='jp' />
          <meta name='twitter:title' content='#ANYCAP' />
          {/*<meta name='twitter:site' content='' />*/}

          <link rel='icon' href='/favicon.ico' />
        </Head>

        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}

export default MyDocument
