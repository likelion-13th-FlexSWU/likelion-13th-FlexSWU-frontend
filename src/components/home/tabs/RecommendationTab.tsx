import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { authAPI } from '../../../services/api'
import type { RecommendationResponse, StoreInfo } from '../../../types/auth'
import './RecommendationTab.css'
import arrowIcon from '../../../assets/icons/icon-arrow-right.svg'
import iconArrow from '../../../assets/icons/icon-arrow.svg'
import cafeBg1 from '../../../assets/backgrounds/cafe-bg-1.png'
import koreanBg1 from '../../../assets/backgrounds/korean-bg-1.png'
import koreanBg2 from '../../../assets/backgrounds/korean-bg-2.png'
import bgAfter from '../../../assets/backgrounds/bg-after.svg'
import store01 from '../../../assets/stores/store-01.png'
import store02 from '../../../assets/stores/store-02.png'
import store03 from '../../../assets/stores/store-03.png'
import store04 from '../../../assets/stores/store-04.png'
import store05 from '../../../assets/stores/store-05.png'
import store06 from '../../../assets/stores/store-06.png'
import store07 from '../../../assets/stores/store-07.png'
import store08 from '../../../assets/stores/store-08.png'
import recommend1 from '../../../assets/icons/recommend-1.svg'
import recommend2 from '../../../assets/icons/recommend-2.svg'
import recommend3 from '../../../assets/icons/recommend-3.svg'
import recommend4 from '../../../assets/icons/recommend-4.svg'
import recommend5 from '../../../assets/icons/recommend-5.svg'

const RecommendationTab: React.FC = () => {
  const navigate = useNavigate()
  const [recommendationData, setRecommendationData] = useState<RecommendationResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // 추천 데이터 가져오기
  useEffect(() => {
    const fetchRecommendationData = async () => {
      try {
        setLoading(true)
        const data = await authAPI.getRecommendation()
        setRecommendationData(data)
        setError(null)
      } catch (err: any) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    // userInfo가 있든 없든 API 호출 시도
    fetchRecommendationData()
  }, []) // userInfo 의존성 제거



  // 사용자 정보가 없으면 기본값 사용
  const userNickname = recommendationData?.username || "노원구히어로"
  const userDistrict = recommendationData?.gugun || "노원구"



  const handleRecommendationClick = () => {
    // 사용자 구 정보와 함께 추천 폼으로 이동
    navigate('/home/recommendation', { 
      state: { userDistrict: userDistrict } 
    })
  }

  // 카테고리별 배경 이미지 반환 (stores 이미지도 활용)
  const getCategoryBackground = (category: string, index: number) => {
    // stores 이미지들을 카테고리별로 매핑
    const storeImages = [store01, store02, store03, store04, store05, store06, store07, store08]
    
    // 카테고리별로 다른 배경 이미지 사용
    switch (category) {
      case '한식':
        return index % 2 === 0 ? koreanBg1 : koreanBg2
      case '카페':
      case '커피':
        return cafeBg1
      case '양식':
        return index % 2 === 0 ? koreanBg2 : koreanBg1
      case '분식':
        return index % 2 === 0 ? store01 : store02
      case '일식':
        return index % 2 === 0 ? store03 : store04
      case '중식':
        return index % 2 === 0 ? store05 : store06
      default:
        // 기본적으로 stores 이미지와 배경 이미지를 번갈아가며 사용
        return index % 2 === 0 ? storeImages[index % storeImages.length] : koreanBg1
    }
  }

  // 번호 아이콘 반환
  const getRecommendNumber = (index: number) => {
    const numbers = [recommend1, recommend2, recommend3, recommend4, recommend5]
    return numbers[index] || recommend1
  }

  return (
    <div className="recommendation-tab">
      {/* 1섹션: 타이틀 + 추천 배너 */}
      <section className="hero-banner-section">
        <div className="hero-title-wrapper">
          <div className="hero-title-text">
            <h1>🏠<span className="user-nickname">{userNickname}</span>님을 위한</h1>
            <h1>가치:가게</h1>
          </div>
        </div>
        {recommendationData?.today_recommend?.stores && recommendationData.today_recommend.stores.length > 0 ? (
          // 오늘의 가게 추천이 있는 경우 - 가게 목록 표시
          <div className="today-recommendation-section">
            <div className="today-store-grid">
              {recommendationData.today_recommend.stores.slice(0, 5).map((store, index) => (
                <a 
                  key={index} 
                  href={store.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="today-store-item-link"
                >
                  <div className="today-store-item">
                    <div className="today-store-bg">
                      <img src={getCategoryBackground(store.category, index)} alt={`${store.category} 배경`} />
                    </div>
                    <div className="today-store-number">
                      <img src={getRecommendNumber(index)} alt={`${index + 1}번`} />
                    </div>
                    <div className="today-store-info">
                      <div className="today-store-name">{store.name}</div>
                      <div className="today-store-address">{store.address}</div>
                    </div>
                    <div className="today-store-arrow">
                      <img src={iconArrow} alt="화살표" />
                    </div>
                  </div>
                </a>
              ))}
            </div>
          </div>
        ) : (
          // 오늘의 가게 추천이 없는 경우 - 추천 받기 버튼
          <div className="hero-cta-card" onClick={handleRecommendationClick}>
            <div className="hero-cta-content">
              <div className="hero-location-text">{userDistrict}</div>
              <div className="hero-cta-text">오늘의 가게 추천 받기</div>
            </div>
            <div className="hero-arrow-button">
              <img src={arrowIcon} alt="추천 받기" width="24" height="24" />
            </div>
          </div>
        )}
      </section>

      {/* 2섹션: 지난 추천 기반 */}
      <section className="history-recommendation-section">
        <div className="history-section-title">
          🔮 지난 추천 기반
        </div>
        {loading ? (
          <p className="history-section-desc">추천 데이터를 불러오는 중...</p>
        ) : error ? (
          <p className="history-section-desc">추천 데이터를 불러올 수 없습니다.</p>
        ) : recommendationData?.past_recommend && recommendationData.past_recommend.length > 0 ? (
          <>
            <p className="history-section-desc">
              최근 {recommendationData.past_recommend[0]?.category}을(를) 좋아하셨어요!
            </p>
            <div className="history-store-grid">
              {recommendationData.past_recommend.slice(0, 3).map((store, index) => (
                <div key={index} className="history-store-item">
                  <div className="history-store-bg">
                    <img src={getCategoryBackground(store.category, index)} alt={`${store.category} 배경`} />
                  </div>
                  <div className="history-store-info">
                    <div className="history-store-name">{store.name}</div>
                    <div className="history-store-address">{store.address}</div>
                  </div>
                  <div className="history-store-arrow">
                    <img src={arrowIcon} alt="화살표" />
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <p className="history-section-desc">아직 추천 기록이 없습니다.</p>
        )}
      </section>

      {/* 3섹션: 광고 가게 추천 */}
      <section className="sponsored-stores-section">
        <div className="sponsored-label">광고</div>
        <div className="sponsored-title">
          💡 이런 가게는 어때요?
        </div>
        <div className="sponsored-store-grid">
          <img src={store01} alt="반층야" className="sponsored-store-item" />
          <img src={store02} alt="오봉집" className="sponsored-store-item" />
          <img src={store03} alt="웨이스테이션" className="sponsored-store-item" />
          <img src={store04} alt="위플랜트위커피" className="sponsored-store-item" />
          <img src={store05} alt="제일콩집" className="sponsored-store-item" />
          <img src={store06} alt="진미김밥" className="sponsored-store-item" />
          <img src={store07} alt="코너집" className="sponsored-store-item" />
          <img src={store08} alt="테르미니" className="sponsored-store-item" />
        </div>
      </section>
    </div>
  )
}

export default RecommendationTab
