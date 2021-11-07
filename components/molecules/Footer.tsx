import styled from '@emotion/styled'
import React from 'react'
import { color } from '../../styles'

type Props = {}

export const Footer: React.VFC<Props> = () => {
  return (
    <Wrap>
      <Container>
        <Copyright>(C)Yahoo Japan Corporation. All Rights Reserved.</Copyright>
      </Container>
    </Wrap>
  )
}

const Copyright = styled.p``

const Wrap = styled.div`
  width: 100%;
  height: 128px;
  background: ${color.background.white};
  border-bottom: solid 1px ${color.content.light};
`

const Container = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
  height: 100%;
  max-width: 960px;
  margin: 0 auto;
`
