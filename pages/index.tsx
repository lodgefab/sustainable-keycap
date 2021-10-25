import Head from 'next/head'
import { GetStaticProps, InferGetStaticPropsType, NextPage } from 'next'
import { getSampleMaterialData, useMaterials } from '../lib/helper'
import { Home } from '../components/organisms/Home'
import React, { createContext, useEffect } from 'react'
import * as admin from 'firebase-admin'
import dayjs from 'dayjs'
import { FirestoreMaterialDocument, Material } from '../types'
import { initAdminFirebase } from '../lib/admin-firebase'
import useSWR from 'swr'
import axios from 'axios'

interface Props {}

// export const getInitialProps: GetStaticProps<{ materials: Material[] }> = async (_) => {
//   let materials: Material[] = []
//
//   try {
//     if (process.env.KEYCAP_NO_FIREBASE && process.env.NODE_ENV !== 'production') {
//       materials = getSampleMaterialData()
//     } else {
//       materials = await fetchMaterialData()
//     }
//   } catch (e) {
//     console.error(`素材リストの取得に失敗しました: ${e}`)
//   }
//
//   return {
//     props: {
//       materials: materials,
//     },
//     revalidate: 30,
//   }
// }

export const MaterialContext: React.Context<Material[]> = createContext<Material[]>([])

const fetcher = (url) => axios.get(url).then((res) => res.data)

export const Index: NextPage<Props> = (_) => {
  // const { materials, isLoading } = useMaterials()
  const { data, error } = useSWR('/api/materials', fetcher)
  console.log(data, error)

  // @ts-ignore
  const materials = data?.materials

  return (
    <>
      <Head>
        <title>Create Next App</title>
        <meta name='description' content='Generated by create next app' />
        <link rel='icon' href='/favicon.ico' />
      </Head>

      <MaterialContext.Provider value={materials || []}>
        <Home />
      </MaterialContext.Provider>
    </>
  )
}

export default Index
