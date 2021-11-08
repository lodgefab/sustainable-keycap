import Head from 'next/head'
import { InferGetStaticPropsType, NextPage } from 'next'
import { Home } from '../components/organisms/Home'
import React, { useContext, useEffect, useState } from 'react'
import { Material } from '../types'
import axios from 'axios'
import { AuthContext } from '../lib/auth'
import { fetchMaterialsWithAuth } from '../lib/helper'
import { MaterialsApiResponse } from './api/materials'
import Axios from 'axios'
import { UpvoteApiResponse } from './api/upvote'
import { getAuth } from 'firebase/auth'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'

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

  const [upvotableMaterials, setUpvotableMaterials] = useState<string[]>([])
  const [materials, setMaterials] = useState<Material[]>([])

  // 認証の初期化が完了し、ログイン状態が変化した時にキーキャップ素材データを取得する処理
  useEffect(() => {
    ;(async () => {
      let data: Material[]
      if (authState === 'LOGGED_IN' && currentUser) {
        const fetchResult = await fetchMaterialsWithAuth()
        setMaterials(fetchResult.materials)
        setUpvotableMaterials(
          fetchResult.materials
            .filter((material) => !fetchResult.alreadyUpvoted.includes(material.id))
            .map((material) => material.id)
        )
      } else if (authState === 'NOT_LOGIN') {
        try {
          const response = await axios
            .get<MaterialsApiResponse>('/api/materials')
            .then((res) => res.data)
          data = response.materials!
          setMaterials(data)
          setUpvotableMaterials([])
        } catch (e) {
          if (Axios.isAxiosError(e) && e.response) {
            console.log(e)
          }
          console.log(e)
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
  const setGoodCount = async (materialId: string, count: number) => {
    await setMaterials(
      materials.map((material) => {
        if (material.id === materialId) {
          material.goodCount = count
        }
        return material
      })
    )
  }

  /**
   * いいねを増やす
   * @param materialId いいねを増やすキーキャップ素材のID
   */
  const upvote = async (materialId: string) => {
    // 二重送信・既にUpvote済みの素材に対する再送信の防止
    if (!upvotableMaterials.includes(materialId)) {
      return
    }

    // 未ログイン状態での送信は禁止
    if (!currentUser) {
      return
    }

    setUpvotableMaterials(upvotableMaterials.filter((item) => item !== materialId))

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
        <meta name='description' content='Generated by create next app' />
        <meta name='viewport' content='width=device-width, initial-scale=1.0' />
        <link rel='icon' href='/favicon.ico' />
      </Head>

      <Home
        materials={materials || []}
        setGoodCount={setGoodCount}
        upvotableMaterials={upvotableMaterials}
        upvote={upvote}
      />
    </>
  )
}

export default Index
