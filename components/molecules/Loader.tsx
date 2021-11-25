import React from 'react'
import styled from '@emotion/styled'
import { color, media, zIndex } from '../../styles'

type Props = {}

export const Loader: React.VFC<Props> = ({}) => {
  return (
    <Container className='loader'>
      <APNG src={'/images/loader.png'} alt='logo' />
    </Container>
  )
}

const Container = styled.div`
  position: fixed;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100vw;
  height: 100vh;
  background-color: ${color.background.dark};
  z-index: ${zIndex.loader};
  overflow: hidden;
`
const APNG = styled.img`
  width: 320px;
  height: 320px;
  ${media.mdsp} {
    width: 180px;
    height: 180px;
  }
`
