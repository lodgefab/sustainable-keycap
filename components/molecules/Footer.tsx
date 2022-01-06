import React from 'react'
import styled from '@emotion/styled'
import { color } from '../../styles'

type Props = {
  className: string
}

export const Footer: React.VFC<Props> = ({ className }) => {
  return (
    <Wrap className={className}>
      <Container>
        <Copyright>
          Powered by{' '}
          <a href='https://www.instagram.com/toaster_zine/' rel='noreferrer' target='_blank'>
            Toaster
          </a>
        </Copyright>
      </Container>
    </Wrap>
  )
}

const Copyright = styled.p`
  color: ${color.content.middle};
  a {
    color: ${color.content.middle};
  }
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
