interface Material {
  id: string
  title: string
  colorHex: string
  colorType: 'red' | 'blue' | 'green' | 'black' | 'white'
  goodCount: number
  iconUrl: string
  bgImageUrl: string
}

interface ContentfulMaterialFields {
  title: string
  colorHex: string
  colorType: 'red' | 'blue' | 'green' | 'black' | 'white'
  goodCount: number
  iconUrl?: string
  bgImageUrl?: string
}
