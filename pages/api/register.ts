import { NextApiRequest, NextApiResponse } from 'next'
import { ensureFormDataIsValid } from '../../lib/helper'
import multer from 'multer'
import * as admin from 'firebase-admin'
import { initAdminFirebase } from '../../lib/admin-firebase'

const upload = multer({
  storage: multer.memoryStorage(),
})

// TODO: method not allowedな バリデーションを書く
const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const uploadedImages: any = await new Promise((resolve, reject) => {
    upload.fields([
      { name: 'plasticImage', maxCount: 1 },
      { name: 'keycapImage', maxCount: 1 },
    ])(req as any, res as any, (err) => {
      if (err) return reject(err)
      // @ts-ignore TODO: 型を書く
      resolve(req.files)
    })
  })
  const plasticImageExt = uploadedImages.plasticImage[0].mimetype.split('/')[1]
  const keycapImageExt = uploadedImages.keycapImage[0].mimetype.split('/')[1]

  const data = req.body

  ensureFormDataIsValid(data)

  try {
    initAdminFirebase()
    const db = admin.firestore()
    const addedData = await db.collection('keycap-materials').add({
      goodCount: 0, // 新規に追加する素材データはいいね数を0で初期化する
      ...data,
    })
    const documentId = addedData.id

    const bucket = admin.storage().bucket()
    const plasticImageFile = bucket.file(`images/${documentId}/plasticImage.${plasticImageExt}`)
    await plasticImageFile.save(uploadedImages.plasticImage[0].buffer)
    await plasticImageFile.setMetadata({ contentType: `image/${plasticImageExt}` })

    const keycapImageFile = bucket.file(`images/${documentId}/keycapImage.${plasticImageExt}`)
    await keycapImageFile.save(uploadedImages.keycapImage[0].buffer)
    await keycapImageFile.setMetadata({ contentType: `image/${keycapImageExt}` })

    res.status(200).json({
      message: 'ok',
      materialId: documentId,
    })
  } catch (e) {
    console.error(`素材データ登録失敗: ${e}`)
    res.status(500).json({
      message: 'サーバーエラーにより素材データの登録ができませんでした。',
    })
  }
}

export const config = {
  api: {
    bodyParser: false,
  },
}

export default handler
