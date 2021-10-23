import Head from 'next/head'
import { GetStaticPaths, GetStaticProps, InferGetStaticPropsType, NextPage } from 'next'
import React from 'react'
import { useRouter } from 'next/router'
import * as admin from 'firebase-admin'
import { ensureEnvironmentVariable } from '../../lib/helper'
import { FirestoreMaterialDocument } from '../../types'

type Props = InferGetStaticPropsType<typeof getStaticProps>

export const getStaticPaths: GetStaticPaths = async (context) => {
  if (admin.apps.length === 0) {
    // Firebase App の処理が複数回走るとエラーを吐くので初回のレンダリング時のみ実行する
    ensureEnvironmentVariable()
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.KEYCAP_FIREBASE_PROJECT_ID,
        privateKey: process.env.KEYCAP_FIREBASE_PRIVATE_KEY!.replace(/\\n/g, '\n'),
        clientEmail: process.env.KEYCAP_FIREBASE_SERVICE_ACCOUNT,
      }),
      storageBucket: process.env.KEYCAP_FIREBASE_STORAGE_BUCKET_URL,
    })
  }

  const db = admin.firestore()
  const querySnapshot = await db.collection('keycap-materials').get()
  const materialIds = querySnapshot.docs.map((doc) => `/material/${doc.id.toString()}`)

  return {
    paths: materialIds,
    fallback: true,
  }
}

export const getStaticProps: GetStaticProps<{ materialId: string | null }, { mId: string }> =
  async ({ params }) => {
    return {
      props: {
        materialId: params?.mId ? params.mId : null,
      },
    }
  }

export const MaterialDetailPage: NextPage<Props> = ({ materialId }) => {
  const router = useRouter()

  if (router.isFallback) {
    return <div>Loading...</div>
  } else {
    return (
      <>
        <Head>
          <title>素材を登録</title>
          <meta name='description' content='Generated by create next app' />
          <link rel='icon' href='/favicon.ico' />
        </Head>

        <p>Material: {materialId}</p>
      </>
    )
  }
}

export default MaterialDetailPage
