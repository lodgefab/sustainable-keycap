import * as admin from 'firebase-admin'
import { ensureEnvironmentVariable } from './helper'

let db: admin.firestore.Firestore

export const initAdminFirebase = () => {
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

    if (db === undefined) {
      db = admin.firestore()
      db.settings({
        timestampsInSnapshots: true,
      })
    }
  }
}

export const getAdminFirestoreDb = () => {
  return db
}
