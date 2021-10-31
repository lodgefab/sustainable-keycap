export const colorTypeItems: ReadonlyArray<string> = [
  '#ffcdd2',
  '#e57373',
  '#f44336',
  '#d32f2f',
  '#b71c1c',
  '#f8bbd0',
  '#f06292',
  '#e91e63',
  '#c2185b',
  '#880e4f',
  '#e1bee7',
  '#ba68c8',
  '#9c27b0',
  '#7b1fa2',
  '#4a148c',
  '#d1c4e9',
  '#9575cd',
  '#673ab7',
  '#512da8',
  '#311b92',
  '#c5cae9',
  '#7986cb',
  '#3f51b5',
  '#303f9f',
  '#1a237e',
  '#bbdefb',
  '#64b5f6',
  '#2196f3',
  '#1976d2',
  '#0d47a1',
  '#b3e5fc',
  '#4fc3f7',
  '#03a9f4',
  '#0288d1',
  '#01579b',
  '#b2ebf2',
  '#4dd0e1',
  '#00bcd4',
  '#0097a7',
  '#006064',
  '#b2dfdb',
  '#4db6ac',
  '#009688',
  '#00796b',
  '#004d40',
  '#c8e6c9',
  '#81c784',
  '#4caf50',
  '#388e3c',
  '#194D33',
  '#dcedc8',
  '#aed581',
  '#8bc34a',
  '#689f38',
  '#33691e',
  '#f0f4c3',
  '#dce775',
  '#cddc39',
  '#afb42b',
  '#827717',
  '#fff9c4',
  '#fff176',
  '#ffeb3b',
  '#fbc02d',
  '#f57f17',
  '#ffecb3',
  '#ffd54f',
  '#ffc107',
  '#ffa000',
  '#ff6f00',
  '#ffe0b2',
  '#ffb74d',
  '#ff9800',
  '#f57c00',
  '#e65100',
  '#ffccbc',
  '#ff8a65',
  '#ff5722',
  '#e64a19',
  '#bf360c',
  '#d7ccc8',
  '#a1887f',
  '#795548',
  '#5d4037',
  '#3e2723',
  '#cfd8dc',
  '#90a4ae',
  '#607d8b',
  '#455a64',
  '#263238',
  '#FFFFFF',
  '#D9D9D9',
  '#969696',
  '#525252',
  '#000000',
]

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
  METHOD_NOT_ALLOWED: 405,
  CONFLICT: 409,
  INTERNAL_SERVER_ERROR: 500,
} as const

export interface ResponseData {
  status: number
  message: string
}
