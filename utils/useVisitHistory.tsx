import { useEffect, useState } from 'react'
import Cookies from 'js-cookie'

const useVisitHistory = () => {
  const [isAlreadyVisited, setAlreadyVisited] = useState<boolean | null>(null)

  // 初回訪問時のみローディングアニメーションを表示させるため、Cookieから訪問履歴を取得してStateに反映する
  useEffect(() => {
    const isAlreadyVisitedCookie = Cookies.get('isAlreadyVisited')
    setAlreadyVisited(isAlreadyVisitedCookie === 'true')
    Cookies.set('isAlreadyVisited', 'true', {
      expires: 0.02083333, // 単位は日。0.0208日は約30分
    })
  }, [])

  return isAlreadyVisited
}

export default useVisitHistory
