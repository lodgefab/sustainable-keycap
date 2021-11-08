import React from 'react'
import styled from '@emotion/styled'
import { color } from '../../styles'

type Props = {}

export const Footer: React.VFC<Props> = ({}) => {
  return (
    <Wrap>
      <Container>
        <Copyright>Sponsored by LODGE</Copyright>
      </Container>
    </Wrap>
  )
}

const Copyright = styled.p`
  color: ${color.content.middle};
`

const Wrap = styled.div`
  width: 100%;
  height: 128px;
  background: ${color.background.blue};
  border-bottom: solid 1px ${color.content.light};
`

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  max-width: 990px;
  margin: 0 auto;
`
