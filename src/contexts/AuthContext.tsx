import React, { createContext, useContext, useState, useEffect } from 'react'
import type { ReactNode } from 'react'
import { tokenUtils } from '../services/api'

interface AuthContextType {
  isAuthenticated: boolean
  userId: string | null
  login: (accessToken: string, refreshToken: string, userId: number) => void
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

interface AuthProviderProps {
  children: ReactNode
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [userId, setUserId] = useState<string | null>(null)

  useEffect(() => {
    // 컴포넌트 마운트 시 로컬 스토리지에서 인증 상태 확인
    const accessToken = tokenUtils.getAccessToken()
    const storedUserId = tokenUtils.getUserId()
    
    if (accessToken && storedUserId) {
      setIsAuthenticated(true)
      setUserId(storedUserId)
    }
  }, [])

  const login = (accessToken: string, refreshToken: string, userId: number) => {
    tokenUtils.setTokens(accessToken, refreshToken, userId)
    setIsAuthenticated(true)
    setUserId(userId.toString())
  }

  const logout = () => {
    tokenUtils.removeTokens()
    setIsAuthenticated(false)
    setUserId(null)
  }

  const value: AuthContextType = {
    isAuthenticated,
    userId,
    login,
    logout
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}
