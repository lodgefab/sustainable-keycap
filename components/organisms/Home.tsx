import React, { useContext } from 'react'
import styled from '@emotion/styled'
import { color, font, media } from '../../styles'
import Link from 'next/link'
import { MaterialContext } from '../../pages'

type Props = {}

export const Home: React.VFC<Props> = ({}) => {
  const materials = useContext(MaterialContext)

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
                <p>{material.materialName}</p>
                <p>{material.colorType}</p>
                <p>{material.plasticType}</p>
                <p>{material.goodCount}</p>
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
