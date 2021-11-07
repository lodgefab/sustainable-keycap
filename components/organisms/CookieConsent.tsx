import styled from '@emotion/styled'
import Cookies from 'js-cookie'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

const Wrapper = styled.div<{ isVisible: boolean }>`
  display: ${(props) => (props.isVisible ? 'block' : 'none')};
  position: fixed;
  height: 200px;
  bottom: 0;
  left: 0;
  background: #ffffff;
`

const COOKIE_NAME = 'cookieConsent'

const CookieConsent: React.VFC = () => {
  const [isVisible, setVisibility] = useState<boolean>(false)
  const { t } = useTranslation('translation', { keyPrefix: 'global.cookieConsent' })

  useEffect(() => {
    const currentValue = Cookies.get(COOKIE_NAME)

    // Cookieにユーザーが同意したか拒否したかを保存しているので、'true' か 'false' が入っていたら既に回答したものとしてデフォルトで非表示にする
    if (currentValue !== 'true' && currentValue !== 'false') {
      setVisibility(true)
    }
  }, [])

  const setCookieConsent = (isAccepted: boolean) => {
    Cookies.set(COOKIE_NAME, isAccepted ? 'true' : 'false', {
      sameSite: 'lax',
      expires: 30,
      secure: true,
    })
  }

  const onAccept = () => {
    setCookieConsent(true)
    setVisibility(false)
  }

  const onDecline = () => {
    // TODO: 拒否された時の処理を書く。おそらくGoogle Analyticsによる追跡を止めるとかそういう処理を書くことになりそう
    setCookieConsent(false)
    setVisibility(false)
  }

  return (
    <Wrapper isVisible={isVisible}>
      <p>{t('body')}</p>
      <button onClick={onDecline}>{t('decline')}</button>
      <button onClick={onAccept}>{t('accept')}</button>
    </Wrapper>
  )
}

export default CookieConsent
