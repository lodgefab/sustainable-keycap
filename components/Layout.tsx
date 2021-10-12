import React, { ReactNode, useEffect } from 'react'
import styled from '@emotion/styled'
import { color } from '../styles'
import { Header } from './molecules/Header'
import { Footer } from './molecules/Footer'

type Props = {
  children?: ReactNode
}

const Layout = ({ children }: Props) => {
  return (
    <Container>
      <Header />
      {children}
      <Footer />
    </Container>
  )
}

export default Layout

const Container = styled.div`
  background-color: ${color.background.white};
  position: relative;
`
