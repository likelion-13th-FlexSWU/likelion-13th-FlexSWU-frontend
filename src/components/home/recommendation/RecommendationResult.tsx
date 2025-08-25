import React, { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { authAPI } from '../../../services/api'
import type { TodayRecommendationResponse } from '../../../types/auth'

import './RecommendationResult.css'
// 음식 카테고리별 이미지들
import koreanFood1 from '../../../assets/foods/category-korean-1.jpeg'
import japaneseFood1 from '../../../assets/foods/category-japanese-1.jpeg'
import japaneseFood2 from '../../../assets/foods/category-japanese-2.jpeg'
import japaneseFood3 from '../../../assets/foods/category-japanese-3.jpeg'
import chineseFood1 from '../../../assets/foods/category-chinese-1.jpeg'
import chineseFood2 from '../../../assets/foods/category-chinese-2.jpeg'
import chineseFood3 from '../../../assets/foods/category-chinese-3.jpeg'
import westernFood1 from '../../../assets/foods/category-western-1.jpeg'
import westernFood2 from '../../../assets/foods/category-western-2.jpeg'
import cafeFood1 from '../../../assets/foods/category-cafe-1.jpeg'
import cafeFood2 from '../../../assets/foods/category-cafe-2.jpeg'
import cafeFood3 from '../../../assets/foods/category-cafe-3.jpeg'
import icecreamFood1 from '../../../assets/foods/category-icecream-1.jpeg'
import icecreamFood2 from '../../../assets/foods/category-icecream-2.jpeg'
import giftshopFood1 from '../../../assets/foods/category-giftshop-1.jpeg'
import giftshopFood2 from '../../../assets/foods/category-giftshop-2.jpeg'
import omakaseFood1 from '../../../assets/foods/category-omakase-1.jpeg'
import omakaseFood2 from '../../../assets/foods/category-omakase-2.jpeg'


import callIcon from '../../../assets/icons/call.svg'
import houseIcon from '../../../assets/icons/house.svg'
import arrowIcon from '../../../assets/icons/icon-arrow.svg'

// 날씨 기반 추천 데이터 타입 정의
interface WeatherRecommendationData {
  place_mood: null
  category: string
  stores: Array<{
    name: string
    phone: string
    url: string
    address_road: string
    address_ex: string
  }>
}

const RecommendationResult: React.FC = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const [recommendationData, setRecommendationData] = useState<TodayRecommendationResponse | null>(null)
  const [weatherData, setWeatherData] = useState<WeatherRecommendationData | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  // 전달받은 데이터 확인
  useEffect(() => {
    const data = location.state?.recommendationData
    const weather = location.state?.weatherData
    
    console.log('🎯 RecommendationResult - 전체 state 데이터:', location.state)
    console.log('🎯 recommendationData:', data)
    console.log('🎯 weatherData:', weather)
    
    if (data) {
      setRecommendationData(data)
      console.log('🎯 가게 목록:', data.stores)
      console.log('🎯 카테고리:', data.category)
      data.stores.forEach((store: any, index: number) => {
        console.log(`🎯 가게 ${index + 1}:`, store.name, '카테고리:', store.category)
      })
    }
    
    if (weather) {
      setWeatherData(weather)
      console.log('🎯 날씨 기반 추천 데이터:', weather)
    }
  }, [location.state])

  const handleRetry = async () => {
    try {
      setIsLoading(true)
      
      // 로컬 스토리지에서 이전 요청 데이터 가져오기
      const requestData = JSON.parse(localStorage.getItem('recommendationRequest') || 'null')
      
      if (requestData) {
        // 다시하기: 이전 요청 데이터로 /recommend/today 호출
        const response = await authAPI.getTodayRecommendation(requestData)
        
        // 새로운 추천 데이터로 업데이트
        setRecommendationData(response)
        localStorage.setItem('recommendationData', JSON.stringify(response))
        

      } else {
        // 요청 데이터가 없으면 처음부터 시작
        navigate('/home/recommendation')
      }
    } catch (error: any) {
      alert(error.message || '다시하기에 실패했습니다.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleConfirm = async () => {
    try {
      setIsLoading(true)
      
      if (recommendationData) {
        // 추천받기: /recommend/save 호출하여 최종 저장
        await authAPI.saveRecommendation(recommendationData)
        
        // 로컬 스토리지 정리
        localStorage.removeItem('recommendationData')
        localStorage.removeItem('recommendationRequest')
        
        // 홈으로 이동
        navigate('/home')
      }
    } catch (error: any) {
      alert(error.message || '추천을 저장하는데 실패했습니다.')
    } finally {
      setIsLoading(false)
    }
  }

  // 카테고리별 음식 이미지 반환
  const getCategoryFoodImage = (category: string) => {
    // 디버깅 로그 추가
    console.log('🔍 이미지 매핑 요청 - 카테고리:', category)
    console.log('🔍 카테고리 타입:', typeof category)
    
    // 카테고리별로 미리 정의된 이미지 매핑 (API 응답과 정확히 일치)
    const foodImageMap: { [key: string]: any } = {
      // 기본 카테고리
      '한식': [koreanFood1],
      '일식': [japaneseFood1, japaneseFood2, japaneseFood3],
      '중식': [chineseFood1, chineseFood2, chineseFood3],
      '양식': [westernFood1, westernFood2],
      '분식': [koreanFood1], // 분식은 한식 이미지 사용
      '커피': [cafeFood1, cafeFood2, cafeFood3],
      '호프': [westernFood1], // 호프는 양식 이미지 사용
      '일본식 주점': [japaneseFood1, japaneseFood2, japaneseFood3],
      '제과점, 베이커리': [westernFood1], // 베이커리는 양식 이미지 사용
      '아이스크림': [icecreamFood1, icecreamFood2],
      '소품샵': [giftshopFood1, giftshopFood2],
      '오마카세': [omakaseFood1, omakaseFood2],
      
      // API 응답 카테고리명 추가
      '한식당': [koreanFood1],
      '일식당': [japaneseFood1, japaneseFood2, japaneseFood3],
      '중식당': [chineseFood1, chineseFood2, chineseFood3],
      '양식집': [westernFood1, westernFood2],
      '분식집': [koreanFood1],
      '커피 전문점': [cafeFood1, cafeFood2, cafeFood3],
      '호프집': [westernFood1],
      '아이스크림 가게': [icecreamFood1, icecreamFood2]
    }
    
    console.log('🔍 매핑 테이블 키들:', Object.keys(foodImageMap))
    console.log('🔍 카테고리가 매핑 테이블에 있는지:', category in foodImageMap)
    
    const images = foodImageMap[category] || [koreanFood1]
    console.log('🔍 선택된 이미지:', images)
    console.log('🔍 최종 반환 이미지:', images[Math.floor(Math.random() * images.length)])
    
    // 랜덤하게 1개 선택
    return images[Math.floor(Math.random() * images.length)]
  }

  const handleStoreClick = (storeUrl: string) => {
    // 카카오맵 주소로 이동
    if (storeUrl) {
      window.open(storeUrl, '_blank')
    }
  }

  // 데이터가 없으면 로딩 표시
  if (!recommendationData && !weatherData) {
    return (
      <div className="recommendation-result-container">
        <div className="loading-message">추천 데이터를 불러오는 중...</div>
      </div>
    )
  }

  return (
    <div className="recommendation-result-container">
      {/* 1섹션: 타이틀 (배경 포함) */}
      <section className="result-hero-section">
        <div className="result-title-section">
          <h1 className="result-title">
            {weatherData?.place_mood 
              ? (
                <>
                  오늘 날씨에 맞는<br />
                  가게를 찾았어요!
                </>
              )
              : (
                <>
                  취향과 무드에 맞는<br />
                  가게를 찾았어요!
                </>
              )
            }
          </h1>
          <p className="result-subtitle">
            총 {weatherData?.stores.length || recommendationData?.stores.length}개
          </p>
        </div>
      </section>

      {/* 메인 콘텐츠 */}
      <div className="result-content">

        {/* 추천 결과 리스트 */}
        <div className="result-stores-list">
          {(weatherData?.stores || recommendationData?.stores)?.map((store, index) => (
            <div key={index} className="result-store-card">
              {/* 티켓 가운데 점선 구분선 */}
              <div className="ticket-divider"></div>
              
              {/* 티켓 위쪽: 음식 이미지 + 가게 이름 */}
              <div className="ticket-upper">
                {/* 음식 이미지 */}
                <div className="store-image-container">
                  <img 
                    src={getCategoryFoodImage(weatherData?.category || '한식')} 
                    alt="음식" 
                    className="store-image"
                  />
                </div>
                
                <div className="store-name-container">
                  <h3 className="store-name">{store.name}</h3>
                </div>
                
                {/* 우측 상단 화살표 아이콘 */}
                <button 
                  className="store-arrow-button"
                  onClick={() => handleStoreClick(store.url)}
                >
                  <img src={arrowIcon} alt="가게 상세보기" className="arrow-icon" />
                </button>
              </div>
              
              {/* 티켓 아래쪽: 전화번호 + 주소 */}
              <div className="ticket-lower">
                                  <div className="store-details">
                    <div className="store-detail-item">
                      <img src={callIcon} alt="전화" className="detail-icon" />
                      <span className="detail-text">
                        {store.phone || '전화번호가 없어요.'}
                      </span>
                    </div>
                    
                    <div className="store-detail-item">
                      <img src={houseIcon} alt="주소" className="detail-icon" />
                      <span className="detail-text">{store.address_road}</span>
                    </div>
                  </div>
              </div>
            </div>
          ))}
        </div>

        {/* 하단 버튼들 */}
        <div className="result-buttons">
          {!weatherData?.place_mood && (
            <button 
              className="retry-button" 
              onClick={handleRetry}
              disabled={isLoading}
            >
              {isLoading ? '처리 중...' : '다시하기'}
            </button>
          )}
          <button 
            className={`confirm-button ${weatherData?.place_mood ? 'home-button' : ''}`}
            onClick={weatherData?.place_mood ? () => navigate('/home') : handleConfirm}
            disabled={isLoading}
          >
            {isLoading 
              ? (weatherData?.place_mood ? '이동 중...' : '저장 중...') 
              : (weatherData?.place_mood ? '홈으로' : '추천받기')
            }
          </button>
        </div>
      </div>
    </div>
  )
}

export default RecommendationResult
