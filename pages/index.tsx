import Head from 'next/head'
import { InferGetStaticPropsType, NextPage } from 'next'
import { Home } from '../components/organisms/Home'
import React, { useContext, useEffect } from 'react'
import axios from 'axios'
import { AuthContext } from '../lib/auth'
import { UpvoteApiResponse } from './api/upvote'
import { getAuth } from 'firebase/auth'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { DispatchPageReadyContext } from '../utils/pageLoadEventContext'
import useMaterialData from '../utils/useMaterialData'
import useUpvotedMaterialIds from '../utils/useUpvotedMaterialIds'

type Props = InferGetStaticPropsType<typeof getStaticProps>

export const getStaticProps = async ({ locale }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale)),
    },
  }
}

export const Index: NextPage<Props> = (_) => {
  const authState = useContext(AuthContext)
  const currentUser = getAuth().currentUser
  const [materials, setGoodCount] = useMaterialData()
  const [upvotedMaterialIds, addUpvotedMaterialId] = useUpvotedMaterialIds()
  const dispatchPageReady = useContext(DispatchPageReadyContext)

  // 素材データの読み込みが完了してかどうかを表すboolean
  const isPageLoaded = materials.length > 0

  // 素材データの読み込みが完了してページの表示に必要なデータが揃った時の処理
  useEffect(() => {
    if (isPageLoaded) {
      dispatchPageReady()
    }
  }, [dispatchPageReady, isPageLoaded])

  /**
   * いいねを増やす
   * @param materialId いいねを増やすキーキャップ素材のID
   */
  const upvote = async (materialId: string) => {
    // 未ログイン状態もしくは初期化中の送信は禁止
    if (!currentUser || !upvotedMaterialIds) {
      return
    }

    // 二重送信・既にUpvote済みの素材に対する再送信の防止
    if (upvotedMaterialIds.includes(materialId)) {
      return
    }

    addUpvotedMaterialId(materialId)

    const idToken = await currentUser.getIdToken(true)

    try {
      const response = await axios.post<UpvoteApiResponse>(
        '/api/upvote',
        {
          materialId: materialId,
        },
        {
          headers: {
            'content-type': 'application/json',
            Authorization: `Bearer ${idToken}`,
          },
        }
      )

      if (response.data.newGoodCount) {
        await setGoodCount(materialId, response.data.newGoodCount)
      }
    } catch (error) {
      // TODO: Upvoteに失敗した場合の処理を書く
      console.error(error)
    }
  }

  return (
    <>
      <Head>
        <title>#ANYCAP</title>
      </Head>
      <Home
        materials={materials || []}
        setGoodCount={setGoodCount}
        canUpvote={authState === 'LOGGED_IN' && upvotedMaterialIds instanceof Array}
        upvotedMaterialsId={upvotedMaterialIds}
        upvote={upvote}
      />
    </>
  )
}

export default Index
