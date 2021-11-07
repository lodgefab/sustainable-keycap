import axios from 'axios'
import { getAuth } from 'firebase/auth'
import {
  GetServerSideProps,
  InferGetServerSidePropsType,
  InferGetStaticPropsType,
  NextPage,
} from 'next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import Head from 'next/head'
import { useRouter } from 'next/router'
import React, { useContext, useEffect, useState } from 'react'
import { MaterialProfile } from '../../components/organisms/MaterialProfile'
import { AuthContext } from '../../lib/auth'
import { fetchMaterialWithAuth } from '../../lib/helper'
import { Material } from '../../types'
import { MaterialApiResponse } from '../api/materials/[materialId]'
import { UpvoteApiResponse } from '../api/upvote'

type Props = InferGetServerSidePropsType<typeof getServerSideProps>

export const getServerSideProps: GetServerSideProps = async ({ query, locale }) => {
  // const materialId = query.mid
  return {
    props: {
      ...(await serverSideTranslations(locale || 'ja')),
    },
  }
}

export const MaterialDetailPage: NextPage<Props> = (_) => {
  const router = useRouter()
  const authState = useContext(AuthContext)
  const { currentUser } = getAuth()
  const [isFound, setIsFound] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [material, setMaterial] = useState<Material | null>(null)
  const [canUpvote, setCanUpvote] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  const { mid } = router.query

  // 認証の初期化が完了し、ログイン状態が変化した時にキーキャップ素材データを取得する処理
  useEffect(() => {
    ;(async () => {
      if (authState === 'INITIALIZING') {
        return
      }

      if (typeof mid !== 'string' || mid.length === 0) {
        setIsFound(false)
        setIsLoading(false)
        return
      }

      if (authState === 'LOGGED_IN' && currentUser) {
        try {
          const { material, isAlreadyUpvoted } = await fetchMaterialWithAuth(mid)
          setMaterial(material)
          setCanUpvote(!isAlreadyUpvoted)
          setIsFound(true)
        } catch (e) {
          setIsFound(false)
        } finally {
          setIsLoading(false)
        }
      } else if (authState === 'NOT_LOGIN') {
        try {
          const response = await axios
            .get<MaterialApiResponse>(`/api/materials/${mid}`) // TODO: URLエンコーディング + バリデーション
            .then((res) => res.data)
          const material = response.material!
          setMaterial(material)
          setCanUpvote(false)
          setIsFound(true)
        } catch (e) {
          console.log(e)
          if (axios.isAxiosError(e) && e.response) {
            // TODO: 書く
          }
          setIsFound(false)
        } finally {
          setIsLoading(false)
        }
      } else {
        return
      }
    })()
  }, [currentUser, authState])

  /**
   * 表示されているいいねの数を変更する
   * @param materialId 変更するキーキャップ素材のID
   * @param count 変更後のいいねの数
   */
  const setGoodCount = async (count: number) => {
    if (!material) {
      return
    }

    await setMaterial({
      ...material,
      goodCount: count,
    })
  }

  /**
   * いいねを増やす
   */
  const upvote = async () => {
    // 二重送信・既にUpvote済みの素材に対する再送信の防止
    // 未ログイン状態での送信は禁止
    // 投稿データが読み込まれていない段階での操作は禁止
    if (!canUpvote || !currentUser || !material) {
      return
    }

    setCanUpvote(false)

    const idToken = await currentUser.getIdToken(true)

    try {
      const response = await axios.post<UpvoteApiResponse>(
        '/api/upvote',
        {
          materialId: material.id,
        },
        {
          headers: {
            'content-type': 'application/json',
            Authorization: `Bearer ${idToken}`,
          },
        }
      )

      if (response.data.newGoodCount) {
        await setGoodCount(response.data.newGoodCount)
      }
    } catch (error) {
      console.error(error)
      setError('いいねに失敗しました。時間を置いてやり直してください。')
      setCanUpvote(true)
    }
  }

  if (isLoading) {
    return <div>Loading...</div>
  } else if (!isFound) {
    return <div>キーキャップ素材が見つかりませんでした。</div>
  } else if (material) {
    return (
      <>
        <Head>
          <title>{material.materialName} の詳細</title>
          <link rel='icon' href='/favicon.ico' />
        </Head>

        <MaterialProfile material={material} canUpvote={canUpvote} upvote={upvote} />

        {router.query.action === 'register' && <p>投稿が完了しました</p>}
        {error && <p>{error}</p>}
      </>
    )
  } else {
    return <p>エラーが発生しました。時間を置いてやり直してください。</p> /* TODO: 書く */
  }
}

export default MaterialDetailPage
