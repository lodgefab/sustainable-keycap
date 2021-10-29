import { NextApiRequest, NextApiResponse } from 'next'
import * as admin from 'firebase-admin'
import { FirestoreMaterialDocument, HTTP_STATUS } from '../../types'
import { initAdminFirebase } from '../../lib/admin-firebase'

export interface UpvoteApiResponse {
  message: string
  newGoodCount?: number | null
}

export interface UpvoteFirestoreData extends admin.firestore.DocumentData {
  materials: string[]
}

const handler = async (req: NextApiRequest, res: NextApiResponse<UpvoteApiResponse>) => {
  // POSTリクエスト以外は弾く
  if (req.method !== 'POST') {
    res.status(HTTP_STATUS.METHOD_NOT_ALLOWED).json({
      message: `${req.method} is not allowed.`,
    })
    return
  }

  const authHeader = req.headers.authorization

  if (!authHeader) {
    res.status(HTTP_STATUS.UNAUTHORIZED).json({
      message: '認証が必要です。',
    })
    return
  }

  if (!authHeader.startsWith('Bearer ')) {
    res.status(HTTP_STATUS.BAD_REQUEST).json({
      message: '認証トークンのフォーマットが不正です。',
    })
    return
  }

  let userId: string

  try {
    initAdminFirebase()
    const decodedToken = await admin
      .auth()
      .verifyIdToken(authHeader.substring(7, authHeader.length), true)
    userId = decodedToken.uid
  } catch (error) {
    if (error.code === 'auth/id-token-revoked') {
      // ユーザーがFirebase側で削除・変更されるなどの更新が発生した場合
      res.status(HTTP_STATUS.UNAUTHORIZED).json({
        message: 'ユーザー情報の更新が発生しました。再ログインしてください。',
      })
    } else {
      res.status(HTTP_STATUS.UNAUTHORIZED).json({
        message: 'この操作は許可されていません。',
      })
    }
    return
  }

  const { materialId } = req.body

  initAdminFirebase()

  let db: admin.firestore.Firestore
  try {
    db = admin.firestore()
  } catch (e) {
    console.error(e)
    res.status(500).json({
      message: '素材データの更新に失敗しました。',
    })
    return
  }

  let newGoodCount: number
  try {
    newGoodCount = await db.runTransaction(async (t) => {
      const targetMaterialDoc = await db.collection('keycap-materials').doc(materialId).get()
      const targetMaterialData = targetMaterialDoc.data() as FirestoreMaterialDocument | undefined
      // 該当IDのMaterialが見つからない場合、404を返す
      if (!targetMaterialDoc.exists || targetMaterialData === undefined) {
        throw {
          response: HTTP_STATUS.NOT_FOUND,
          message: '素材データが見つかりません。',
        }
      }

      const newGoodCount = targetMaterialData.goodCount + 1

      const upvoteRecordDoc = await db.collection('upvotes').doc(userId).get()
      const upvoteRecord = upvoteRecordDoc.data() as UpvoteFirestoreData | undefined

      // 既にUpvote済みの場合、409を返す
      if (upvoteRecordDoc.exists && upvoteRecord?.materials.includes(materialId)) {
        throw {
          response: HTTP_STATUS.CONFLICT,
          message: '既にUpvote済みの素材データです。',
        }
      }

      await t.update(db.collection('keycap-materials').doc(materialId), {
        goodCount: newGoodCount,
      })

      await t.set(
        db.collection('upvotes').doc(userId),
        {
          materials: admin.firestore.FieldValue.arrayUnion(materialId),
        },
        { merge: true }
      )

      return newGoodCount
    })
  } catch (e) {
    if (e.response && e.message) {
      res.status(e.response).json({
        message: e.message,
      })
    } else {
      console.error(e)
      res.status(500).json({
        message: '素材データの更新に失敗しました。',
      })
    }
    return
  }

  res.status(200).json({
    message: 'ok',
    newGoodCount: newGoodCount,
  })
}

export default handler
