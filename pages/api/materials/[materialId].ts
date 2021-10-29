import { NextApiRequest, NextApiResponse } from 'next'
import { FirestoreMaterialDocument, HTTP_STATUS, Material } from '../../../types'
import { getSampleMaterialData, isErrorResponse } from '../../../lib/helper'
import { initAdminFirebase } from '../../../lib/admin-firebase'
import * as admin from 'firebase-admin'
import dayjs from 'dayjs'

export interface MaterialApiResponse {
  message: string
  material?: Material
}

interface MaterialApiRequest {
  materialId: string
}

/**
 * 未ログイン状態でトップページを開いた時にキーキャップ素材の一覧を取得するためのAPI
 * 頻繁にいいね数が変わることを想定していないので、Firebaseへのリクエスト数を減らすためにレスポンスは30秒間キャッシュする
 */
export const getMaterialWithoutLogin = async (
  req: NextApiRequest,
  res: NextApiResponse<MaterialApiResponse>
) => {
  // GETリクエスト以外は弾く
  if (req.method !== 'GET') {
    res.status(HTTP_STATUS.METHOD_NOT_ALLOWED).json({
      message: `${req.method} is not allowed.`,
    })
    return
  }

  const { materialId } = req.query
  if (!isValidRequest(materialId)) {
    res.status(HTTP_STATUS.BAD_REQUEST).json({
      message: `Bad Request.`,
    })
    return
  }

  let material: Material

  try {
    if (process.env.KEYCAP_NO_FIREBASE && process.env.NODE_ENV !== 'production') {
      material = getSampleMaterialData()[0]
    } else {
      material = await fetchMaterialData(materialId)
    }
  } catch (e) {
    if (isErrorResponse(e)) {
      res.status(e.status).json({
        message: e.message,
      })
    } else {
      console.error(`素材リストの取得に失敗しました: ${e}`)
      res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
        message: 'サーバーエラーにより素材データの取得ができませんでした。',
      })
    }
    return
  }

  // レスポンスは30秒間キャッシュする
  res.setHeader('Cache-Control', 'max-age=0, s-maxage=30, public')

  res.status(200).json({
    message: 'ok',
    material: material,
  })
}

const fetchMaterialData = async (materialId: string): Promise<Material> => {
  initAdminFirebase()
  const db = admin.firestore()

  const doc = await db.collection('keycap-materials').doc(materialId).get()

  if (!doc.exists) {
    throw {
      status: HTTP_STATUS.NOT_FOUND,
      message: `Material with ID = ${materialId} was not found.`,
    }
  }

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
}

const isValidRequest = (arg: any): arg is string => {
  // TODO: バリデーションを書く
  return true
}

export default getMaterialWithoutLogin
