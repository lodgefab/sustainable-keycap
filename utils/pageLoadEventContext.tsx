import React, { createContext, Reducer, useEffect, useReducer } from 'react'

type PageLoadState = 'loading' | 'ready'

export const DispatchPageReadyContext = createContext<() => void>(() => {})
export const UsePageLoadEventContext = createContext<(callback: () => void) => void>((_) => {})

/**
 * ページの表示に必要なデータをすべて読み込みんで、表示できる状態になったかどうかを管理するStateを持ち、
 * Contextを用いてその値をコンポーネント内で更新・参照できるようにするためのラッパーコンポーネント
 */
export const PageLoadEventProvider: React.FC = ({ children }) => {
  /**
   * ページの読み込み状況を管理するReducer関数
   */
  const reducerFunc: Reducer<PageLoadState, 'getReady'> = (countState, action) => {
    switch (action) {
      case 'getReady':
        return 'ready'
      default:
        return countState
    }
  }

  // ページの読み込み状況を管理するReducer
  const [pageLoadState, dispatch] = useReducer(reducerFunc, 'loading')

  /**
   * getReady actionを発火してpageLoadStateをreadyに変更するラッパー関数
   **/
  const dispatchPageReady = () => dispatch('getReady')

  /**
   * pageLoadStateがreadyに変化した時に実行したい関数を設定する
   * @param callback 実行したい関数
   */
  const usePageLoadEvent = (callback: () => void) => {
    useEffect(() => {
      if (pageLoadState === 'ready') {
        callback()
      }
    }, [callback])
  }

  return (
    // useContext(DispatchPageReadyContext) で、dispatchPageReadyを取得でき、それを使ってページの読み込み状況を更新する
    // useContext(DispatchPageReadyContext) で、usePageLoadEventを取得でき、それを使って読み込み状況がreadyに変化した時の
    // コールバック関数を設定できる
    <DispatchPageReadyContext.Provider value={dispatchPageReady}>
      <UsePageLoadEventContext.Provider value={usePageLoadEvent}>
        {children}
      </UsePageLoadEventContext.Provider>
    </DispatchPageReadyContext.Provider>
  )
}
