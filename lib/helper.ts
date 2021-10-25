import { FirestoreMaterialDocument, Material } from '../types'
import { firebaseClientApp } from './auth'
import {
  collection,
  DocumentData,
  FirestoreDataConverter,
  getDocs,
  getFirestore,
  QueryDocumentSnapshot,
  SnapshotOptions,
} from 'firebase/firestore'
import { getStorage, listAll, ref } from 'firebase/storage'
import useSWRImmutable from 'swr/immutable'

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

export const fetchMaterials = async (): Promise<Material[]> => {
  const querySnapshot = await getDocs(collection(getFirestore(firebaseClientApp), 'materials'))
  const storage = getStorage(firebaseClientApp)

  console.log(querySnapshot.docs)

  return await Promise.all(
    querySnapshot.docs.map(async (doc) => {
      const data = doc.data() as FirestoreMaterialDocument // TODO: as 使わずにいい感じに型付けたい

      const listResult = await listAll(ref(storage, `images/${doc.id}/`))
      console.log(listResult)

      // const url = await getDownloadURL(ref(storage, `images/${doc.id}/plasticImage.`))
      //
      // const imageFiles = (
      //     storage.
      //     .getFiles({
      //       prefix: `images/${doc.id}/`,
      //       delimiter: '/',
      //     })
      // )[0]
      //
      // let plasticImageUrl: string = 'hoge/huga.png' // TODO: 画像が取得できなかったときのデフォルト画像を用意する
      // let keycapImageUrl: string = 'hoge/huga.png' // TODO: 画像が取得できなかったときのデフォルト画像を用意する
      // for (const file of imageFiles) {
      //   if (file.name.startsWith(`images/${doc.id}/plasticImage`)) {
      //     plasticImageUrl = (
      //       await file.getSignedUrl({
      //         action: 'read',
      //         expires: dayjs().add(1, 'day').format('MM-DD-YYYY'),
      //       })
      //     )[0]
      //   } else if (file.name.startsWith(`images/${doc.id}/keycapImage`)) {
      //     keycapImageUrl = (
      //       await file.getSignedUrl({
      //         action: 'read',
      //         expires: dayjs().add(1, 'day').format('MM-DD-YYYY'),
      //       })
      //     )[0]
      //   }
      // }

      return {
        id: doc.id,
        materialName: data.materialName,
        colorType: data.colorType,
        plasticType: data.plasticType,
        goodCount: data.goodCount,
        plasticImageUrl: '',
        keycapImageUrl: '',
        celsius: data.celsius,
        note: data.note,
      }
    })
  )
}

export const useMaterials = () => {
  const { data, error } = useSWRImmutable('materials', fetchMaterials)
  console.log(data, error)

  return {
    materials: data,
    isLoading: !error && !data,
    isError: error,
  }
}
