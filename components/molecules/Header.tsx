import React from 'react'
import styled from '@emotion/styled'
// import LogoImg from '../../images/logo.png'
import { color, font, media } from '../../styles'
import { User } from 'firebase/auth'
import { AuthStatus, AuthStatusType } from '../../lib/auth'
import { Link as Scroll } from 'react-scroll'

interface Props {
  currentUser: User | AuthStatusType
  onLoginFunc: Function
  onLogoutFunc: Function
}

export const Header: React.VFC<Props> = ({ currentUser, onLoginFunc, onLogoutFunc }) => {
  return (
    <Wrap>
      <Container>
        <Logo href={'/'}>{/* <Image src={LogoImg} alt='logo' /> */}</Logo>
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
  font-family: ${font.mont.body2};
  ${media.mdsp`
    flex-direction: row;
  `}
`
const Logo = styled.a`
  width: 56px;
  height: 56px;
  background-image: url() ('/public/images/logo.svg');
`
const PageLink = styled(Scroll)`
  transform: rotate(-90deg);
  ${font.courier.subtitle1};
  cursor: pointer;
`
