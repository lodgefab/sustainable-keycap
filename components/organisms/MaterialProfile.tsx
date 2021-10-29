import React from 'react'
import styled from '@emotion/styled'
import { Material } from '../../types'
import Image from 'next/image'

const Article = styled.article`
  padding-top: 60px; // ヘッダーに隠れている部分が見えなくなってしまうのでその分下にずらすための暫定的な対応
`

interface Props {
  material: Material
  canUpvote: boolean
  upvote: Function
}

export const MaterialProfile: React.VFC<Props> = ({ material, canUpvote, upvote }) => {
  const {
    id,
    materialName,
    keycapImageUrl,
    plasticImageUrl,
    goodCount,
    colorType,
    plasticType,
    note,
  } = material

  return (
    <Article>
      <h1>{materialName}</h1>
      <button onClick={() => upvote(id)} disabled={!canUpvote}>
        Upvote
      </button>
      <Image src={keycapImageUrl} alt='キーキャップ画像' width={100} height={50} />
      <Image src={plasticImageUrl} alt='キーキャップ画像' width={50} height={50} />
      <p>{goodCount}</p>
      <dl>
        <dt>色の系統</dt>
        <dd>{colorType}</dd>

        <dt>プラスチックの種類</dt>
        <dd>{plasticType}</dd>

        <dt>備考</dt>
        <dd>{note}</dd>
      </dl>
    </Article>
  )
}
