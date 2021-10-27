export const colorTypeItems: ReadonlyArray<string> = ['red', 'blue', 'green', 'black', 'white']
export type ColorType = typeof colorTypeItems[number]

export const plasticTypeItems: ReadonlyArray<string> = [
  'plastic-a',
  'plastic-b',
  'plastic-c',
  'plastic-d',
]
export type PlasticType = typeof plasticTypeItems[number]

export interface Material {
  id: string
  materialName: string
  colorType: 'red' | 'blue' | 'green' | 'black' | 'white'
  plasticType: string
  goodCount: number
  plasticImageUrl: string
  keycapImageUrl: string
  celsius: number
  note: string
}

export interface FirestoreMaterialDocument {
  materialName: string
  colorType: 'red' | 'blue' | 'green' | 'black' | 'white'
  plasticType: string
  goodCount: number
  celsius: number
  note: string
}

export interface ContentfulMaterialResponse {
  materialName: string
  plasticImage: File
  keycapImage: File
  colorType: ColorType
  colorHex: string
  plasticType: PlasticType
  goodCount: number
  celsius: number
  note: string
}

export interface ContentfulMaterialRequest {
  materialName: { 'en-US': string }
  plasticImage: { 'en-US': any }
  keycapImage: { 'en-US': any }
  colorType: { 'en-US': ColorType }
  colorHex: { 'en-US': string }
  plasticType: { 'en-US': PlasticType }
  goodCount: { 'en-US': number }
  celsius: { 'en-US': number }
  note: { 'en-US': string }
}

export interface RegisterForm {
  plasticImage: FileList
  keycapImage: FileList
  materialName: string
  colorType: string
  plasticType: string
  celsius: number
  note: string
}

export interface RegisterRequestFromClient {
  plasticImage: BinaryData
  keycapImage: BinaryData
  materialName: string
  colorType: string
  plasticType: string
  celsius: string // 受け取るのは数値だが、FormData()の仕様上文字列で送られてくる
  note: string
}

export const HTTP_STATUS = {
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
} as const
