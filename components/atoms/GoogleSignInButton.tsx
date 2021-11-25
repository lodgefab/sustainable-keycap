import styled from '@emotion/styled'
import Head from 'next/head'
import React, { MouseEventHandler } from 'react'
import Button from '@mui/material/Button'
import { Avatar } from '@mui/material'

interface Props {
  onClick: MouseEventHandler<HTMLButtonElement>
}

const GoogleSignInButton: React.VFC<Props> = ({ onClick }) => {
  return (
    <>
      <Head>
        {/* 「Sign in with Google」の文字に使用されているフォント */}
        {/* ログインボタンはGoogle公式のガイドラインでフォントが指定されている */}
        {/* 参考: https://developers.google.com/identity/branding-guidelines */}
        <style data-href='https://fonts.googleapis.com/css2?family=Roboto:wght@500&display=swap' />
      </Head>

      <StyledButton
        startIcon={<Avatar src='/images/login/google_icon.svg' sx={{ width: 20, height: 20 }} />}
        onClick={onClick}
      >
        Sign in with Google
      </StyledButton>
    </>
  )
}

const StyledButton = styled(Button)`
  text-transform: none;
  font-family: 'Roboto', sans-serif;
  font-weight: bold;
  font-size: 15px;
  color: #757575;
  text-align: right;
  padding: 0 20px;
  height: 46px;
  line-height: 46px;
  border: 1px solid #d1d1d1;
  box-shadow: 0 2px 7px #00166733;
`

export default GoogleSignInButton
