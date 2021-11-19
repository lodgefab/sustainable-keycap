import styled from '@emotion/styled'
import Image from 'next/image'
import React, { MouseEventHandler } from 'react'
import { color, curve, font, zIndex } from '../../styles'

type Props = {
  disabled?: boolean
  onClick?: MouseEventHandler<HTMLButtonElement>
  count?: number
  width?: number
}

export const UpvoteButton: React.FC<Props> = ({ disabled, onClick, count, width }) => {
  return (
    <Wrap>
      <Container onClick={onClick} disabled={disabled ? true : false} width={width ? width : 32} />
      <span>{count}</span>
    </Wrap>
  )
}

const Container = styled.button<{ disabled: boolean; width: number }>`
  width: ${(props) => props.width}px;
  height: ${(props) => props.width}px;
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
    width: ${(props) => props.width}px;
    height: ${(props) => props.width}px;
    position: absolute;
    top: ${(props) => (props.disabled ? 0 : -2)}px;
    left: ${(props) => (props.disabled ? 0 : -2)}px;
    ${curve.button};
    border-radius: 50%;
    border: solid 2px ${color.content.dark};
    background-color: ${(props) => (props.disabled ? color.subColor.blue : color.background.white)};
    background-image: url('/images/icons/thumbs-up.svg');
    background-size: ${(props) => props.width * 0.625}px;
    background-position: center center;
    background-repeat: no-repeat;
  }
`

const Wrap = styled.div`
  position: relative;

  span {
    position: absolute;
    bottom: 0%;
    left: 50%;
    transform: translate(-50%, 0);
    ${font.inter.overline};
    color: ${color.content.dark};
  }
`
