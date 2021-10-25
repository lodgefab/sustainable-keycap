import Head from 'next/head'
import { GetStaticPaths, GetStaticProps, InferGetStaticPropsType, NextPage } from 'next'
import React from 'react'
import { useRouter } from 'next/router'
import * as admin from 'firebase-admin'
import { Material } from '../../types'
import dayjs from 'dayjs'
import { MaterialProfile } from '../../components/organisms/MaterialProfile'
import { initAdminFirebase } from '../../lib/admin-firebase'

type Props = InferGetStaticPropsType<typeof getStaticProps>

export const getStaticPaths: GetStaticPaths = async (context) => {
  initAdminFirebase()
  const db = admin.firestore()
  const querySnapshot = await db.collection('keycap-materials').get()
  const materialIds = querySnapshot.docs.map((doc) => `/material/${doc.id.toString()}`)

  return {
    paths: materialIds,
    fallback: true,
  }
}

export const getStaticProps: GetStaticProps<
  { materialId: string | null; data?: Material },
  { mid: string }
> = async ({ params }) => {
  const materialId = params?.mid ? params.mid : null

  if (!materialId) {
    return {
      props: {
        materialId: null,
      },
    }
  }

  initAdminFirebase()
  const db = admin.firestore()
  const querySnapshot = await db.collection('keycap-materials').doc(materialId).get()
  const data = querySnapshot.data()

  if (!data) {
    return {
      props: {
        materialId: null,
      },
    }
  }

  const imageFiles = (
    await admin
      .storage()
      .bucket()
      .getFiles({
        prefix: `images/${materialId}/`,
        delimiter: '/',
      })
  )[0]

  let plasticImageUrl: string = 'hoge/huga.png' // TODO: 画像が取得できなかったときのデフォルト画像を用意する
  let keycapImageUrl: string = 'hoge/huga.png' // TODO: 画像が取得できなかったときのデフォルト画像を用意する
  for (const file of imageFiles) {
    if (file.name.startsWith(`images/${materialId}/plasticImage`)) {
      plasticImageUrl = (
        await file.getSignedUrl({
          action: 'read',
          expires: dayjs().add(1, 'day').format('MM-DD-YYYY'),
        })
      )[0]
    } else if (file.name.startsWith(`images/${materialId}/keycapImage`)) {
      keycapImageUrl = (
        await file.getSignedUrl({
          action: 'read',
          expires: dayjs().add(1, 'day').format('MM-DD-YYYY'),
        })
      )[0]
    }
  }

  return {
    props: {
      materialId: materialId,
      data: {
        id: materialId,
        materialName: data.materialName,
        colorType: data.colorType,
        plasticType: data.plasticType,
        goodCount: data.goodCount,
        celsius: data.celsius,
        plasticImageUrl: plasticImageUrl,
        keycapImageUrl: keycapImageUrl,
        note: data.note,
      },
    },
  }
}

export const MaterialDetailPage: NextPage<Props> = ({ materialId, data }) => {
  const router = useRouter()

  if (router.isFallback) {
    return <div>Loading...</div>
  } else if (!materialId || !data) {
    return <div>Invalid</div> /* TODO: 書く */
  } else {
    return (
      <>
        <Head>
          <title>素材を登録</title>
          <meta name='description' content='Generated by create next app' />
          <link rel='icon' href='/favicon.ico' />
        </Head>

        <MaterialProfile data={data} />

        {router.query.action === 'register' && <p>投稿が完了しました</p>}
      </>
    )
  }
}

export default MaterialDetailPage
