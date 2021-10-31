import React, { InputHTMLAttributes, TextareaHTMLAttributes, useState } from 'react'
import styled from '@emotion/styled'
import { InternalFieldName } from 'react-hook-form/dist/types/fields'
import { ChangeHandler, RefCallBack } from 'react-hook-form/dist/types/form'
import ColorPicker from './ColorPicker'

const Form = styled.form`
  padding-top: 60px; // ヘッダーに隠れている部分が見えなくなってしまうのでその分下にずらすための暫定的な対応
`

const FormItem = styled.div`
  margin: 20px auto;
  position: relative;
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
    colorType: InputTagAttributes<InputHTMLAttributes<HTMLInputElement>>
    plasticType: InputTagAttributes<InputHTMLAttributes<HTMLSelectElement>>
    celsius: InputTagAttributes<InputHTMLAttributes<HTMLInputElement>>
    note: InputTagAttributes<TextareaHTMLAttributes<HTMLTextAreaElement>>
  }
  errorMessage: {
    plasticImage: string | null
    keycapImage: string | null
    materialName: string | null
    colorType: string | null
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
  const onClickForm = () => {
    setColorPickerVisibility(false)
  }

  /**
   * 「色の系統」をクリックした時にカラーピッカーを表示する
   */
  const onClickColorForm = (event: React.MouseEvent) => {
    event.stopPropagation() // onClickForm()が実行されないようにイベント伝搬を止める
    setColorPickerVisibility(true)
  }

  return (
    <Form onClick={onClickForm}>
      <FormItem>
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
      </FormItem>

      <FormItem>
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
      </FormItem>

      <FormItem>
        <label htmlFor='material-name'>素材の名前</label>
        <input type='text' id='material-name' required {...inputTagAttributes.materialName} />
        {errorMessage.materialName && (
          <ErrorMessage key='materialName-error'>{errorMessage.materialName}</ErrorMessage>
        )}
      </FormItem>

      <FormItem onClick={onClickColorForm}>
        <label htmlFor='color-type'>色の系統</label>
        <input type='text' id='color-type' {...inputTagAttributes.colorType} readOnly />
        {errorMessage.colorType && (
          <ErrorMessage key='colorType-error'>{errorMessage.colorType}</ErrorMessage>
        )}
        <ColorPickerWrapper style={{ display: isColorPickerVisible ? 'block' : 'none' }}>
          <ColorPicker />
        </ColorPickerWrapper>
      </FormItem>

      <FormItem>
        <label htmlFor='plastic-type'>プラスチックの種類</label>
        <select id='plastic-type' required {...inputTagAttributes.plasticType}>
          <option value=''>選択してください</option>
          <option value='plastic-a'>プラスチックA</option>
          <option value='plastic-b'>プラスチックB</option>
          <option value='plastic-c'>プラスチックC</option>
          <option value='plastic-d'>プラスチックD</option>
        </select>
        {errorMessage.plasticType && (
          <ErrorMessage key='plasticType-error'>{errorMessage.plasticType}</ErrorMessage>
        )}
      </FormItem>

      <FormItem>
        <label htmlFor='celsius'>設定温度</label>
        <input type='text' id='celsius' required {...inputTagAttributes.celsius} />
        {errorMessage.celsius && (
          <ErrorMessage key='celsius-error'>{errorMessage.celsius}</ErrorMessage>
        )}
      </FormItem>

      <FormItem>
        <label htmlFor='note'>備考（制作する際のポイントなど）</label>
        <textarea id='note' {...inputTagAttributes.note} />
        {errorMessage.note && <ErrorMessage key='note'>{errorMessage.note}</ErrorMessage>}
      </FormItem>

      <button type='button' onClick={onClickSubmit} disabled={!canSubmit}>
        登録する
      </button>
    </Form>
  )
}
