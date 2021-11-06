import React from 'react'
import styled from '@emotion/styled'
// import LogoImg from '../../images/logo.png'
import { color, font, media, zIndex } from '../../styles'
import { User } from 'firebase/auth'
import { AuthStatus } from '../../lib/auth'
import { Link as Scroll } from 'react-scroll'
import Link from 'next/link'

interface Props {
  currentUser: User | null
  authState: AuthStatus
  onLoginFunc: Function
  onLogoutFunc: Function
}

export const Header: React.VFC<Props> = ({ currentUser, authState, onLoginFunc, onLogoutFunc }) => {
  return (
    <Wrap>
      <Container>
        <Left>
          <Logo to='hero' smooth={true} duration={500}></Logo>
          <PageLink to='workshop' smooth={true} duration={500} offset={-100}>
            Workshop
          </PageLink>
          <PageLink to='mold' smooth={true} duration={500} offset={-100}>
            Mold
          </PageLink>
          <PageLink to='aboutus' smooth={true} duration={500} offset={-100}>
            AboutUs
          </PageLink>
          <PageLink to='library' smooth={true} duration={500} offset={-100}>
            Library
          </PageLink>
          <Link passHref href={'https://www.instagram.com/vernacular_cookbook/'}>
            <Insta target='_blank'></Insta>
          </Link>
        </Left>
        {/* TODO: 認証方法を明記する */}
        {authState === 'LOGGED_IN' && currentUser && (
          <p>
            {currentUser.displayName} としてログイン中（
            <a onClick={() => onLogoutFunc()}>ログアウト</a>）
          </p>
        )}
        {authState === 'NOT_LOGIN' && <button onClick={() => onLoginFunc()}>ログイン</button>}
        {/* authState === 'INITIALING' のときはなにも表示させない */}

        <Link scroll={false} href='/' locale='ja'>
          ja
        </Link>
        <Link scroll={false} href='/' locale='en'>
          en
        </Link>
      </Container>
    </Wrap>
  )
}

const Wrap = styled.div`
  position: fixed;
  right: 0;
  width: 56px;
  height: 100vh;
  background: transparent;
  z-index: ${zIndex.header};
  ${media.mdsp`
        height:44px;
        width:100vw;
    `}
`

const Container = styled.div`
  display: flex;
  justify-content: space-between;
  flex-direction: column;
  width: 100%;
  height: 100%;
  margin: 0 auto;
  font-family: ${font.inter.body2};
  ${media.mdsp`
    flex-direction: row;
  `}
`
const Left = styled.div`
  display: flex;
  justify-content: space-between;
  flex-direction: column;
  min-height: 480px;
  align-items: center;
`

const Logo = styled(Scroll)`
  width: 56px;
  height: 56px;
  background-image: url('/images/logo.svg');
  background-position: center;
  background-size: cover;
  background-repeat: no-repeat;
  cursor: pointer;
`
const PageLink = styled(Scroll)`
  transform: rotate(-90deg);
  ${font.courier.subtitle1};
  cursor: pointer;
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
`
const Insta = styled.a`
  width: 24px;
  height: 24px;
  background-image: url('/images/icons/insta.svg');
  background-position: center;
  background-size: cover;
  background-repeat: no-repeat;
`
