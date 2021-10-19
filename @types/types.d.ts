interface Material {
  id: string
  materialName: string
  colorType: 'red' | 'blue' | 'green' | 'black' | 'white'
  plasticType: string
  goodCount: number
  plasticImageUrl: string
  keycapImageUrl: string
}

interface FirestoreMaterialDocument {
  materialName: string
  colorType: 'red' | 'blue' | 'green' | 'black' | 'white'
  plasticType: string
  goodCount: number
}
