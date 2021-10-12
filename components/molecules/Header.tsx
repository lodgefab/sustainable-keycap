import React from 'react'
import styled from '@emotion/styled'
import LogoImg from '../images/logo.png'
import { color, font, media } from '../../styles'
import Image from 'next/image'

type Props = {}

export const Header: React.VFC<Props> = ({}) => {
  return (
    <Wrap>
      <Container>
        <Logo>
          <Image src={LogoImg} alt='logo' />
        </Logo>
        This is Header
      </Container>
    </Wrap>
  )
}

const Wrap = styled.div`
  position: fixed;
  width: 100%;
  height: 56px;
  background: ${color.background.white};
  border-bottom: solid 1px ${color.content.light};
  ${media.mdsp`
        height:44px;
    `}
`

const Container = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
  height: 100%;
  max-width: 960px;
  margin: 0 auto;
  font-family: ${font.mont.body2};
`
const Logo = styled.a`
  img {
    height: 100%;
    width: auto;
  }
`
