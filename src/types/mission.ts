// 미션 타입
export interface APIMission {
  id: number
  title: string
  body: string
  score: number
  _special: boolean
  is_verified: boolean
  is_reviewed: boolean
}

// 미션 인증 요청 타입
export interface MissionCheckRequest {
  mission_id: number
  address: string
  name: string
  visited_at: string
  phone_num: string
  total_price: number
}

// 리뷰 작성 요청 타입
export interface MissionReviewRequest {
  mission_id: number
  tags: number[]  // 숫자 배열로 변경
  content: string | null
}

// 리뷰 작성 응답 타입
export interface MissionReviewResponse {
  review_id: number
}

// 리뷰 태그 타입
export interface ReviewTag {
  code: string
}

// 리뷰 조회 응답 타입
export interface ReviewItem {
  reviewid: string
  placeName: string
  content: string
  tags: ReviewTag[]
  visitedAt: string
  createdAt: string
}

export interface ReviewListResponse {
  content: ReviewItem[]
}

// 지역 기여도 데이터 타입
export interface MissionResponse {
  gugun: string
  region: {
    rank: number
    score: number
  }
  me: {
    rank: number
    score: number
  }
  missions: APIMission[]
}
