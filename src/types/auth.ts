// 회원가입 요청 타입
export interface SignupRequest {
  identify: string
  password: string
  username: string
  sido: string
  gugun: string
  marketing_agree?: boolean | null
}

// 로그인 요청 타입
export interface LoginRequest {
  identify: string
  password: string
}

// 로그인 응답 타입
export interface LoginResponse {
  access_token: string
  refresh_token: string
  user_id: number
}

// 액세스 토큰 재발급 응답 타입
export interface RefreshResponse {
  accessToken: string
}

// 아이디 중복 확인 요청 타입
export interface CheckIdRequest {
  identify: string
}

// 아이디 중복 확인 응답 타입
export interface CheckIdResponse {
  isDuplicate: boolean
}

// 추천 API 응답 타입
export interface RecommendationResponse {
  username: string
  gugun: string
  today_recommend: {
    stores: StoreInfo[]
  }
  past_recommend: StoreInfo[]
}

// 가게 정보 타입
export interface StoreInfo {
  category: string
  name: string
  address: string
  url: string
}

// 추천 요청 타입
export interface RecommendationRequest {
  region: string[]
  place_category: string
  place_mood: string[]
  duplicate: boolean
}

// 추천 응답 타입
export interface TodayRecommendationResponse {
  place_mood: string[]
  category: string
  stores: TodayStoreInfo[]
}

// 오늘 추천 가게 정보 타입
export interface TodayStoreInfo {
  name: string
  address_road: string
  address_ex: string
  phone: string
  url: string
}

// API 에러 응답 타입
export interface ApiError {
  message: string
  status?: number
}
