import React, { ReactNode } from 'react'
import styled from '@emotion/styled'
import { color, curve, font, media, zIndex } from '../../styles'
import Link from 'next/link'
import Image from 'next/image'

// いいねボタンの状態を表すType
// 'NOT_UPVOTED' => いいね前 / 'UPVOTED' => いいね済 / 'NOT_PERMITTED' => 未ログインなのでいいね操作が許可されていない
type UpvoteButtonState = 'NOT_UPVOTED' | 'UPVOTED' | 'NOT_PERMITTED'

type Props = {
  plasticImageUrl: string
  keycapImageUrl: string
  id: string
  materialName: string
  plasticType: string
  celsius: number
  goodCount: number
  upvoteButtonState: UpvoteButtonState
  upvote: Function
}

export const MaterialItem: React.VFC<Props> = ({
  plasticImageUrl,
  keycapImageUrl,
  id,
  materialName,
  celsius,
  plasticType,
  goodCount,
  upvoteButtonState,
  upvote,
}) => {
  return (
    <Link href={`/material/${id}`} passHref>
      <Container className='material'>
        <BG
          width={100}
          height={100}
          src={plasticImageUrl}
          alt='素材プラスチック画像'
          objectFit='cover'
        />
        <AvatarWrap>
          <Avatar>
            <Image
              width={100}
              height={100}
              layout='intrinsic'
              src={keycapImageUrl}
              alt=' キーキャップ画像'
              objectFit='cover'
            />
          </Avatar>
        </AvatarWrap>
        <Title>{materialName}</Title>
        <InfoWrap>
          <Info>
            <InfoLine>
              <p>素材</p>
              <p>{plasticType}</p>
            </InfoLine>
            <InfoLine>
              <p>加工温度</p>
              <p>{celsius}</p>
            </InfoLine>
          </Info>
          <UpvoteButtonWrap>
            {/* 既にUpvote済み、もしくは未ログインの場合はUpvoteボタンを無効化する */}
            <UpvoteButton
              onClick={(event) => {
                event.stopPropagation()
                upvote(id)
              }}
              disabled={upvoteButtonState === 'UPVOTED' || upvoteButtonState === 'NOT_PERMITTED'}
            />
            <span>{goodCount}</span>
          </UpvoteButtonWrap>
        </InfoWrap>
      </Container>
    </Link>
  )
}

const Container = styled.div`
  display: flex;
  margin: 0 auto;
  padding: 0 0 32px 0;
  flex-direction: column;
  width: 100%;
  border: 2px solid ${color.content.dark};
  border-radius: 8px;
  overflow: hidden;
  background-color: ${color.background.white};
  transform: scale(1);
  ${curve.card};
  cursor: pointer;
  &:hover {
    transform: scale(1.02);
  }
`
const BG = styled(Image)``

const Avatar = styled.div`
  position: absolute;
  left: 50%;
  top: 0%;
  transform: translate(-50%, -50%);
  border: 2px solid ${color.primary};
  border-radius: 50%;
  overflow: hidden;
  background-color: ${color.background.white};
  width: 100px;
  height: 100px;
`

const AvatarWrap = styled.div`
  position: relative;
  width: 100%;
  height: 50px;
`

const Title = styled.h3`
  ${font.inter.h3};
  padding: 0 16px;
  margin: 0 0 16px 0;
  color: ${color.content.dark};
  ${media.mdsp} {
    padding: 0 8px;
  }
`

const InfoWrap = styled.div`
  padding: 0 16px;
  display: flex;
  flex-direction: row;
  ${media.mdsp} {
    padding: 0 8px;
  }
`
const Info = styled.tr`
  flex-grow: 1;
  margin: 0 16px 0 0;
  ${media.mdsp} {
    margin: 0 8px 0 0;
  }
`
const InfoLine = styled.td`
  display: flex;
  justify-content: space-between;
  flex-direction: row;
  border-bottom: solid 1px ${color.content.dark};
  &:first-of-type {
    border-top: solid 1px ${color.content.dark};
  }
  p {
    ${font.inter.overline};
    color: ${color.content.dark};
  }
`
const UpvoteButtonWrap = styled.div`
  position: relative;

  span {
    position: absolute;
    bottom: -50%;
    left: 50%;
    transform: translate(-50%, 0);
    ${font.inter.overline};
    color: ${color.content.dark};
  }
`
const UpvoteButton = styled.button<{ disabled: boolean }>`
  width: 32px;
  height: 32px;
  background-color: ${color.background.dark};
  border-radius: 50%;
  cursor: pointer;
  &:hover {
    :after {
      top: 0px;
      left: 0px;
    }
  }
  :after {
    content: '';
    display: block;
    width: 32px;
    height: 32px;
    position: absolute;
    top: ${(props) => (props.disabled ? 0 : -2)}px;
    left: ${(props) => (props.disabled ? 0 : -2)}px;
    ${curve.button};
    border-radius: 50%;
    border: solid 2px ${color.content.dark};
    background-color: ${(props) => (props.disabled ? color.subColor.blue : color.background.white)};
    background-image: url('/images/icons/thumbs-up.svg');
    background-size: 20px;
    background-position: center center;
    background-repeat: no-repeat;
  }
`
