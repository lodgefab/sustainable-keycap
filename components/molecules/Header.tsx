import React, { useState } from 'react'
import styled from '@emotion/styled'
// import LogoImg from '../../images/logo.png'
import { color, font, media, zIndex } from '../../styles'
import { User } from 'firebase/auth'
import { AuthStatus } from '../../lib/auth'
import { Link as Scroll } from 'react-scroll'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useTranslation } from 'react-i18next'

interface Props {
  currentUser: User | null
  authState: AuthStatus
  onLoginFunc: Function
  onLogoutFunc: Function
}

export const Header: React.VFC<Props> = ({ currentUser, authState, onLoginFunc, onLogoutFunc }) => {
  const [isLoginMenuOpen, setLoginMenuOpen] = useState(false)
  const [isMenuOpen, setMenuOpen] = useState(false)
  const { i18n } = useTranslation()
  const handleLoginMenuBlur = (e) => {
    // firefox onBlur issue workaround
    if (
      e.nativeEvent.explicitOriginalTarget &&
      e.nativeEvent.explicitOriginalTarget === e.nativeEvent.originalTarget
    ) {
      return
    }
    if (isLoginMenuOpen) {
      setTimeout(() => {
        setLoginMenuOpen(false)
      }, 100)
    }
  }

  const handleMenuBlur = (e) => {
    // firefox onBlur issue workaround
    if (
      e.nativeEvent.explicitOriginalTarget &&
      e.nativeEvent.explicitOriginalTarget === e.nativeEvent.originalTarget
    ) {
      return
    }
    if (isMenuOpen) {
      setTimeout(() => {
        setMenuOpen(false)
      }, 100)
    }
  }
  const router = useRouter()
  const { pathname, asPath, query } = router

  const changeLanguage = (nextLanguage: string) => {
    router.push({ pathname, query }, asPath, { locale: nextLanguage, scroll: false })
  }

  return (
    <Wrap>
      <Container>
        <Left>
          <Logo to='hero' smooth={true} duration={500}></Logo>
          <PageLinks>
            <PageLink to='workshop' smooth={true} duration={500} offset={72}>
              Workshop
            </PageLink>
            <PageLink to='mold' smooth={true} duration={500} offset={72}>
              Mold
            </PageLink>
            <PageLink to='aboutus' smooth={true} duration={500} offset={72}>
              AboutUs
            </PageLink>
            <PageLink to='library' smooth={true} duration={500} offset={72}>
              Library
            </PageLink>
            <Link passHref href={'https://www.instagram.com/vernacular_cookbook/'}>
              <Insta target='_blank'></Insta>
            </Link>
          </PageLinks>
        </Left>
        <Right>
          <TranslateButton
            isJa={i18n.language == 'ja'}
            onClick={() => {
              i18n.language == 'ja' ? changeLanguage('en') : changeLanguage('ja')
            }}
          />

          {/* TODO: 認証方法を明記する */}
          {authState === 'LOGGED_IN' && currentUser && (
            <LoggedInIcon
              onClick={() => setLoginMenuOpen(!isLoginMenuOpen)}
              onBlur={handleLoginMenuBlur}
              bgURL={currentUser.photoURL && currentUser.photoURL}
            >
              {isLoginMenuOpen && <AvatarMenu onClick={() => onLogoutFunc()}>Logout</AvatarMenu>}
            </LoggedInIcon>
          )}
          {authState === 'NOT_LOGIN' && (
            <LoggedOutIcon onClick={() => onLoginFunc()}></LoggedOutIcon>
          )}
          {/* authState === 'INITIALING' のときはなにも表示させない */}
          <HamburgerMenu onClick={() => setMenuOpen(!isMenuOpen)} onBlur={handleMenuBlur}>
            {isMenuOpen && (
              <MenuLists>
                <MenuList to='workshop' smooth={true} duration={500} offset={72}>
                  Workshop
                </MenuList>
                <MenuList to='mold' smooth={true} duration={500} offset={72}>
                  Mold
                </MenuList>
                <MenuList to='aboutus' smooth={true} duration={500} offset={72}>
                  AboutUs
                </MenuList>
                <MenuList to='library' smooth={true} duration={500} offset={72}>
                  Library
                </MenuList>
                <Link passHref href={'https://www.instagram.com/vernacular_cookbook/'}>
                  <Insta target='_blank'></Insta>
                </Link>
              </MenuLists>
            )}
          </HamburgerMenu>
        </Right>
      </Container>
    </Wrap>
  )
}

const Wrap = styled.div`
  position: fixed;
  right: 0;
  width: 56px;
  height: 100vh;
  padding: 0 0 64px 0;
  background: transparent;
  z-index: ${zIndex.header};
  ${media.mdsp} {
    top: 0;
    left: 0;
    height: 56px;
    width: 100%;
    padding: 0 32px;
  }
`

const Container = styled.div`
  display: flex;
  justify-content: space-between;
  flex-direction: column;
  width: 100%;
  margin: 0 auto;
  font-family: ${font.inter.body2};
  ${media.lg} {
    height: 100%;
  }
  ${media.mdsp} {
    flex-direction: row;
    height: 100%;
  }
`
const Left = styled.div`
  display: flex;
  justify-content: space-between;
  flex-direction: column;
  align-items: center;
  ${media.lg} {
    min-height: 480px;
  }
  ${media.mdsp} {
    justify-content: center;
  }
`

const Logo = styled(Scroll)`
  width: 56px;
  height: 56px;
  background-image: url('/images/logo.svg');
  background-position: center;
  background-size: cover;
  background-repeat: no-repeat;
  cursor: pointer;
  ${media.mdsp} {
    width: 151px;
    height: 44px;
    background-image: url('/images/logotype.svg');
  }
`
const PageLinks = styled.div`
  display: contents;
  ${media.mdsp} {
    display: none;
  }
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
const Right = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-end;

  ${media.mdsp} {
    flex-direction: row;
  }
`
const TranslateButton = styled.button<{ isJa: boolean }>`
  width: 32px;
  height: 42px;
  margin: 0 0 24px 0;
  background-color: transparent;
  border: 0px;
  background-image: url(${(props) =>
    props.isJa ? '/images/icons/ja.svg' : '/images/icons/en.svg'});
  background-size: contain;
  background-position: center center;
  cursor: pointer;
  ${media.mdsp} {
    display: none;
    height: 32px;
    width: 24px;
    margin: 0 24px 0 0;
  }
`

const LoggedInIcon = styled.button<{ bgURL: string | null }>`
  position: relative;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: solid 2px ${color.primary};
  background-color: ${color.subColor.blue};
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  background-image: url(${(props) => `${props.bgURL}`});
  background-size: cover;
  ${media.mdsp} {
    width: 32px;
    height: 32px;
    margin: 0 16px 0 0;
  }
`

const AvatarMenu = styled.a`
  position: absolute;
  top: 120%;
  right: 0;
  padding: 8px 16px;
  background: ${color.background.white};
  border: 2px solid ${color.primary};
  border-radius: 4px;
  ${font.courier.subtitle2};
  cursor: pointer;
  width: 90px;
`
const LoggedOutIcon = styled.button`
  position: relative;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: 2px solid ${color.primary};
  background-color: ${color.background.white};
  cursor: pointer;
  background-image: url('/images/icons/login.svg');
  background-position: center;
  background-size: 32px 32px;
  background-repeat: no-repeat;
  ${media.mdsp} {
    width: 32px;
    height: 32px;
    background-size: 24px 24px;
    margin: 0 16px 0 0;
  }
`

const HamburgerMenu = styled.button`
  position: relative;
  width: 32px;
  height: 32px;
  border: 0px;
  background-color: transparent;
  background-image: url('/images/icons/hamburger.svg');
  background-position: center;
  background-size: 32px 32px;
  background-repeat: no-repeat;
  ${media.lg} {
    display: none;
  }
`

const MenuLists = styled.ul`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  position: absolute;
  top: 120%;
  right: 0;
  padding: 16px 16px 16px;
  background: ${color.background.white};
  border: 2px solid ${color.primary};
  border-radius: 4px;
  ${font.courier.subtitle2};
`
const MenuList = styled(Scroll)`
  padding: 8px 0px;
`
