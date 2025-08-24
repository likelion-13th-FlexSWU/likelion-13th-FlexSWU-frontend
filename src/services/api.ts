import axios from 'axios'
import type { AxiosInstance, AxiosResponse } from 'axios'
import type { 
  SignupRequest, 
  LoginRequest, 
  LoginResponse, 
  RefreshResponse,
  CheckIdRequest,
  RecommendationResponse,
  ApiError 
} from '../types/auth'

// API 기본 설정
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

// Axios 인스턴스 생성
const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// 요청 인터셉터 - 토큰 자동 추가
api.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem('accessToken')
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// 응답 인터셉터 - 토큰 만료 시 자동 갱신
api.interceptors.response.use(
  (response: AxiosResponse) => {
    return response
  },
  async (error) => {
    const originalRequest = error.config

    // 401 에러이고 아직 재시도하지 않은 경우
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true

      try {
        const refreshToken = localStorage.getItem('refreshToken')
        if (refreshToken) {
          const response = await api.get('/user/refresh', {
            headers: {
              Authorization: `Bearer ${refreshToken}`
            }
          })
          
          const { accessToken } = response.data
          localStorage.setItem('accessToken', accessToken)
          
          // 원래 요청 재시도
          originalRequest.headers.Authorization = `Bearer ${accessToken}`
          return api(originalRequest)
        }
      } catch (refreshError) {
        // 리프레시 토큰도 만료된 경우 로그아웃 처리
        localStorage.removeItem('accessToken')
        localStorage.removeItem('refreshToken')
        localStorage.removeItem('userId')
        window.location.href = '/login'
        return Promise.reject(refreshError)
      }
    }

    return Promise.reject(error)
  }
)

// 인증 관련 API 함수들
export const authAPI = {
  // 회원가입
  signup: async (data: SignupRequest): Promise<void> => {
    try {
      await api.post('/user/signup', data)
    } catch (error: any) {
      throw new Error(error.response?.data?.message || '회원가입에 실패했습니다.')
    }
  },

  // 로그인
  login: async (data: LoginRequest): Promise<LoginResponse> => {
    try {
      const response = await api.post('/user/login', data)
      return response.data
    } catch (error: any) {
      throw new Error(error.response?.data?.message || '로그인에 실패했습니다.')
    }
  },

  // 아이디 중복 확인
  checkId: async (data: CheckIdRequest): Promise<boolean> => {
    try {
      const response = await api.post('/user/check', data)
      return response.data
    } catch (error: any) {
      console.error('아이디 중복 확인 API 오류:', error.response?.status, error.response?.data)
      throw new Error(error.response?.data?.message || `아이디 중복 확인에 실패했습니다. (${error.response?.status})`)
    }
  },

  // 액세스 토큰 재발급
  refreshToken: async (): Promise<string> => {
    try {
      const refreshToken = localStorage.getItem('refreshToken')
      if (!refreshToken) {
        throw new Error('리프레시 토큰이 없습니다.')
      }

      const response = await api.get('/user/refresh', {
        headers: {
          Authorization: `Bearer ${refreshToken}`
        }
      })
      
      return response.data.accessToken
    } catch (error: any) {
      throw new Error(error.response?.data?.message || '토큰 재발급에 실패했습니다.')
    }
  },

  // 추천 메인 페이지 데이터 가져오기
  getRecommendation: async (): Promise<RecommendationResponse> => {
    try {
      const response = await api.get('/recommend')
      return response.data
    } catch (error: any) {
      throw new Error(error.response?.data?.message || '추천 데이터를 가져오는데 실패했습니다.')
    }
  }
}

// 토큰 관리 유틸리티
export const tokenUtils = {
  // 토큰 저장
  setTokens: (accessToken: string, refreshToken: string, userId: number) => {
    localStorage.setItem('accessToken', accessToken)
    localStorage.setItem('refreshToken', refreshToken)
    localStorage.setItem('userId', userId.toString())
  },

  // 토큰 제거
  removeTokens: () => {
    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')
    localStorage.removeItem('userId')
  },

  // 액세스 토큰 가져오기
  getAccessToken: () => localStorage.getItem('accessToken'),

  // 리프레시 토큰 가져오기
  getRefreshToken: () => localStorage.getItem('refreshToken'),

  // 사용자 ID 가져오기
  getUserId: () => localStorage.getItem('userId'),

  // 로그인 상태 확인
  isLoggedIn: () => !!localStorage.getItem('accessToken')
}

export default api
