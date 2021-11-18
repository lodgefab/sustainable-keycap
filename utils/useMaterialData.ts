import { Material } from '../types'
import { useEffect, useState } from 'react'
import axios from 'axios'
import { MaterialsApiResponse } from '../pages/api/materials'
import Axios from 'axios'

/**
 * 素材データを取得するカスタムフック
 * 投稿された素材データの配列といいね時に素材のいいね数を更新するための関数を返します。
 */
const useMaterialData = (): [Material[], (materialId: string, newCount: number) => void] => {
  const [materials, setMaterials] = useState<Material[]>([])

  /**
   * いいねの数を変更する
   * @param materialId 変更するキーキャップ素材のID
   * @param newCount 変更後のいいねの数
   */
  const setGoodCount = async (materialId: string, newCount: number) => {
    await setMaterials(
      materials.map((material) => {
        if (material.id === materialId) {
          material.goodCount = newCount
        }
        return material
      })
    )
  }

  // キーキャップ素材データを取得する処理
  useEffect(() => {
    ;(async () => {
      let data: Material[]
      try {
        const response = await axios
          .get<MaterialsApiResponse>('/api/materials')
          .then((res) => res.data)
        data = response.materials!
        setMaterials(data)
      } catch (e) {
        if (Axios.isAxiosError(e) && e.response) {
          console.log(e)
        }
        console.log(e)
      }
    })()
  }, [])

  return [materials, setGoodCount]
}

export default useMaterialData
