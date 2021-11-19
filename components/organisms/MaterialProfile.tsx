import React from 'react'
import styled from '@emotion/styled'
import { Material } from '../../types'
import Image from 'next/image'
import Link from 'next/link'
import { color, font, media } from '../../styles'
import { UpvoteButton } from '../atoms/UpvoteButton'

// いいねボタンの状態を表すType
// 'NOT_UPVOTED' => いいね前 / 'UPVOTED' => いいね済 / 'NOT_PERMITTED' => 未ログインなのでいいね操作が許可されていない
type UpvoteButtonState = 'NOT_UPVOTED' | 'UPVOTED' | 'NOT_PERMITTED'

interface Props {
  material: Material
  canUpvote: boolean
  upvote: Function
  upvoteButtonState: UpvoteButtonState
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
    upvoteButtonState,
  } = material

  return (
    <>
      <FormHeading>
        <Link href='/' passHref={true}>
          <a />
        </Link>
        <p>{materialName}</p>
      </FormHeading>
      <Article>
        <MaterialImg bgURL={plasticImageUrl}></MaterialImg>
        <KeyImgArea>
          <KeyImgWrap>
            <Image
              src={keycapImageUrl}
              alt='キーキャップ画像'
              width={100}
              height={100}
              layout={'responsive'}
              objectFit={'cover'}
            />
          </KeyImgWrap>
        </KeyImgArea>
        <InfoWrap>
          <TitleWrap>
            <Title>{materialName}</Title>
            <UpvoteButton
              onClick={(event) => {
                ;() => upvote(id)
              }}
              disabled={!canUpvote}
              width={44}
              count={goodCount}
            />
          </TitleWrap>
          <DL>
            <DT>色の系統</DT>
            <DD>
              {categorisedColor}（{hexColor}）
            </DD>

            <DT>プラスチックの種類</DT>
            <DD>{plasticType}</DD>

            <DT>備考</DT>
            <DD>{note}</DD>
          </DL>
        </InfoWrap>
      </Article>
    </>
  )
}

const Article = styled.article`
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
  min-height: 240px;
  background-image: url('${(props) => props.bgURL}');
  background-size: cover;
  background-position: center center;
  ${media.lg} {
    transform: translateX(calc((100vw - 640px) / 2 * -1));
    min-height: 360px;
  }
`

const KeyImgWrap = styled.div`
  position: absolute;
  left: 50%;
  top: 0;
  transform: translate(-50%, -50%);
  width: 320px;
  height: 320px;
  border-radius: 50%;
  border: 2px solid ${color.content.dark};
  background-color: ${color.background.white};
  overflow: hidden;
  border: ${media.lg} {
    width: 480px;
    height: 480px;
  }
`

const KeyImgArea = styled.div`
  position: relative;
  width: 100%;
  height: 160px;
  ${media.lg} {
    height: 240px;
  }
`

const InfoWrap = styled.div`
  box-sizing: border-box;
  padding: 0 16px;
`

const Title = styled.h1`
  ${font.inter.h1};
  color: ${color.content.dark};
  margin: 0 32px 0 0;
  overflow-wrap: anywhere;
`

const TitleWrap = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  width: 100%;
  margin: 0 0 32px 0;
  ${media.lg} {
    margin: 0 0 64px 0;
  }
`

const DL = styled.dl`
  width: 100%;
  display: flex; /* 子要素のdtとddを横並びにする */
  flex-wrap: wrap; /* 1つのdtとddで1行になるよう改行させる */
  border-top: 1px solid ${color.content.light}; /* テーブルの上の線 */
`

const DT = styled.dt`
  height: 44px;
  width: 180px;
  ${font.inter.label};
  color: ${color.content.dark};
  border-bottom: 1px solid ${color.content.light};
  box-sizing: border-box;
  line-height: 44px;
  ${media.mdsp} {
    width: 160px;
  }
`
const DD = styled.dd`
  width: calc(100% - 180px);
  height: 44px;
  border-bottom: 1px solid ${color.content.light};
  box-sizing: border-box;
  line-height: 44px;
  overflow-wrap: anywhere;
  ${media.mdsp} {
    width: calc(100% - 160px);
  }
`
