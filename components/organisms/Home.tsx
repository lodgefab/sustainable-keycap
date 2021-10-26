import React, { useContext, useState } from 'react'
import styled from '@emotion/styled'
import { color, font, media } from '../../styles'
import Link from 'next/link'
import Image from 'next/image'
import { MaterialContext } from '../../pages'
import Axios from 'axios'
import { AuthContext } from '../../lib/auth'

type Props = {}

export const Home: React.VFC<Props> = ({}) => {
  const currentUser = useContext(AuthContext)
  const materials = useContext(MaterialContext)

  const [goodCount, setGoodCount] = useState(
    materials.reduce(
      (previous, current) => Object.assign(previous, { [current.id]: current.goodCount }),
      {}
    )
  )
  const [canUpvote, setUpvotability] = useState(
    materials.reduce((previous, current) => Object.assign(previous, { [current.id]: true }), {})
  )

  const upvote = async (materialId: string) => {
    // 二重送信防止
    if (!canUpvote[materialId]) {
      return
    }

    // 未ログイン状態での送信は禁止
    if (!currentUser) {
      return
    }
    const idToken = await currentUser.getIdToken(true)

    setUpvotability({
      ...canUpvote,
      [materialId]: false,
    })

    try {
      const response = await Axios.post(
        '/api/upvote',
        {
          materialId: materialId,
        },
        {
          headers: {
            'content-type': 'application/json',
            Authorization: `Bearer ${idToken}`,
          },
        }
      )

      // @ts-ignore TODO: 型を書く
      if (response.data.newGoodCount) {
        setGoodCount({
          ...goodCount,
          // @ts-ignore
          [materialId]: response.data.newGoodCount,
        })
      }
    } catch (error) {
      // TODO: Upvoteに失敗した場合の処理を書く
      console.error(error)
    }
  }

  return (
    <>
      <main>
        <Hero id='hero' color={'transparent'}>
          <VideoWrap>
            <VideoPlayer>
              <iframe
                src='https://www.youtube.com/embed/bfleByM49CM?autoplay=1&mute=1&playsinline=1&loop=1&playlist=bfleByM49CM&controls=0&disablekb=1'
                frameborder='0'
                allow='accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture'
                allowfullscreen
              ></iframe>
            </VideoPlayer>
            <VideoMask></VideoMask>
          </VideoWrap>
        </Hero>
        <Section id='concept' color={'green'}>
          <h1>#ONECAP</h1>
          <p>
            #ONECAPは、廃棄プラスチックを使ってキーキャップを自作するオープンソースコミュニティです。
          </p>
          <p>
            家庭やオフィスで出るプラゴミを原材料としたユニークなキーキャップを製作すると同時に、その方法や金型のデータを公開し、ワークショップなど通じて、仲間の輪を広げる活動を行なっています。
          </p>
        </Section>
        <Section id='why' color={'purple'}></Section>
        <Section id='workshop' color={'lime'}></Section>
        <Section id='making' color={'Coral'}></Section>
        <Section id='mold' color={'DarkSeaGreen '}></Section>
        <Section id='aboutus' color={'LightSkyBlue '}></Section>
        <Section id='library' color={'Peru'}></Section>

        {materials.length > 0 && ( // 何らかの理由で素材リストが取れなかった時はsection全体を非表示にする
          <section>
            <h2>Library</h2>

            <p>キーキャップに使えそうな素材のライブラリです</p>
            <ul className='filter'>
              <li>Red</li>
              <li>Blue</li>
              <li>Green</li>
              <li>Black</li>
              <li>White</li>
            </ul>

            {materials.map((material) => (
              <div className='material' key={`material-${material.id}`}>
                <Image
                  width={100}
                  height={50}
                  src={material.plasticImageUrl}
                  alt='素材プラスチック画像'
                />
                <Image
                  width={50}
                  height={50}
                  src={material.keycapImageUrl}
                  alt='キーキャップ画像'
                />
                <Link href={`/material/${material.id}`}>
                  <a>{material.materialName}</a>
                </Link>
                <p>{material.colorType}</p>
                <p>{material.plasticType}</p>
                {/* 既にUpvote済み、もしくは未ログインの場合はUpvoteボタンを無効化する */}
                <button
                  onClick={() => upvote(material.id)}
                  disabled={!canUpvote[material.id] || !currentUser}
                >
                  Upvote
                </button>
                {goodCount[material.id] && <p>{goodCount[material.id]}</p>}
              </div>
            ))}

            <Link href='/register'>
              <a>素材を追加する</a>
            </Link>
          </section>
        )}
      </main>

      <footer>{/* TODO: 書く */}</footer>
    </>
  )
}

const Section = styled.section<{ color: string }>`
  padding: 128px 0px;
  width: 100%;
  background-color: ${(props) => `${props.color}`};
`

const Hero = styled(Section)`
  position: relative;
  height: calc(100vw * 2 / 3);
  ${media.mdsp`
    min-height:100vh;
  `}
`

const VideoWrap = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: calc(100vw * 2 / 3);
  height: calc(100vw * 2 / 3);
  background-color: tomato;
`

const VideoMask = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: url('/images/mask.svg');
  background-size: cover;
`

const VideoPlayer = styled.div`
  position: relative;
  height: 100%;
  background: #333333;
  overflow: hidden;
  iframe {
    display: block;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: calc(100vw * 2 / 3);
    height: calc(100vw * 2 / 3);
  }
`
