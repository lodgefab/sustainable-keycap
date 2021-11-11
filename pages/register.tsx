import Head from 'next/head'
import { InferGetStaticPropsType, NextPage } from 'next'
import React, { useContext, useEffect, useState } from 'react'
import { Editor } from '../components/organisms/Editor'
import { FormProvider, SubmitHandler, useForm } from 'react-hook-form'
import { RegisterForm } from '../types'
import { yupResolver } from '@hookform/resolvers/yup'
import { schema } from '../lib/validation'
import Axios from 'axios'
import { useRouter } from 'next/router'
import { AuthContext, login } from '../lib/auth'
import { getAuth } from 'firebase/auth'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { readAsDataURL } from '../lib/helper'

type Props = InferGetStaticPropsType<typeof getStaticProps>

export const getStaticProps = async ({ locale }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['translation'])),
    },
  }
}

export const Register: NextPage<Props> = (_) => {
  const authState = useContext(AuthContext)
  const currentUser = getAuth().currentUser
  const router = useRouter()
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  // フォームで選択されたプラスチック画像のBase64文字列を管理するState
  const [plasticImageObjectUrl, setPlasticImageObjectUrl] = useState<string | ArrayBuffer | null>(
    null
  )
  // フォームで選択されたキーキャップ画像のBase64文字列を管理するState
  const [keycapImageObjectUrl, setKeycapImageObjectUrl] = useState<string | ArrayBuffer | null>(
    null
  )

  const methods = useForm<RegisterForm>({
    mode: 'all',
    resolver: yupResolver(schema, {
      abortEarly: false,
    }),
    criteriaMode: 'all',
  })
  const {
    register,
    watch,
    handleSubmit,
    formState: {
      errors, // 各入力項目に対して検出されたエラーメッセージが格納されたオブジェクト
      dirtyFields, // ユーザーによる入力が発生した入力項目を管理したオブジェクト
      isSubmitted, // ユーザーが登録ボタンを押したかどうか
    },
  } = methods

  const watchPlasticImageUrl = watch('plasticImage')
  const watchKeycapImageUrl = watch('keycapImage')

  /**
   * フォームでプラスチック画像が選択された時に、その画像をプレビュー表示するためにBase64形式に変換してStateに保存する
   */
  useEffect(() => {
    ;(async () => {
      if (watchPlasticImageUrl === undefined || watchPlasticImageUrl.length === 0) {
        return
      } else {
        const objectUrl = await readAsDataURL(watchPlasticImageUrl[0])
        setPlasticImageObjectUrl(objectUrl)
      }
    })()
  }, [watchPlasticImageUrl])

  /**
   * フォームでキーキャップ画像が選択された時に、その画像をプレビュー表示するためにBase64形式に変換してStateに保存する
   */
  useEffect(() => {
    ;(async () => {
      if (watchKeycapImageUrl === undefined || watchKeycapImageUrl.length === 0) {
        return
      } else {
        const objectUrl = await readAsDataURL(watchKeycapImageUrl[0])
        setKeycapImageObjectUrl(objectUrl)
      }
    })()
  }, [watchKeycapImageUrl])

  /**
   * 設定温度を入力するフォームで数字以外の入力を弾くためのフィルタリング処理
   */
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

  /**
   * react-hook-formを用いてフォーム入力を制御するために各Inputタグに設定するAttribute
   */
  const inputTagAttributes = {
    plasticImage: register('plasticImage', { required: true }),
    keycapImage: register('keycapImage', { required: true }),
    materialName: register('materialName', { required: true }),
    hexColor: register('hexColor', { required: true }),
    plasticType: register('plasticType', { required: true }),
    celsius: {
      onKeyPress: filterCelsiusInput,
      ...register('celsius', { required: true, setValueAs: (v) => v.replace(/\D/g, '') }),
    },
    note: register('note'),
  }

  /**
   * 送信ボタンを押した時の送信処理
   * @param rawData ユーザーがフォームに入力した情報
   */
  const executeSubmit: SubmitHandler<RegisterForm> = async (rawData) => {
    // 未ログイン状態での送信は禁止
    if (!currentUser) {
      return
    }

    const data = new FormData()
    data.append('plasticImage', rawData.plasticImage[0])
    data.append('keycapImage', rawData.keycapImage[0])
    data.append('materialName', rawData.materialName)
    data.append('hexColor', rawData.hexColor)
    data.append('plasticType', rawData.plasticType)
    data.append('celsius', rawData.celsius.toString())
    data.append('note', rawData.note)

    const idToken = await currentUser.getIdToken(true)

    const response = await Axios.post('/api/register', data, {
      headers: {
        'content-type': 'multipart/form-data',
        Authorization: `Bearer ${idToken}`,
      },
    })

    if (response.status === 200) {
      await router.push({
        // @ts-ignore TODO: 型を書く
        pathname: `/material/${response.data.materialId}`,
        query: { action: 'register' },
      })
    } else {
      setErrorMessage('投稿に失敗しました。時間を置いてやり直してください。')
    }
  }

  // バリデーションした結果、各入力項目にエラーがあった場合はここでフロントに表示させるエラーメッセージを設定する
  const errorsPresented = {
    plasticImage:
      isSubmitted || dirtyFields.plasticImage === true
        ? errors.plasticImage?.message || null
        : null,
    keycapImage:
      isSubmitted || dirtyFields.keycapImage === true ? errors.keycapImage?.message || null : null,
    materialName:
      isSubmitted || dirtyFields.materialName === true
        ? errors.materialName?.message || null
        : null,
    hexColor:
      isSubmitted || dirtyFields.hexColor === true ? errors.hexColor?.message || null : null,
    plasticType:
      isSubmitted || dirtyFields.plasticType === true ? errors.plasticType?.message || null : null,
    celsius: isSubmitted || dirtyFields.celsius === true ? errors.celsius?.message || null : null,
    note: isSubmitted || dirtyFields.note === true ? errors.note?.message || null : null,
  }

  // 送信ボタンを押せるかどうか（入力にエラーが残っている場合は押せなくする）
  const canSubmit = Object.keys(errors).length === 0

  return (
    <>
      <Head>
        <title>素材を登録</title>
        <meta name='description' content='Generated by create next app' />
        <link rel='icon' href='/favicon.ico' />
      </Head>

      {authState === 'NOT_LOGIN' && (
        <div>
          <p>キーキャップ素材の投稿にはログインが必要です。</p>
          <ul>
            <li onClick={login}>
              <a href='#'>Googleアカウントでログインする</a>
            </li>
          </ul>
        </div>
      )}
      {authState === 'LOGGED_IN' && currentUser && (
        <FormProvider {...methods}>
          <Editor
            inputTagAttributes={inputTagAttributes}
            errorMessage={errorsPresented}
            previews={{
              plasticImage: plasticImageObjectUrl,
              keycapImage: keycapImageObjectUrl,
            }}
            /* handleSubmitでバリデーションを行った後、エラーが無ければexecuteSubmitが実行される */
            onClickSubmit={handleSubmit(executeSubmit)}
            canSubmit={canSubmit}
          />
          {errorMessage && <p>{errorMessage}</p>}
        </FormProvider>
      )}
    </>
  )
}

export default Register
