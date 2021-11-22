import {
  CategorisedColorType,
  categorisedColorTypeItems,
  FirestoreMaterialDocument,
  hexColorTypeItems,
  HTTP_STATUS,
  Material,
  plasticTypeItems,
  RegisterRequestFromClient,
  ResponseData,
} from '../types'
import { firebaseClientApp, getCurrentUser } from '../lib/auth'
import {
  collection,
  doc,
  DocumentData,
  getDoc,
  getDocs,
  getFirestore,
  QueryDocumentSnapshot,
  SnapshotOptions,
} from 'firebase/firestore'
import { getDownloadURL, getStorage, listAll, ref } from 'firebase/storage'
import { NextApiRequest, NextApiResponse } from 'next'
import hexRgb from 'hex-rgb'

export const getSampleMaterialData: () => Material[] = () => {
  return [
    {
      id: '00000000000000000000',
      materialName: 'Cocacola Red',
      hexColor: '#FF0000',
      categorisedColor: 'red',
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
      hexColor: '#FF0000',
      categorisedColor: 'red',
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
      hexColor: '#FF0000',
      categorisedColor: 'red',
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
      hexColor: '#FF0000',
      categorisedColor: 'red',
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

export const ensureRegisterRequestIsValid = (
  requestBody: any
): requestBody is RegisterRequestFromClient => {
  return (
    typeof requestBody?.materialName === 'string' &&
    requestBody.materialName.length > 0 &&
    typeof requestBody?.hexColor === 'string' &&
    hexColorTypeItems.includes(requestBody.hexColor) &&
    typeof requestBody?.plasticType === 'string' &&
    plasticTypeItems.includes(requestBody.plasticType) &&
    typeof requestBody?.celsius === 'string' &&
    /^\d+$/.test(requestBody?.celsius) &&
    Number.parseInt(requestBody?.celsius) > 0 &&
    typeof requestBody?.note === 'string'
  )
}

export const categoriseColor = (baseColorHex: string): CategorisedColorType => {
  const baseColorRgb = hexRgb(baseColorHex)
  const distanceFrom = [
    // Distance from red
    (255 - baseColorRgb.red) ** 2 + (0 - baseColorRgb.green) ** 2 + (0 - baseColorRgb.blue) ** 2,
    // Distance from blue
    (0 - baseColorRgb.red) ** 2 + (0 - baseColorRgb.green) ** 2 + (255 - baseColorRgb.blue) ** 2,
    // Distance from green
    (0 - baseColorRgb.red) ** 2 + (255 - baseColorRgb.green) ** 2 + (0 - baseColorRgb.blue) ** 2,
    // Distance from black
    (0 - baseColorRgb.red) ** 2 + (0 - baseColorRgb.green) ** 2 + (0 - baseColorRgb.blue) ** 2,
    // Distance from white
    (255 - baseColorRgb.red) ** 2 +
      (255 - baseColorRgb.green) ** 2 +
      (255 - baseColorRgb.blue) ** 2,
  ]
  console.log(
    baseColorHex,
    baseColorRgb,
    distanceFrom,
    Math.min(...distanceFrom),
    distanceFrom.indexOf(Math.min(...distanceFrom)),
    categorisedColorTypeItems[distanceFrom.indexOf(Math.min(...distanceFrom))]
  )
  return categorisedColorTypeItems[distanceFrom.indexOf(Math.min(...distanceFrom))]
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
    hexColor: data.hexColor,
    categorisedColor: data.categorisedColor,
    plasticType: data.plasticType,
    goodCount: data.goodCount,
    plasticImageUrl: '/hoge/huga',
    keycapImageUrl: 'hoge/huga',
    celsius: data.celsius,
    note: data.note,
  }
}

export const upvoteMaterial = async () => {
  if (getCurrentUser() === null) {
    throw new Error('Authentication is required to upvote.')
  }

  const querySnapshot = await getDocs(
    collection(getFirestore(firebaseClientApp), 'keycap-materials')
  )
}

export interface FetchMaterialWithAuthResult {
  material: Material
  isAlreadyUpvoted: boolean
}

export const fetchMaterialWithAuth = async (
  materialId: string
): Promise<FetchMaterialWithAuthResult> => {
  const currentUser = getCurrentUser()
  if (currentUser === null) {
    throw {
      status: HTTP_STATUS.UNAUTHORIZED,
      message: 'Authentication is required to fetch material data.',
    }
  }

  const app = getFirestore(firebaseClientApp)

  const upvotesQuerySnapshot = await getDoc(doc(app, 'upvotes', currentUser.uid))

  let isAlreadyUpvoted: boolean
  if (upvotesQuerySnapshot.exists()) {
    isAlreadyUpvoted = upvotesQuerySnapshot.data().materials.includes(materialId)
  } else {
    isAlreadyUpvoted = false
  }

  const querySnapshot = await getDoc(doc(app, 'keycap-materials', materialId))

  if (!querySnapshot.exists()) {
    throw {
      status: HTTP_STATUS.NOT_FOUND,
      message: `Material with Id = ${materialId} was not found.`,
    }
  }
  const data = querySnapshot.data() as FirestoreMaterialDocument // TODO: as 使わずにいい感じに型付けたい
  const { id } = querySnapshot

  const storage = getStorage(firebaseClientApp)

  const listResult = await listAll(ref(storage, `images/${id}/`))

  const plasticImageFile = listResult.items.filter((item) =>
    item.name.startsWith('plasticImage')
  )[0]
  const keycapImageFile = listResult.items.filter((item) => item.name.startsWith('keycapImage'))[0]

  const plasticImageUrl = await getDownloadURL(
    ref(storage, `images/${id}/${plasticImageFile.name}`)
  )
  const keycapImageUrl = await getDownloadURL(ref(storage, `images/${id}/${keycapImageFile.name}`))

  return {
    material: {
      id: id,
      materialName: data.materialName,
      hexColor: data.hexColor,
      categorisedColor: data.categorisedColor,
      plasticType: data.plasticType,
      goodCount: data.goodCount,
      plasticImageUrl: plasticImageUrl,
      keycapImageUrl: keycapImageUrl,
      celsius: data.celsius,
      note: data.note,
    },
    isAlreadyUpvoted: isAlreadyUpvoted,
  }
}

export interface FetchMaterialsWithAuthResult {
  materials: Material[]
  alreadyUpvoted: string[]
}

export const fetchMaterialsWithAuth = async (): Promise<FetchMaterialsWithAuthResult> => {
  const currentUser = getCurrentUser()
  if (currentUser === null) {
    throw new Error('Authentication is required to fetch material data.')
  }

  const upvotesQuerySnapshot = await getDoc(
    doc(getFirestore(firebaseClientApp), 'upvotes', currentUser.uid)
  )

  let alreadyUpvotedMaterials: string[] = []
  if (upvotesQuerySnapshot.exists()) {
    alreadyUpvotedMaterials = upvotesQuerySnapshot.data().materials
  }

  const querySnapshot = await getDocs(
    collection(getFirestore(firebaseClientApp), 'keycap-materials')
  )
  const storage = getStorage(firebaseClientApp)

  const materials = await Promise.all(
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
        hexColor: data.hexColor,
        categorisedColor: data.categorisedColor,
        plasticType: data.plasticType,
        goodCount: data.goodCount,
        plasticImageUrl: plasticImageUrl,
        keycapImageUrl: keycapImageUrl,
        celsius: data.celsius,
        note: data.note,
      }
    })
  )

  return {
    materials: materials,
    alreadyUpvoted: alreadyUpvotedMaterials,
  }
}

export const ensureRequestIsAuthorized = (req: NextApiRequest) => {
  const authHeader = req.headers.authorization

  if (!authHeader) {
    throw {
      response: HTTP_STATUS.UNAUTHORIZED,
      message: '認証が必要です。',
    }
  }

  if (!authHeader.startsWith('Bearer ')) {
    throw {
      response: HTTP_STATUS.BAD_REQUEST,
      message: '認証トークンのフォーマットが不正です。',
    }
  }
}

export const isErrorResponse = (arg: any): arg is ResponseData => {
  return (
    typeof arg === 'object' &&
    equalsArray(Object.keys(arg), ['status', 'message']) &&
    typeof arg.status === 'number' &&
    typeof arg.message === 'string'
  )
}

const equalsArray = (setA: string[], setB: string[]) => {
  if (setA.length !== setB.length) return false
  for (let i = 0; i < setA.length; i++) {
    if (setA[i] !== setB[i]) return false
  }
  return true
}

export const respondAsInternalServerError = (res: NextApiResponse) => {
  res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
    message: 'サーバーエラーにより素材データの登録ができませんでした。',
  })
}

/**
 * 画像ファイルをBase64形式にエンコードする
 * @param imageBlob 画像ファイル
 */
export const readAsDataURL = async (imageBlob: File): Promise<string | ArrayBuffer> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()

    reader.addEventListener(
      'load',
      () => {
        if (reader.result) {
          resolve(reader.result)
        } else {
          reject('Failed to convert File to object URL.')
        }
      },
      { once: true }
    )

    reader.readAsDataURL(imageBlob)
  })
}
