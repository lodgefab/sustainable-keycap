import React, { ReactNode, useCallback, useContext, useEffect, useRef } from 'react'
import styled from '@emotion/styled'
import { color } from '../styles'
import { Header } from './molecules/Header'
import { Footer } from './molecules/Footer'
import { AuthContext, login, logout } from '../lib/auth'
import { getAuth } from 'firebase/auth'
import { useWindowSize } from '../utils/useWindowSize'

type Props = {
  children?: ReactNode
}

const Layout = ({ children }: Props) => {
  const authState = useContext(AuthContext)
  const currentUser = getAuth().currentUser

  const containerRef = useRef<HTMLDivElement>(null)

  const size = useWindowSize()
  const data = {
    ease: 0.1,
    curr: 0,
    prev: 0,
    rounded: 0,
  }
  const setBodyHeight = () => {
    document.body.style.height = `${containerRef.current?.getBoundingClientRect().height}px`
  }

  // prev と currentのスクロール量の差分を徐々に無くしていく
  const smoothScroll = useCallback(() => {
    data.curr = window.scrollY
    data.prev += (data.curr - data.prev) * data.ease
    data.rounded = Math.round(data.prev * 100) / 100
    containerRef.current!.style.transform = `translateY(-${data.rounded}px)`
    requestAnimationFrame(() => smoothScroll())
  }, [data])

  useEffect(() => {
    requestAnimationFrame(() => smoothScroll())
  })

  useEffect(() => {
    setBodyHeight()
  }, [size.height])

  return (
    <Wrap>
      <Header
        currentUser={currentUser}
        authState={authState}
        onLoginFunc={login}
        onLogoutFunc={logout}
      />
      <Container ref={containerRef}>
        {children}
        <Footer />
      </Container>
    </Wrap>
  )
}

export default Layout

const Container = styled.div`
  background-color: ${color.background.white};
  position: relative;
`

const Wrap = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  overflow: hidden;
`
