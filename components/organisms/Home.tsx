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
      <header>
        <h1>#ONECAP</h1>
        <p>
          #ONECAPは、廃棄プラスチックを使ってキーキャップを自作するオープンソースコミュニティです。
        </p>
        <p>
          家庭やオフィスで出るプラゴミを原材料としたユニークなキーキャップを製作すると同時に、その方法や金型のデータを公開し、ワークショップなど通じて、仲間の輪を広げる活動を行なっています。
        </p>
      </header>
      <main>
        <section>
          <h2>ONECAPの特徴</h2>
          <ul>
            <li>recyclable</li>
            <li>unique texture</li>
            <li>circular design</li>
            <li>produced locally</li>
          </ul>
        </section>

        <section>
          <h2>Resource</h2>
          <p>金型のデータを公開し、同様の活動を行おうとする人を応援します</p>

          <Link href='#'>
            <a>金型データをDLする</a>
          </Link>
        </section>

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
                <img width={100} src={material.plasticImageUrl} alt='素材プラスチック画像' />
                <img width={50} src={material.keycapImageUrl} alt='キーキャップ画像' />
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
