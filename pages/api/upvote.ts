import { NextApiRequest, NextApiResponse } from 'next'
import * as admin from 'firebase-admin'
import { HTTP_STATUS } from '../../types'
import { initAdminFirebase } from '../../lib/admin-firebase'

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
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

  try {
    initAdminFirebase()
    const decodedToken = await admin
      .auth()
      .verifyIdToken(authHeader.substring(7, authHeader.length), true)
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

  let targetDoc: admin.firestore.DocumentReference<admin.firestore.DocumentData>

  // TODO: 既にupvoteしている場合はrejectする
  try {
    const db = admin.firestore()
    targetDoc = await db.collection('keycap-materials').doc(materialId)
    const response = await targetDoc.update({
      goodCount: admin.firestore.FieldValue.increment(1),
    })
  } catch (e) {
    console.log(e)
    res.status(500).json({
      message: '素材データの更新に失敗しました。',
    })
    return
  }

  // goodCountのインクリメント後、最新のgoodCountの取得を試みる。
  // 取得できた場合はその値をレスポンスに含めるが、取得できなかった場合もインクリメントには既に成功しているので200を返す
  try {
    const newData = await targetDoc!.get()
    const newGoodCount = await newData.get('goodCount')

    res.status(200).json({
      message: 'ok',
      newGoodCount: newGoodCount,
    })
  } catch (e) {
    res.status(200).json({
      message: 'ok',
      newGoodCount: null,
    })
  }
}

export default handler
