import React, { ReactNode, useContext } from 'react'
import styled from '@emotion/styled'
import { color } from '../styles'
import { Header } from './molecules/Header'
import { Footer } from './molecules/Footer'
import { AuthContext, login, logout } from '../lib/auth'
import { getAuth } from 'firebase/auth'
import CookieModule from './organisms/CookieConsent'

type Props = {
  children?: ReactNode
}

const Layout = ({ children }: Props) => {
  const authState = useContext(AuthContext)
  const currentUser = getAuth().currentUser

  return (
    <Container>
      <Header
        currentUser={currentUser}
        authState={authState}
        onLoginFunc={login}
        onLogoutFunc={logout}
      />
      {children}
      <Footer />
      <CookieModule />
    </Container>
  )
}

export default Layout

const Container = styled.div`
  background-color: ${color.background.white};
  position: relative;
`
