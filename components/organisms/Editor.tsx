import React, { InputHTMLAttributes, TextareaHTMLAttributes, useState } from 'react'
import styled from '@emotion/styled'
import { InternalFieldName } from 'react-hook-form/dist/types/fields'
import { ChangeHandler, RefCallBack } from 'react-hook-form/dist/types/form'
import ColorPicker from './ColorPicker'
import { color, font, media, zIndex } from '../../styles'
import Image from 'next/image'
import { Button } from '../atoms/Button'
import { useFormContext } from 'react-hook-form'
import Link from 'next/link'

type InputTagAttributes<T extends React.HTMLAttributes<HTMLElement>> = T & {
  onChange: ChangeHandler
  onBlur: ChangeHandler
  ref: RefCallBack
  name: InternalFieldName
}

interface Props {
  inputTagAttributes: {
    plasticImage: InputTagAttributes<React.InputHTMLAttributes<HTMLInputElement>>
    keycapImage: InputTagAttributes<InputHTMLAttributes<HTMLInputElement>>
    materialName: InputTagAttributes<InputHTMLAttributes<HTMLInputElement>>
    hexColor: InputTagAttributes<InputHTMLAttributes<HTMLInputElement>>
    plasticType: InputTagAttributes<InputHTMLAttributes<HTMLSelectElement>>
    celsius: InputTagAttributes<InputHTMLAttributes<HTMLInputElement>>
    note: InputTagAttributes<TextareaHTMLAttributes<HTMLTextAreaElement>>
  }
  errorMessage: {
    plasticImage: string | null
    keycapImage: string | null
    materialName: string | null
    hexColor: string | null
    plasticType: string | null
    celsius: string | null
    note: string | null
  }
  previews: {
    keycapImage: string | ArrayBuffer | null
    plasticImage: string | ArrayBuffer | null
  }
  resetImage: (image: 'plasticImage' | 'keycapImage') => void
  onClickSubmit: React.MouseEventHandler<HTMLButtonElement>
  canSubmit: boolean
}

export const Editor: React.VFC<Props> = ({
  inputTagAttributes,
  errorMessage,
  previews,
  resetImage,
  onClickSubmit,
  canSubmit,
}) => {
  const [isColorPickerVisible, setColorPickerVisibility] = useState<boolean>(false)
  const { watch } = useFormContext()
  const currentColor = watch('hexColor')
  const currentPlasticImage = watch('plasticImage')
  const currentKeycapImage = watch('keycapImage')

  /**
   * フォームのどこかをクリックした時にカラーピッカーを非表示にする
   * NOTE: 「色の系統」をクリックした時はonClickColorForm内でstopPropagation()が実行されるのでこの処理は呼び出されない
   */
  const onColorFormBeInActive = () => {
    setColorPickerVisibility(false)
  }

  /**
   * 「色の系統」をクリックした時にカラーピッカーを表示する
   */
  const onColorFormBeActive = (
    event: React.MouseEvent<HTMLDivElement> | React.FocusEvent<HTMLInputElement>
  ) => {
    event.stopPropagation() // onClickForm()が実行されないようにイベント伝搬を止める
    setColorPickerVisibility(true)
  }

  /**
   * 画像をアップした際にプレビューを表示する
   */

  return (
    <>
      <FormHeading>
        <Link href='/' passHref={true}>
          <a />
        </Link>
        <p>素材を追加する</p>
      </FormHeading>
      <Form onClick={onColorFormBeInActive} onFocus={onColorFormBeInActive}>
        <MaterialWrap
          isFilled={currentPlasticImage?.length > 0}
          bgURL={`${previews.plasticImage || inputTagAttributes.plasticImage}`}
        >
          <label
            htmlFor='plastic-image'
            onClick={(e) => {
              if (currentPlasticImage?.length > 0) {
                e.preventDefault()
                resetImage('plasticImage')
              }
            }}
          />
          <input
            type='file'
            id='plastic-image'
            accept='image/png, image/jpeg'
            required
            {...inputTagAttributes.plasticImage}
          />
          {errorMessage.plasticImage && (
            <ErrorMessage key='plasticImage-error'>{errorMessage.plasticImage}</ErrorMessage>
          )}
        </MaterialWrap>
        <KeyUploadWrap
          isFilled={currentKeycapImage?.length > 0}
          imgURL={`${previews.keycapImage || '/images/icons/image.svg'}`}
        >
          <label
            htmlFor='keycap-image'
            onClick={(e) => {
              if (currentKeycapImage?.length > 0) {
                e.preventDefault()
                resetImage('keycapImage')
              }
            }}
          />
          <input
            type='file'
            id='keycap-image'
            accept='image/png, image/jpeg'
            required
            {...inputTagAttributes.keycapImage}
          />
          {errorMessage.keycapImage && (
            <ErrorMessage key='keycapImage-error'>{errorMessage.keycapImage}</ErrorMessage>
          )}
        </KeyUploadWrap>
        <InputWrap>
          <FormItem>
            <Label htmlFor='material-name'>素材の名前</Label>
            <Input type='text' id='material-name' required {...inputTagAttributes.materialName} />
            {errorMessage.materialName && (
              <ErrorMessage key='materialName-error'>{errorMessage.materialName}</ErrorMessage>
            )}
          </FormItem>

          <FormItem onClick={onColorFormBeActive}>
            <Label htmlFor='color-type'>色の系統</Label>
            <ColorInput
              type='text'
              id='color-type'
              {...inputTagAttributes.hexColor}
              readOnly
              onFocus={onColorFormBeActive}
            />
            {currentColor && <ColorSample color={currentColor} />}
            {errorMessage.hexColor && (
              <ErrorMessage key='hexColor-error'>{errorMessage.hexColor}</ErrorMessage>
            )}
            <ColorPickerWrapper style={{ display: isColorPickerVisible ? 'block' : 'none' }}>
              <ColorPicker />
            </ColorPickerWrapper>
          </FormItem>

          <FormItem>
            <Label htmlFor='plastic-type'>プラスチックの種類</Label>
            <Select id='plastic-type' required {...inputTagAttributes.plasticType}>
              <option value=''>選択してください</option>
              <option value='PP'>PP（ポリプロピレン）</option>
              <option value='PE'>PE（ポリエチレン）</option>
              <option value='PS'>PS（ポリスチレン）</option>
            </Select>
            {errorMessage.plasticType && (
              <ErrorMessage key='plasticType-error'>{errorMessage.plasticType}</ErrorMessage>
            )}
          </FormItem>

          <FormItem>
            <Label htmlFor='celsius'>設定温度</Label>
            <Input type='text' id='celsius' required {...inputTagAttributes.celsius} />
            {errorMessage.celsius && (
              <ErrorMessage key='celsius-error'>{errorMessage.celsius}</ErrorMessage>
            )}
          </FormItem>

          <FormItem>
            <Label htmlFor='note'>備考（制作する際のポイントなど）</Label>
            <Textarea id='note' {...inputTagAttributes.note} rows={5} />
            {errorMessage.note && <ErrorMessage key='note'>{errorMessage.note}</ErrorMessage>}
          </FormItem>
          <ButtonWrap>
            <Button label='登録する' onClick={onClickSubmit} disabled={!canSubmit} />
          </ButtonWrap>
        </InputWrap>
      </Form>
    </>
  )
}

const FormHeading = styled.div`
  width: 100%;
  height: 56px;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  border-bottom: solid 0.5px ${color.content.light};
  padding: 0 32px;
  ${media.mdsp} {
    padding: 56px 16px 0;
    height: 112px;
  }
  p {
    color: ${color.content.dark};
    margin: 0 0 0 16px;
    ${font.inter.subtitle1};
  }
  a {
    background-image: url('/images/icons/close.svg');
    background-size: cover;
    background-position: center center;
    width: 24px;
    height: 24px;
  }
`

const MaterialWrap = styled.div<{ bgURL: string; isFilled: boolean }>`
  position: relative;
  width: 100%;
  height: 180px;
  input {
    text-indent: -9999px;
    width: 100%;
    height: 100%;
    background-color: ${color.background.bague};
    cursor: pointer;
    background-image: url(${(props) => props.bgURL});
  }
  label {
    display: block;
    position: absolute;
    top: 8px;
    right: 8px;
    width: 44px;
    height: 44px;
    border-radius: 50%;
    background-color: ${color.content.white};
    background-image: url(${(props) =>
      props.isFilled ? '/images/icons/close.svg' : '/images/icons/camera.svg'});
    background-position: center center;
    background-repeat: no-repeat;
    border: 1px solid ${color.content.light};
    cursor: pointer;
    ${media.lg} {
      right: 64px;
    }
  }

  button {
    position: absolute;
    top: 0;
    left: 0;
  }
`

const KeyUploadWrap = styled.div<{ imgURL: string; isFilled: boolean }>`
  position: relative;
  width: 100%;
  height: 100px;
  label {
    display: block;
    position: absolute;
    bottom: 0;
    right: 50%;
    width: 44px;
    height: 44px;
    border-radius: 50%;
    background-color: ${color.content.white};
    background-image: url(${(props) =>
      props.isFilled ? '/images/icons/close.svg' : '/images/icons/camera.svg'});
    background-position: center center;
    background-repeat: no-repeat;
    border: 1px solid ${color.content.light};
    cursor: pointer;
    z-index: ${zIndex.default};
    transform: translateX(100px);
  }
  input {
    position: absolute;
    top: 0;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 200px;
    height: 200px;
    border-radius: 50%;
    border: solid 2px ${color.primary};
    cursor: pointer;
    background-color: ${color.background.bague};
    background-image: url(${({ imgURL }) => imgURL});
    background-position: center center;
    background-size: 82px 82px;
    background-repeat: no-repeat;
    text-indent: -9999px;
  }

  button {
    position: absolute;
    top: 0;
    left: 0;
  }
`
const InputWrap = styled.div`
  ${media.lg} {
    max-width: 640px;
    margin: 0 auto;
  }
  ${media.mdsp} {
    width: 100%;
    padding: 0 32px;
  }
`

const Form = styled.form`
  width: 100%;
  margin: 0 0 128px 0;
`

const FormItem = styled.div`
  margin: 0 0 32px 0;
  position: relative;
`

const Label = styled.label`
  display: inline-block;
  ${font.inter.label};
  color: ${color.content.dark};
  margin: 0 0 8px 0;
`

const Input = styled.input`
  display: block;
  min-height: 32px;
  width: 100%;
  padding: 0 16px;
  border: 0px;
  border-radius: 4px;
  background-color: ${color.background.blue};
`

const ColorSample = styled.div<{ color: string }>`
  position: absolute;
  top: 32px;
  left: 10px;
  border: 1px solid grey;
  width: 20px;
  height: 20px;
  background-color: ${({ color }) => color};
  border-radius: 50%;
  pointer-events: none;
`

const ColorInput = styled(Input)`
  padding-left: 40px;
`

const Select = styled.select`
  position: relative;
  display: block;
  background-color: ${color.background.blue};
  border: 0px;
  border-radius: 4px;
  min-height: 32px;
  width: 100%;
  padding: 0 16px;
  appearance: none;
  :after {
    content: '';
    display: block;
    width: 16px;
    height: 16px;
    background-image: url('/images/icons/triangle.svg');
    background-size: cover;
    background-position: center;
  }
`

const Textarea = styled.textarea`
  display: block;
  background-color: ${color.background.blue};
  border: 0px;
  border-radius: 4px;
  min-height: 32px;
  width: 100%;
  padding: 0 16px;
  resize: vertical;
`

const ColorPickerWrapper = styled.div`
  position: absolute;
  background: #ffffff;
  z-index: 1;
  top: 60px;
`

const ErrorMessage = styled.p`
  color: #ff0000;
`
const ButtonWrap = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
`
