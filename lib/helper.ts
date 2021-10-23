import { FirestoreMaterialDocument, Material } from '../types'

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
