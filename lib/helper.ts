import { FirestoreMaterialDocument, Material } from '../types'
import { firebaseClientApp, getCurrentUser } from './auth'
import {
  collection,
  DocumentData,
  getDocs,
  getFirestore,
  QueryDocumentSnapshot,
  SnapshotOptions,
} from 'firebase/firestore'
import { getDownloadURL, getStorage, listAll, ref } from 'firebase/storage'

export const getSampleMaterialData: () => Material[] = () => {
  return [
    {
      id: '00000000000000000000',
      materialName: 'Cocacola Red',
      colorType: 'red',
      plasticType: 'plastic-a',
      goodCount: 12,
      keycapImageUrl: '/sample/icon-sample.jpg',
      plasticImageUrl: '/sample/bg-sample1.jpg',
      celsius: 50,
      note: '備考',
    },
    {
      id: '11111111111111111111',
      materialName: 'Tide レッド',
      colorType: 'red',
      plasticType: 'plastic-b',
      goodCount: 12,
      keycapImageUrl: '/sample/icon-sample.jpg',
      plasticImageUrl: '/sample/bg-sample2.jpg',
      celsius: 100,
      note: '備考',
    },
    {
      id: '22222222222222222222',
      materialName: 'Cocacola Red 2',
      colorType: 'red',
      plasticType: 'plastic-c',
      goodCount: 12,
      keycapImageUrl: '/sample/icon-sample.jpg',
      plasticImageUrl: '/sample/bg-sample1.jpg',
      celsius: 150,
      note: '備考',
    },
    {
      id: '33333333333333333333',
      materialName: 'Cocacola Red 3',
      colorType: 'red',
      plasticType: 'plastic-d',
      goodCount: 12,
      keycapImageUrl: '/sample/icon-sample.jpg',
      plasticImageUrl: '/sample/bg-sample1.jpg',
      celsius: 200,
      note: '備考',
    },
  ]
}

/**
 * Firebase Admin SDKを使用するのに必要な環境変数が設定されているか確認し、設定されていない場合はエラーを投げる
 */
export const ensureEnvironmentVariable = (): void => {
  if (
    !(
      process.env.KEYCAP_FIREBASE_PROJECT_ID &&
      process.env.KEYCAP_FIREBASE_PRIVATE_KEY &&
      process.env.KEYCAP_FIREBASE_SERVICE_ACCOUNT &&
      process.env.KEYCAP_FIREBASE_STORAGE_BUCKET_URL
    )
  ) {
    throw new Error('FirebaseのAdmin SDKを使用するためのCredentialを環境変数で設定してください。')
  }
}

export const ensureFormDataIsValid = (data: unknown): data is FirestoreMaterialDocument => {
  // TODO: バリデーション処理を実装する
  return true
}

const toFireStore = (data: Material): DocumentData => {
  return {}
}

const fromFirestore = (snapshot: QueryDocumentSnapshot, options: SnapshotOptions): Material => {
  const data = snapshot.data(options)

  // TODO: バリデーション処理を実装する

  return {
    id: snapshot.id,
    materialName: data.materialName,
    colorType: data.colorType,
    plasticType: data.plasticType,
    goodCount: data.goodCount,
    plasticImageUrl: '/hoge/huga',
    keycapImageUrl: 'hoge/huga',
    celsius: data.celsius,
    note: data.note,
  }
}

export const fetchMaterialsWithAuth = async (): Promise<Material[]> => {
  if (getCurrentUser() === null) {
    throw new Error('Authentication is required to fetch material data.')
  }

  const querySnapshot = await getDocs(
    collection(getFirestore(firebaseClientApp), 'keycap-materials')
  )
  const storage = getStorage(firebaseClientApp)

  return await Promise.all(
    querySnapshot.docs.map(async (doc) => {
      const data = doc.data() as FirestoreMaterialDocument // TODO: as 使わずにいい感じに型付けたい

      const listResult = await listAll(ref(storage, `images/${doc.id}/`))

      const plasticImageFile = listResult.items.filter((item) =>
        item.name.startsWith('plasticImage')
      )[0]
      const keycapImageFile = listResult.items.filter((item) =>
        item.name.startsWith('keycapImage')
      )[0]

      const plasticImageUrl = await getDownloadURL(
        ref(storage, `images/${doc.id}/${plasticImageFile.name}`)
      )
      const keycapImageUrl = await getDownloadURL(
        ref(storage, `images/${doc.id}/${keycapImageFile.name}`)
      )

      return {
        id: doc.id,
        materialName: data.materialName,
        colorType: data.colorType,
        plasticType: data.plasticType,
        goodCount: data.goodCount,
        plasticImageUrl: plasticImageUrl,
        keycapImageUrl: keycapImageUrl,
        celsius: data.celsius,
        note: data.note,
      }
    })
  )
}
