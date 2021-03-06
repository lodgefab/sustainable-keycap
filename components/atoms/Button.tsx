import styled from '@emotion/styled'
import { bgcolor } from '@mui/system'
import Image from 'next/image'
import React, { MouseEventHandler } from 'react'
import { color, curve, font, zIndex } from '../../styles'

type Props = {
  label: string
  iconPath?: string
  disabled?: boolean
  className?: string
  onClick?: MouseEventHandler<HTMLButtonElement>
  href?: string
  iconSize?: number
  bgColor?: string
}

export const Button: React.FC<Props> = ({
  label,
  onClick,
  iconPath,
  className,
  disabled,
  href,
  iconSize,
  bgColor,
}) => {
  if (disabled) {
    return (
      <Disabled onClick={onClick} className={className} disabled>
        {label}
      </Disabled>
    )
  }
  {
    /* hrefの有無によって、aタグとhrefタグを使い分ける */
  }
  return href ? (
    <AnchorButton className={className} href={href} target='_blank'>
      {iconPath && (
        <IconContainer>
          <Image
            src={iconPath}
            layout={'fixed'}
            width={iconSize ? iconSize : 24}
            height={iconSize ? iconSize : 24}
            alt='icon'
          />
        </IconContainer>
      )}
      {label}
      <Front bgColor={bgColor} />
      <Back />
    </AnchorButton>
  ) : (
    <ButtonBase type='button' onClick={onClick} className={className}>
      {iconPath && (
        <IconContainer>
          <Image
            src={iconPath}
            layout={'fixed'}
            width={iconSize ? iconSize : 24}
            height={iconSize ? iconSize : 24}
            alt='icon'
          />
        </IconContainer>
      )}
      {label}
      <Front bgColor={bgColor} />
      <Back />
    </ButtonBase>
  )
}
const Front = styled.span<{ bgColor: string | undefined }>`
  position: absolute;
  display: block;
  width: 100%;
  height: 100%;
  border-radius: 4px;
  background-color: ${(props) => (props.bgColor ? props.bgColor : color.subColor.blue)};
  border: 2px solid ${color.primary};
  z-index: ${zIndex.behind};
`

const Back = styled.span`
  width: 100%;
  height: 100%;
  position: absolute;
  top: 5px;
  left: 5px;
  background-color: ${color.primary};
  border-radius: 4px;
  display: block;
  z-index: ${zIndex.back};
  ${curve.button};
`

const ButtonBase = styled.button`
  cursor: pointer;
  position: relative;
  ${font.inter.button}
  padding:0 32px;
  height: 44px;
  line-height: 44px;
  border-radius: 4px;
  border: 0px solid ${color.primary};
  color: ${color.primary};
  width: fit-content;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  z-index: ${zIndex.default};
  overflow: visible;
  &:hover {
    ${Back} {
      top: 0px;
      left: 0px;
    }
  }
`

const Disabled = styled(ButtonBase)`
  background-color: ${color.content.superLight};
  color: ${color.content.middle};
  cursor: not-allowed;
`

const IconContainer = styled.div`
  padding-right: 8px;
  display: flex;
`
const AnchorButton = styled.a`
  cursor: pointer;
  position: relative;
  ${font.inter.button}
  padding:0 32px;
  height: 44px;
  line-height: 44px;
  border-radius: 4px;
  border: 0px solid ${color.primary};
  color: ${color.primary};
  width: fit-content;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  z-index: ${zIndex.default};
  overflow: visible;
  text-decoration: none;
  &:hover {
    ${Back} {
      top: 0px;
      left: 0px;
    }
  }
`
