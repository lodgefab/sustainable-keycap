import React from 'react'
import styled from '@emotion/styled'
// import LogoImg from '../../images/logo.png'
import { color, font, media } from '../../styles'
import Image from 'next/image'
import { User } from 'firebase/auth'
import { AuthStatus, AuthStatusType } from '../../lib/auth'

interface Props {
  currentUser: User | AuthStatusType
  onLoginFunc: Function
  onLogoutFunc: Function
}

export const Header: React.VFC<Props> = ({ currentUser, onLoginFunc, onLogoutFunc }) => {
  return (
    <Wrap>
      <Container>
        {/* TODO: 認証方法を明記する */}
        {currentUser && (
          <p>
            {currentUser.displayName} としてログイン中（
            <a onClick={() => onLogoutFunc()}>ログアウト</a>）
          </p>
        )}
        {currentUser === AuthStatus.NOT_LOGIN && (
          <button onClick={() => onLoginFunc()}>ログイン</button>
        )}
        {/* currentUser === AuthStatus.INITIALING のときはなにも表示させない */}
        <Logo>{/* <Image src={LogoImg} alt='logo' /> */}</Logo>
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
