import { initializeApp } from 'firebase/app'
import {
  getAuth,
  GoogleAuthProvider,
  signInWithRedirect,
  signOut,
  User,
  onAuthStateChanged,
} from 'firebase/auth'
import React, { createContext, useEffect, useState } from 'react'
import Router from 'next/router'

const firebaseConfig = {
  apiKey: 'AIzaSyB7rR9HaUvlCIs2TrxFO49vuxPAliHF6ao',
  authDomain: 'sustainable-keycap.firebaseapp.com',
  projectId: 'sustainable-keycap',
  storageBucket: 'sustainable-keycap.appspot.com',
  messagingSenderId: '613650466886',
  appId: '1:613650466886:web:128ca2beddee02387ae247',
  measurementId: 'G-QZX2C21DND',
}

export const firebaseClientApp = initializeApp(firebaseConfig)
const auth = getAuth(firebaseClientApp)

export const login = () => {
  const provider = new GoogleAuthProvider()
  return signInWithRedirect(auth, provider)
}

export const logout = async () => {
  try {
    await signOut(auth)
    Router.reload()
  } catch (error) {
    console.error(error)
    // TODO: ログアウト処理に失敗したときの挙動を検討する
  }
}

export const getCurrentUser = (): User | null => {
  const auth = getAuth(firebaseClientApp)
  return auth.currentUser
}

// ログイン状況を表すUnion
export type AuthStatusType = any
export const AuthStatus = {
  NOT_LOGIN: null as AuthStatusType, // 未ログイン状態
  INITIALIZING: undefined as AuthStatusType, // ページを開いた直後に、ログイン状況を取得している段階の状態
} as const
export const AuthContext = createContext<User | AuthStatusType>(AuthStatus.INITIALIZING)

export const AuthProvider: React.FC = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | AuthStatusType>(AuthStatus.INITIALIZING)
  useEffect(() => {
    onAuthStateChanged(auth, setCurrentUser)
  }, [])

  return <AuthContext.Provider value={currentUser}>{children}</AuthContext.Provider>
}
