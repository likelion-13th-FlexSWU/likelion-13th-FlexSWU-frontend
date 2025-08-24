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
