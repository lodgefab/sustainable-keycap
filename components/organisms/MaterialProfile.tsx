import React from 'react'
import styled from '@emotion/styled'
import { Material } from '../../types'
import Image from 'next/image'

const Article = styled.article`
  padding-top: 60px; // ヘッダーに隠れている部分が見えなくなってしまうのでその分下にずらすための暫定的な対応
`

interface Props {
  data: Material
}

export const MaterialProfile: React.VFC<Props> = ({ data }) => {
  return (
    <Article>
      <h1>{data.materialName}</h1>
      <Image src={data.keycapImageUrl} alt='キーキャップ画像' width={100} height={50} />
      <Image src={data.plasticImageUrl} alt='キーキャップ画像' width={50} height={50} />
      <p>{data.goodCount}</p>
      <dl>
        <dt>色の系統</dt>
        <dd>{data.colorType}</dd>

        <dt>プラスチックの種類</dt>
        <dd>{data.plasticType}</dd>

        <dt>備考</dt>
        <dd>{data.note}</dd>
      </dl>
    </Article>
  )
}
