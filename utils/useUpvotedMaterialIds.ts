import { useContext, useMemo, useState } from 'react'
import { AuthContext, firebaseClientApp } from '../lib/auth'
import { getAuth } from 'firebase/auth'
import { doc, getDoc, getFirestore } from 'firebase/firestore'

/**
 * 現在ログイン中のユーザーがいいねを押した素材データのIDのリストを取得するカスタムフック
 * いいねを押した素材のIDの配列といいね時にIDの配列を更新するための関数を返します。
 * ページ読み込み直後にログイン状況を確認している最中はundefined、未ログインの場合はnullを返します。
 */
const useUpvotedMaterialIds = (): [
  string[] | 'initializing' | null,
  (upvotedMaterialId: string) => void
] => {
  const authState = useContext(AuthContext)
  const currentUser = getAuth().currentUser

  const [upvotedMaterialIds, setUpvotedMaterialIds] = useState<string[] | 'initializing' | null>(
    'initializing'
  )

  const addUpvotedMaterialId = (upvotedMaterialId: string) => {
    if (upvotedMaterialIds instanceof Array) {
      setUpvotedMaterialIds([upvotedMaterialId, ...upvotedMaterialIds])
    } else {
      throw new Error(
        'Failed to add upvoted Material because the app is initializing or you are not logged in.'
      )
    }
  }

  useMemo(() => {
    ;(async () => {
      if (authState === 'LOGGED_IN' && currentUser) {
        const app = getFirestore(firebaseClientApp)
        const upvotesQuerySnapshot = await getDoc(doc(app, 'upvotes', currentUser.uid))
        if (upvotesQuerySnapshot.exists()) {
          setUpvotedMaterialIds(upvotesQuerySnapshot.data().materials)
        }
      } else if (authState !== 'INITIALIZING') {
        setUpvotedMaterialIds(null)
      }
    })()
  }, [authState, currentUser])

  return [upvotedMaterialIds, addUpvotedMaterialId]
}

export default useUpvotedMaterialIds
