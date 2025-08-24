// 미션 데이터 타입 정의
export interface Mission {
  id: string
  title: string
  description: string
  points: number
  type: 'special' | 'normal'
  isCompleted: boolean
}

// 스페셜 미션 데이터
export const SPECIAL_MISSIONS: Mission[] = [
  {
    id: 'special-may-family',
    title: '5월은 가정의 달! 5/5, 5/8 중 하루 영수증 인증하기',
    description: '5월 5일 또는 5월 8일에 추천 가게에서 영수증 인증하기',
    points: 1000,
    type: 'special',
    isCompleted: false
  },
  {
    id: 'special-august-vacation',
    title: '8월 여름 휴가 가요. 8/8 ~ 8/15 중 하루 영수증 인증하기',
    description: '8월 8일~15일 중 하루에 추천 가게에서 영수증 인증하기',
    points: 1000,
    type: 'special',
    isCompleted: false
  },
  {
    id: 'special-summer-bingsu',
    title: '너무 더운 여름, 빙수 사먹기',
    description: '추천 받은 가게에서 빙수 메뉴 주문하기',
    points: 1000,
    type: 'special',
    isCompleted: false
  },
  {
    id: 'special-noodle-week',
    title: '이번주는 면이다! 국수나 면 사먹기',
    description: '추천 받은 가게에서 국수나 면 요리 주문하기',
    points: 1000,
    type: 'special',
    isCompleted: false
  },
  {
    id: 'special-newyear-tteok',
    title: '새해 복 많이 받으세요! 떡집 가서 떡 사먹기',
    description: '추천 받은 떡집에서 떡 구매하기',
    points: 1000,
    type: 'special',
    isCompleted: false
  },
  {
    id: 'special-valentine-chocolate',
    title: '스윗 발렌타인, \'초콜릿\'키워드가 들어간 음식 소비하기',
    description: '추천 받은 가게에서 초콜릿이 들어간 메뉴 주문하기',
    points: 1000,
    type: 'special',
    isCompleted: false
  },
  {
    id: 'special-spring-cherryblossom',
    title: '벚꽃이 피는 봄, 메뉴명에 \'벚꽃\'이 들어간 음료 소비하기',
    description: '추천 받은 가게에서 벚꽃이 들어간 음료 주문하기',
    points: 1000,
    type: 'special',
    isCompleted: false
  },
  {
    id: 'special-halloween-pumpkin',
    title: '할로윈데이, \'호박\'이나 \'펌킨\' 들어가는 음식이나 음료 소비하기',
    description: '추천 받은 가게에서 호박이나 펌킨이 들어간 메뉴 주문하기',
    points: 1000,
    type: 'special',
    isCompleted: false
  },
  {
    id: 'special-november-11000',
    title: '11월이에요. 11,000원을 결제 해봐요.',
    description: '추천 받은 가게에서 11,000원 결제하기',
    points: 1000,
    type: 'special',
    isCompleted: false
  },
  {
    id: 'special-autumn-bread',
    title: '빵과 함께 하는 가을. 00빵으로 끝나는 메뉴를 소비하기',
    description: '추천 받은 가게에서 \'빵\'으로 끝나는 메뉴 주문하기',
    points: 1000,
    type: 'special',
    isCompleted: false
  },
  {
    id: 'special-september-9000',
    title: '9월이 왔어요. 9000원 결제하기',
    description: '추천 받은 가게에서 9000원 결제하기',
    points: 1000,
    type: 'special',
    isCompleted: false
  },
  {
    id: 'special-february-2menus',
    title: '2월엔 메뉴 2개! 음식점에서 2개의 메뉴 구매하기',
    description: '추천 받은 가게에서 2개의 메뉴 주문하기',
    points: 1000,
    type: 'special',
    isCompleted: false
  }
]

// 일반 미션 데이터
export const NORMAL_MISSIONS: Mission[] = [
  {
    id: 'ai-recommendation',
    title: 'AI 가게 추천 받고 방문하기',
    description: '오늘의 가게 추천 받고 장소 1곳 방문하기',
    points: 100,
    type: 'normal',
    isCompleted: false
  },
  {
    id: 'lunchtime-visit',
    title: '추천 가게 점심시간에 방문하기',
    description: '추천 받은 가게 1곳에 12:00 ~ 14:00 사이에 방문하기',
    points: 300,
    type: 'normal',
    isCompleted: false
  },
  {
    id: 'dinnertime-visit',
    title: '추천 가게 저녁시간에 방문하기',
    description: '추천 받은 가게 1곳에 18:00 ~ 20:00 사이에 방문하기',
    points: 300,
    type: 'normal',
    isCompleted: false
  },
  {
    id: 'spend-15000',
    title: '15,000원 이상 소비하기',
    description: '추천 받은 가게 중에서 15,000원 이상 소비하기',
    points: 500,
    type: 'normal',
    isCompleted: false
  },
  {
    id: 'spend-20000',
    title: '20,000원 이상 소비하기',
    description: '추천 받은 가게 중에서 20,000원 이상 소비하기',
    points: 700,
    type: 'normal',
    isCompleted: false
  }
]

// 미션 관련 유틸리티 함수들
export const getRandomSpecialMission = (): Mission => {
  const randomIndex = Math.floor(Math.random() * SPECIAL_MISSIONS.length)
  return SPECIAL_MISSIONS[randomIndex]
}

export const getTimeBasedMission = (currentWeek: number): Mission => {
  return currentWeek % 2 === 0 ? NORMAL_MISSIONS[1] : NORMAL_MISSIONS[2]
}

export const getCurrentMissions = (selectedSpecialMission: Mission | null, currentWeek: number): Mission[] => {
  if (!selectedSpecialMission) return []
  
  const timeMission = getTimeBasedMission(currentWeek)
  const otherNormalMissions = NORMAL_MISSIONS.filter(m => 
    m.id !== 'lunchtime-visit' && m.id !== 'dinnertime-visit'
  )
  
  return [selectedSpecialMission, timeMission, ...otherNormalMissions]
}
