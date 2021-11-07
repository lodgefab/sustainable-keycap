import React, { InputHTMLAttributes, TextareaHTMLAttributes, useState } from 'react'
import styled from '@emotion/styled'
import { InternalFieldName } from 'react-hook-form/dist/types/fields'
import { ChangeHandler, RefCallBack } from 'react-hook-form/dist/types/form'
import ColorPicker from './ColorPicker'
import { color, font, media } from '../../styles'
import Image from 'next/image'
import { Button } from '../atoms/Button'

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
  onClickSubmit: React.MouseEventHandler<HTMLButtonElement>
  canSubmit: boolean
}

export const Editor: React.VFC<Props> = ({
  inputTagAttributes,
  errorMessage,
  onClickSubmit,
  canSubmit,
}) => {
  const [isColorPickerVisible, setColorPickerVisibility] = useState<boolean>(false)

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

  return (
    <>
      <FormHeading>
        <a href='' />
        <p>素材を追加する</p>
      </FormHeading>
      <Form onClick={onColorFormBeInActive} onFocus={onColorFormBeInActive}>
        <MaterialWrap>
          <label htmlFor='plastic-image'>廃プラ画像を追加</label>
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
        <KeyUploadWrap>
          <label htmlFor='keycap-image'>キーキャップ画像を追加</label>
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
            <Input
              type='text'
              id='color-type'
              {...inputTagAttributes.hexColor}
              readOnly
              onFocus={onColorFormBeActive}
            />
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
            <Textarea id='note' {...inputTagAttributes.note} />
            {errorMessage.note && <ErrorMessage key='note'>{errorMessage.note}</ErrorMessage>}
          </FormItem>

          <Button type='button' label='登録する' onClick={onClickSubmit} disabled={!canSubmit} />
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

const MaterialWrap = styled.div`
  width: 100%;
  height: 180px;
  input {
    text-indent: -9999px;
    width: 100%;
    height: 100%;
    background-color: ${color.background.bague};
    cursor: pointer;
  }
  label {
    position: absolute;
    top: 0;
    left: 0;
    visibility: hidden;
  }
`

const KeyUploadWrap = styled.div`
  position: relative;
  width: 100%;
  height: 100px;
  label {
    text-indent: -9999px;
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
    /* background-color: ${color.background.bague}; */
    /* text-indent: -9999px; */
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
const Select = styled.select`
  display: block;
  background-color: ${color.background.blue};
  border: 0px;
  border-radius: 4px;
  min-height: 32px;
  width: 100%;
`

const Textarea = styled.textarea`
  display: block;
  background-color: ${color.background.blue};
  border: 0px;
  border-radius: 4px;
  min-height: 32px;
  width: 100%;
`

const ColorPickerWrapper = styled.div`
  position: absolute;
  background: #ffffff;
  z-index: 1;
  top: 40px;
`

const ErrorMessage = styled.p`
  color: #ff0000;
`
