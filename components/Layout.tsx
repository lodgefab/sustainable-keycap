import styled from '@emotion/styled'
import { getAuth } from 'firebase/auth'
import React, { ReactNode, useContext } from 'react'
import { AuthContext, login, logout } from '../lib/auth'
import { color } from '../styles'
import { Footer } from './molecules/Footer'
import { Header } from './molecules/Header'
import CookieConsent from './organisms/CookieConsent'

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
      <CookieConsent />
    </Container>
  )
}

export default Layout

const Container = styled.div`
  background-color: ${color.background.white};
  position: relative;
`
