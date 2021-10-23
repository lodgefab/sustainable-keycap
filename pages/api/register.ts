import { NextApiRequest, NextApiResponse } from 'next'
import { ensureEnvironmentVariable, ensureFormDataIsValid } from '../../lib/helper'
import multer from 'multer'
import * as admin from 'firebase-admin'

const upload = multer({
  storage: multer.memoryStorage(),
})

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

  try {
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

  // const client = createClient({
  //   accessToken: process.env.KEYCAP_CONTENTFUL_ACCESS_TOKEN!,
  // })
  // const space = await client.getSpace(process.env.KEYCAP_CONTENTFUL_SPACE_ID!)
  // const environment = await space.getEnvironment(process.env.KEYCAP_CONTENTFUL_ENVIRONMENT_ID!)
  //
  // try {
  //   const plasticAssetTmp1 = await environment.createAssetFromFiles({
  //     fields: {
  //       title: {
  //         'en-US': `plasticImage-${+new Date()}`,
  //       },
  //       description: {
  //         'en-US': 'Uploaded in development mode',
  //       },
  //       file: {
  //         'en-US': {
  //           contentType: uploadedImages.plasticImage[0].mimetype,
  //           fileName: uploadedImages.plasticImage[0].originalname,
  //           file: uploadedImages.plasticImage[0].buffer,
  //         },
  //       },
  //     },
  //   })
  //   const plasticAssetTmp2 = await plasticAssetTmp1.processForAllLocales()
  //   const plasticAsset = await plasticAssetTmp2.publish()
  //
  //   const keycapAssetTmp1 = await environment.createAssetFromFiles({
  //     fields: {
  //       title: {
  //         'en-US': `keycapImage-${+new Date()}`,
  //       },
  //       description: {
  //         'en-US': 'Uploaded in development mode',
  //       },
  //       file: {
  //         'en-US': {
  //           contentType: uploadedImages.keycapImage[0].mimetype,
  //           fileName: uploadedImages.keycapImage[0].originalname,
  //           file: uploadedImages.keycapImage[0].buffer,
  //         },
  //       },
  //     },
  //   })
  //   const keycapAssetTmp2 = await keycapAssetTmp1.processForAllLocales()
  //   const keycapAsset = await keycapAssetTmp2.publish()
  //
  //   const insertedEntry = await environment.createEntry(
  //     process.env.KEYCAP_CONTENTFUL_CONTENT_TYPE!,
  //     { fields: convertFormInputToContentfulModel(req.body, plasticAsset, keycapAsset) }
  //   )
  //   await insertedEntry.publish()
  // } catch (e) {
  //   res.status(500).json({
  //     message: 'Error white saving data',
  //   })
  //   return
  // }
}

export const config = {
  api: {
    bodyParser: false,
  },
}

export default handler
