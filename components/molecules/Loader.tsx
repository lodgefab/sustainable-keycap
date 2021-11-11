import React from 'react'
import styled from '@emotion/styled'
import { color, zIndex } from '../../styles'
import Image from 'next/image'

type Props = {}

export const Loader: React.VFC<Props> = ({}) => {
  return (
    <Container className='loader'>
      <Image width={400} height={116} src={'/images/logotype_white.svg'} alt='logo' />
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
