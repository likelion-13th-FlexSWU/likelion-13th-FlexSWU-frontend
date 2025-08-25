import axios from 'axios'
import type { AxiosInstance, AxiosResponse } from 'axios'
import type { 
  SignupRequest, 
  SignupResponse,
  LoginRequest, 
  LoginResponse, 
  CheckIdRequest,
  RecommendationResponse,
  RecommendationRequest,
  TodayRecommendationResponse,
  UserInfo,
  UpdateNicknameRequest,
  UpdateRegionRequest
} from '../types/auth'
import type { 
  MissionResponse, 
  MissionCheckRequest,
  MissionReviewRequest,
  MissionReviewResponse,
  ReviewListResponse
} from '../types/mission'

// API 기본 설정
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

// Axios 인스턴스 생성
const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 50000,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: false, // CORS 문제 해결을 위해 추가
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
  signup: async (data: SignupRequest): Promise<SignupResponse> => {
    try {
      const response = await api.post('/user/signup', data)
      return response.data
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
  },

  // 사용자 정보 가져오기
  getUserInfo: async (): Promise<UserInfo> => {
    try {
      const response = await api.get('/user')
      console.log('API 응답 전체:', response) // 전체 응답 로그
      console.log('API 응답 데이터:', response.data) // 응답 데이터 로그
      
      // API 응답 구조가 예상과 다를 수 있으니 데이터 변환 로직 추가
      const rawData = response.data
      let transformedData: UserInfo
      
      // 응답 구조에 따라 데이터 변환
      if (rawData.monthly && Array.isArray(rawData.monthly)) {
        // 기존 구조와 동일한 경우
        transformedData = rawData
      } else if (rawData.contribution && rawData.contribution.monthly) {
        // contribution.monthly 구조인 경우
        transformedData = {
          sido: rawData.sido || rawData.region?.sido || "서울",
          gugun: rawData.gugun || rawData.region?.gugun || "노원구",
          username: rawData.username || rawData.name || "사용자",
          type: rawData.type || null,
          monthly: rawData.contribution.monthly.map((item: any) => ({
            month: item.month || item.period,
            score: item.score || item.points || 0
          }))
        }
      } else if (rawData.region_contribution) {
        // region_contribution 구조인 경우
        transformedData = {
          sido: rawData.sido || rawData.region?.sido || "서울",
          gugun: rawData.gugun || rawData.region?.gugun || "노원구",
          username: rawData.username || rawData.name || "사용자",
          type: rawData.type || null,
          monthly: rawData.region_contribution.map((item: any) => ({
            month: item.month || item.period,
            score: item.score || item.points || 0
          }))
        }
      } else {
        // 기본 구조
        transformedData = {
          sido: rawData.sido || "서울",
          gugun: rawData.gugun || "노원구",
          username: rawData.username || "사용자",
          type: rawData.type || null,
          monthly: []
        }
      }
      
      console.log('변환된 데이터:', transformedData) // 변환된 데이터 로그
      return transformedData
    } catch (error: any) {
      console.error('getUserInfo API 에러:', error) // 에러 로그 추가
      throw new Error(error.response?.data?.message || '사용자 정보를 가져오는데 실패했습니다.')
    }
  },

  // 닉네임 변경
  updateNickname: async (data: UpdateNicknameRequest): Promise<void> => {
    try {
      await api.patch('/user/update/nick', data)
    } catch (error: any) {
      throw new Error(error.response?.data?.message || '닉네임 변경에 실패했습니다.')
    }
  },

  // 지역 변경
  updateRegion: async (data: UpdateRegionRequest): Promise<void> => {
    try {
      await api.patch('/user/update/region', data)
    } catch (error: any) {
      throw new Error(error.response?.data?.message || '지역 변경에 실패했습니다.')
    }
  },

  // 오늘의 추천 받기 (조회용)
  getTodayRecommendation: async (data: RecommendationRequest): Promise<TodayRecommendationResponse> => {
    try {
      const response = await api.post('/recommend/today', data)
      
      // 응답 데이터 유효성 검사
      if (response.data && response.data.stores) {
        // 추천 결과가 있는 경우
        if (response.data.stores.length > 0) {
          return response.data
        } else {
          // 추천 결과가 없는 경우
          throw new Error('NO_RESULTS')
        }
      } else {
        throw new Error('응답 데이터 형식이 올바르지 않습니다.')
      }
    } catch (error: any) {
      // axios 에러가 아닌 경우
      if (!error.response) {
        throw new Error('네트워크 오류가 발생했습니다.')
      }
      
      // HTTP 에러 응답
      const status = error.response?.status
      const message = error.response?.data?.message || '오늘의 추천을 가져오는데 실패했습니다.'
      
      throw new Error(`${message} (${status})`)
    }
  },

  // 날씨 기반 추천 받기
  getWeatherBasedRecommendation: async (region: string[]): Promise<any> => {
    try {
      const response = await api.post('/recommend/today?weather=true', {
        region,
        duplicate: false
      })
      return response.data
    } catch (error: any) {
      // 타임아웃 에러인지 확인
      if (error.code === 'ECONNABORTED') {
        throw new Error('요청 시간이 초과되었습니다. 서버 응답이 느리거나 엔드포인트가 존재하지 않을 수 있습니다.')
      }
      
      throw new Error(error.response?.data?.message || '날씨 기반 추천을 가져오는데 실패했습니다.')
    }
  },

  // 추천 저장 (최종저장용)
  saveRecommendation: async (data: TodayRecommendationResponse): Promise<void> => {
    try {
      await api.post('/recommend/save', data)
    } catch (error: any) {
      throw new Error(error.response?.data?.message || '추천을 저장하는데 실패했습니다.')
    }
  }
}

// 미션 관련 API 함수들
export const missionAPI = {
  // 미션 데이터 가져오기
  getMissions: async (): Promise<MissionResponse> => {
    try {
      const response = await api.get('/mission')
      return response.data
    } catch (error: any) {
      throw new Error(error.response?.data?.message || '미션 데이터를 가져오는데 실패했습니다.')
    }
  },

  // 미션 인증
  checkMission: async (data: MissionCheckRequest): Promise<void> => {
    try {
      const response = await api.post('/mission/check', data)
      return response.data
    } catch (error: any) {
      // Axios 에러인지 확인
      if (error.isAxiosError) {
        const status = error.response?.status
        const errorData = error.response?.data
        
        if (status === 400) {
          throw new Error(`잘못된 요청입니다: ${errorData?.message || '데이터 형식이 올바르지 않습니다.'}`)
        } else if (status === 401) {
          throw new Error('인증이 필요합니다. 다시 로그인해주세요.')
        } else if (status === 403) {
          throw new Error('권한이 없습니다.')
        } else if (status === 404) {
          throw new Error('요청한 리소스를 찾을 수 없습니다.')
        } else if (status >= 500) {
          throw new Error('서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.')
        } else {
          throw new Error(`요청 실패 (${status}): ${errorData?.message || '알 수 없는 오류'}`)
        }
      } else if (error.response) {
        // 일반적인 HTTP 에러
        const status = error.response.status
        const errorData = error.response.data
        
        if (status === 400) {
          throw new Error(`잘못된 요청입니다: ${errorData?.message || '데이터 형식이 올바르지 않습니다.'}`)
        } else {
          throw new Error(`요청 실패 (${status}): ${errorData?.message || '알 수 없는 오류'}`)
        }
      } else if (error.request) {
        // 요청은 보냈지만 응답을 받지 못한 경우
        throw new Error('서버에 연결할 수 없습니다. 네트워크 연결을 확인해주세요.')
      } else {
        // 요청 자체를 보내지 못한 경우
        throw new Error(`요청 설정 오류: ${error.message}`)
      }
    }
  },

  // 리뷰 작성
  createReview: async (data: MissionReviewRequest): Promise<MissionReviewResponse> => {
    try {
      const response = await api.post('/mission/review', data)
      return response.data
    } catch (error: any) {
      throw new Error(error.response?.data?.message || '리뷰 작성에 실패했습니다.')
    }
  },

  // 리뷰 목록 조회
  getReviews: async (): Promise<ReviewListResponse> => {
    try {
      const response = await api.get('/mission/review')
      return response.data
    } catch (error: any) {
      throw new Error(error.response?.data?.message || '리뷰 목록을 가져오는데 실패했습니다.')
    }
  },

  // 리뷰 삭제
  deleteReview: async (reviewId: string): Promise<void> => {
    try {
      await api.delete(`/mission/review/delete/${reviewId}`)
    } catch (error: any) {
      throw new Error(error.response?.data?.message || '리뷰 삭제에 실패했습니다.')
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

// OCR 관련 API 함수들
export const ocrAPI = {
  // Tesseract.js를 사용한 OCR (클라이언트 사이드)
  tesseractOCR: async (_imageUrl: string): Promise<string> => {
    // 이 함수는 클라이언트 사이드에서 직접 호출
    // Tesseract.js를 사용하여 OCR 처리
    return ''
  }
}

export default api
