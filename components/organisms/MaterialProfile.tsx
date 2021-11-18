import React from 'react'
import styled from '@emotion/styled'
import { Material } from '../../types'
import Image from 'next/image'
import Link from 'next/link'
import { color, font, media } from '../../styles'

const Article = styled.article`
  width: 100vw;
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
    hexColor,
    categorisedColor,
    plasticType,
    note,
  } = material

  return (
    <>
      <FormHeading>
        <Link href='/' passHref={true}>
          <a />
        </Link>
        <p>{materialName}</p>
      </FormHeading>
      <ItemArticle>
        <MaterialImg bgURL={plasticImageUrl}></MaterialImg>
        <KeyImgWrap>
          <Image src={keycapImageUrl} alt='キーキャップ画像' width={100} height={50} />
        </KeyImgWrap>
        <h1>{materialName}</h1>
        <button onClick={() => upvote(id)} disabled={!canUpvote}>
          Upvote
        </button>
        <Image src={plasticImageUrl} alt='キーキャップ画像' width={50} height={50} />
        <p>{goodCount}</p>
        <dl>
          <dt>色の系統</dt>
          <dd>
            {categorisedColor}（{hexColor}）
          </dd>

          <dt>プラスチックの種類</dt>
          <dd>{plasticType}</dd>

          <dt>備考</dt>
          <dd>{note}</dd>
        </dl>
      </ItemArticle>
    </>
  )
}

const ItemArticle = styled.article`
  width: 100%;
  ${media.lg} {
    max-width: 640px;
    margin: 0 auto;
  }
`

const FormHeading = styled.div`
  width: 100%;
  height: 56px;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  border-bottom: solid 0.5px ${color.content.light};
  padding: 0 32px;
  ${media.mdsp} {
    padding: 56px 32px 0;
    height: 112px;
  }
  p {
    color: ${color.content.dark};
    margin: 0 0 0 16px;
    ${font.inter.subtitle1};
  }
  a {
    background-image: url('/images/icons/arrow-left.svg');
    background-size: cover;
    background-position: center center;
    width: 24px;
    height: 24px;
  }
`

const MaterialImg = styled.div<{ bgURL: string }>`
  width: 100vw;
  min-height: 180px;
  background-image: url('${(props) => props.bgURL}');
  background-size: cover;
  background-position: center center;
  ${media.lg} {
    transform: translateX(calc((100vw - 640px) / 2 * -1));
    min-height: 360px;
  }
`

const KeyImgWrap = styled.div`
  width: 320px;
`
