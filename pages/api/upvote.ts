import { NextApiRequest, NextApiResponse } from 'next'
import { ensureEnvironmentVariable, ensureFormDataIsValid } from '../../lib/helper'
import * as admin from 'firebase-admin'

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const materialId = req.body.materialId

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
