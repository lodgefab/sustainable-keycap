import { NextApiRequest, NextApiResponse } from 'next'
import { FirestoreMaterialDocument, Material } from '../../types'
import { getSampleMaterialData } from '../../lib/helper'
import { initAdminFirebase } from '../../lib/admin-firebase'
import * as admin from 'firebase-admin'
import dayjs from 'dayjs'

/**
 * 未ログイン状態でトップページを開いた時にキーキャップ素材の一覧を取得するためのAPI
 * 頻繁にいいね数が変わることを想定していないので、Firebaseへのリクエスト数を減らすためにレスポンスは30秒間キャッシュする
 */
export const getMaterialsWithoutLogin = async (req: NextApiRequest, res: NextApiResponse) => {
  let materials: Material[] = []

  try {
    if (process.env.KEYCAP_NO_FIREBASE && process.env.NODE_ENV !== 'production') {
      materials = getSampleMaterialData()
    } else {
      materials = await fetchMaterialData()
    }
  } catch (e) {
    console.error(`素材リストの取得に失敗しました: ${e}`)
    res.status(500).json({
      message: 'サーバーエラーにより素材データの取得ができませんでした。',
    })
    return
  }

  // レスポンスは30秒間キャッシュする
  res.setHeader('Cache-Control', 'max-age=0, s-maxage=30, public')

  res.status(200).json({
    message: 'ok',
    materials: materials,
  })
}

const fetchMaterialData = async () => {
  initAdminFirebase()
  const db = admin.firestore()

  const querySnapshot = await db.collection('keycap-materials').get()

  const materials = await Promise.all(
    querySnapshot.docs.map(async (doc) => {
      const data = doc.data() as FirestoreMaterialDocument // TODO: as 使わずにいい感じに型付けたい

      const imageFiles = (
        await admin
          .storage()
          .bucket()
          .getFiles({
            prefix: `images/${doc.id}/`,
            delimiter: '/',
          })
      )[0]

      let plasticImageUrl: string = 'hoge/huga.png' // TODO: 画像が取得できなかったときのデフォルト画像を用意する
      let keycapImageUrl: string = 'hoge/huga.png' // TODO: 画像が取得できなかったときのデフォルト画像を用意する
      for (const file of imageFiles) {
        if (file.name.startsWith(`images/${doc.id}/plasticImage`)) {
          plasticImageUrl = (
            await file.getSignedUrl({
              action: 'read',
              expires: dayjs().add(1, 'day').format('MM-DD-YYYY'),
            })
          )[0]
        } else if (file.name.startsWith(`images/${doc.id}/keycapImage`)) {
          keycapImageUrl = (
            await file.getSignedUrl({
              action: 'read',
              expires: dayjs().add(1, 'day').format('MM-DD-YYYY'),
            })
          )[0]
        }
      }

      return {
        id: doc.id,
        materialName: data.materialName,
        colorType: data.colorType,
        plasticType: data.plasticType,
        goodCount: data.goodCount,
        plasticImageUrl,
        keycapImageUrl,
        celsius: data.celsius,
        note: data.note,
      }
    })
  )

  console.log(`Fetched ${materials.length} items from Firebase (at ${dayjs().format()})`)

  return materials
}

export default getMaterialsWithoutLogin
