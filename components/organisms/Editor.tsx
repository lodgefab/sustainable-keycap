import React from 'react'
import styled from '@emotion/styled'
import { schema } from '../../lib/validation'
import { RegisterForm } from '../../types'
import { SubmitHandler, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import Axios from 'axios'

const Form = styled.form`
  padding-top: 60px; // ヘッダーに隠れている部分が見えなくなってしまうのでその分下にずらすための暫定的な対応
`

const FormItem = styled.div`
  margin: 20px auto;
`

const ErrorMessage = styled.p`
  color: #ff0000;
`

type Props = {}

export const Editor: React.VFC<Props> = ({}) => {
  const {
    register,
    handleSubmit,
    formState: { errors, dirtyFields },
  } = useForm<RegisterForm>({
    mode: 'all',
    resolver: yupResolver(schema, {
      abortEarly: false,
    }),
    criteriaMode: 'all',
  })

  console.log(dirtyFields)

  const filterCelsiusInput = (
    event: React.KeyboardEvent<HTMLInputElement> | React.CompositionEvent<HTMLInputElement>
  ) => {
    if ('key' in event && !['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'].includes(event.key)) {
      event.preventDefault()
      return false
    }

    if ('data' in event && !/^\d+$/.test(event.data)) {
      event.preventDefault()
      return false
    }

    return true
  }

  const executeSubmit: SubmitHandler<RegisterForm> = async (rawData) => {
    const data = new FormData()
    data.append('plasticImage', rawData.plasticImage[0])
    data.append('keycapImage', rawData.keycapImage[0])
    data.append('materialName', rawData.materialName)
    data.append('colorType', rawData.colorType)
    data.append('plasticType', rawData.plasticType)
    data.append('celsius', rawData.celsius.toString())
    data.append('note', rawData.note)

    await Axios.post('/api/register', data, {
      headers: {
        'content-type': 'multipart/form-data',
      },
    })
  }

  return (
    <Form>
      <FormItem>
        <label htmlFor='plastic-image'>廃プラ画像を追加</label>
        <input
          type='file'
          id='plastic-image'
          accept='image/png, image/jpeg'
          required
          {...register('plasticImage', { required: true })}
        />
        {errors.plasticImage && dirtyFields.plasticImage === true && (
          <ErrorMessage key='plasticImage-error'>{errors.plasticImage.message}</ErrorMessage>
        )}
      </FormItem>

      <FormItem>
        <label htmlFor='keycap-image'>キーキャップ画像を追加</label>
        <input
          type='file'
          id='keycap-image'
          accept='image/png, image/jpeg'
          required
          {...register('keycapImage', { required: true })}
        />
        {errors.keycapImage && dirtyFields.keycapImage === true && (
          <ErrorMessage key='keycapImage-error'>{errors.keycapImage.message}</ErrorMessage>
        )}
      </FormItem>

      <FormItem>
        <label htmlFor='material-name'>素材の名前</label>
        <input
          type='text'
          id='material-name'
          required
          {...register('materialName', { required: true })}
        />
        {errors.materialName && dirtyFields.materialName === true && (
          <ErrorMessage key='materialName-error'>{errors.materialName.message}</ErrorMessage>
        )}
      </FormItem>

      <FormItem>
        <label htmlFor='color-type'>色の系統</label>
        <select id='color-type' required {...register('colorType', { required: true })}>
          <option value=''>選択してください</option>
          <option value='red'>赤</option>
          <option value='blue'>青</option>
          <option value='green'>緑</option>
          <option value='black'>黒</option>
          <option value='white'>白</option>
        </select>
        {errors.colorType && dirtyFields.colorType === true && (
          <ErrorMessage key='colorType-error'>{errors.colorType.message}</ErrorMessage>
        )}
      </FormItem>

      <FormItem>
        <label htmlFor='plastic-type'>プラスチックの種類</label>
        <select id='plastic-type' required {...register('plasticType', { required: true })}>
          <option value=''>選択してください</option>
          <option value='plastic-a'>プラスチックA</option>
          <option value='plastic-b'>プラスチックB</option>
          <option value='plastic-c'>プラスチックC</option>
          <option value='plastic-d'>プラスチックD</option>
        </select>
        {errors.plasticType && dirtyFields.plasticType === true && (
          <ErrorMessage key='plasticType-error'>{errors.plasticType.message}</ErrorMessage>
        )}
      </FormItem>

      <FormItem>
        <label htmlFor='celsius'>設定温度</label>
        <input
          type='text'
          id='celsius'
          required
          onKeyPress={filterCelsiusInput}
          {...register('celsius', { required: true, setValueAs: (v) => v.replace(/\D/g, '') })}
        />
        {errors.celsius && dirtyFields.celsius === true && (
          <ErrorMessage key='celsius-error'>{errors.celsius.message}</ErrorMessage>
        )}
      </FormItem>

      <FormItem>
        <label htmlFor='note'>備考（制作する際のポイントなど）</label>
        <textarea id='note' {...register('note')} />
        {errors.note && dirtyFields.note === true && (
          <ErrorMessage key='note'>{errors.note.message}</ErrorMessage>
        )}
      </FormItem>

      <button
        type='button'
        onClick={handleSubmit(executeSubmit)}
        disabled={Object.keys(errors).length !== 0}
      >
        登録する
      </button>
    </Form>
  )
}
