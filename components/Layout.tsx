import React, { ReactNode, useContext, useEffect } from 'react'
import styled from '@emotion/styled'
import { color } from '../styles'
import { Header } from './molecules/Header'
import { Footer } from './molecules/Footer'
import { AuthContext, getCurrentUser, login, logout } from '../lib/auth'

type Props = {
  children?: ReactNode
}

const Layout = ({ children }: Props) => {
  const currentUser = useContext(AuthContext)

  return (
    <Container>
      <Header currentUser={currentUser} onLoginFunc={login} onLogoutFunc={logout} />
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
