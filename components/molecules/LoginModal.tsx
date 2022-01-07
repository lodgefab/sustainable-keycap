import React from 'react'
import styled from '@emotion/styled'
import { login } from '../../lib/auth'
import GoogleSignInButton from '../atoms/GoogleSignInButton'
import { useTranslation } from 'next-i18next'

interface Props {
  isActive: boolean
  deActivate: () => void
}

const LoginModal: React.VFC<Props> = ({ isActive, deActivate }) => {
  const { t } = useTranslation('translation', { keyPrefix: 'login' })

  return (
    <Wrapper isVisible={isActive} onClick={deActivate}>
      <Contents
        onClick={(e) => {
          e.stopPropagation()
        }}
      >
        {t('text')}
        <GoogleSignInButton onClick={login} />
      </Contents>
    </Wrapper>
  )
}

const Wrapper = styled.div<{ isVisible: boolean }>`
  visibility: ${({ isVisible }) => (isVisible ? 'visible' : 'hidden')};
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10;
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.2);
`

const Contents = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  align-items: center;
  background-color: #ffffff;
  box-shadow: 0 3px 10px #00166733;
  width: 500px;
  height: 300px;
  border-radius: 10px;
  padding: 30px;
  text-align: center;
`

export default LoginModal
