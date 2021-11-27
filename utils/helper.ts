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

/**
 * Hex形式のカラーコードの各要素を10進数に変換します。
 * Convert hex format string to rgb format string.
 * @param baseColorHex Hex形式のカラーコード
 */
export const convertHexToRgb = (
  baseColorHex: string
): { red: number; green: number; blue: number } => {
  const match = baseColorHex.match(/^#([0-9A-F]{2})([0-9A-F]{2})([0-9A-F]{2})$/)
  if (!match) {
    throw new Error('カラーコードの形式がが正しくありません。"#"と16進数6桁で表現してください。')
  }

  // matchの中身の要素は、[1]がred、[2]がgreen、[3]がblueを表す16進数の文字列
  const [hexRed, hexGreen, hexBlue] = match.slice(1, 4)

  return {
    red: parseInt(hexRed, 16),
    green: parseInt(hexGreen, 16),
    blue: parseInt(hexBlue, 16),
  }
}

/**
 * RGB形式の色情報をHSV形式に変換します。
 * @param rgb RGB形式の色情報
 * @return HSV形式の色情報（Hは0~360, Sは0~100, Vは0~100）
 */
export const convertRgbToHsv = (rgb: {
  red: number
  green: number
  blue: number
}): { hue: number; saturation: number; value: number } => {
  const { red, green, blue } = rgb
  const max = Math.max(red, green, blue)
  const min = Math.min(red, green, blue)
  const delta = max - min

  let hue = 0
  let saturation = 0
  let value = (max / 255) * 100

  if (max !== 0) {
    saturation = (delta / max) * 100
  }

  if (red === green && green === blue) {
    hue = 0
  } else if (max === red) {
    hue = (60 * (green - blue)) / delta
  } else if (max === green) {
    hue = (60 * (blue - red)) / delta + 120
  } else if (max === blue) {
    hue = (60 * (red - green)) / delta + 240
  }

  if (hue < 0) {
    hue += 360
  }

  return { hue, saturation, value }
}

/**
 * Hex形式のカラーコードを白、黒、赤、緑、青の5色の中から最も近い色に分類します。
 * @param baseColorHex "#"から開始されるHex形式のカラーコード
 * @return 分類した結果
 */
export const categoriseColor = (baseColorHex: string): CategorisedColorType => {
  const baseColorHsv = convertRgbToHsv(convertHexToRgb(baseColorHex))

  const hsv = {
    red: { hue: 0, saturation: 100, value: 100 },
    green: { hue: 120, saturation: 100, value: 100 },
    blue: { hue: 240, saturation: 100, value: 100 },
    black: { hue: 0, saturation: 0, value: 0 },
    white: { hue: 0, saturation: 0, value: 100 },
  }

  // HSV空間における赤、緑、青、黒、白からの距離を算出する
  const distanceFrom = [hsv.red, hsv.green, hsv.blue, hsv.black, hsv.white].map(
    (colorHsv) =>
      (colorHsv.saturation * Math.cos((Math.PI * colorHsv.hue) / 180) -
        baseColorHsv.saturation * Math.cos((Math.PI * baseColorHsv.hue) / 180)) **
        2 +
      (colorHsv.saturation * Math.sin((Math.PI * colorHsv.hue) / 180) -
        baseColorHsv.saturation * Math.sin((Math.PI * baseColorHsv.hue) / 180)) **
        2 *
        2 +
      (colorHsv.value - baseColorHsv.value) ** 2
  )

  // 計算した5つの距離から一番値が小さいものに対応する色の名前を取り出して返す
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
