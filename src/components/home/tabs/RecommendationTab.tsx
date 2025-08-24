import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { authAPI } from '../../../services/api'
import type { RecommendationResponse, StoreInfo } from '../../../types/auth'
import './RecommendationTab.css'
import arrowIcon from '../../../assets/icons/icon-arrow-right.svg'
import cafeBg1 from '../../../assets/backgrounds/cafe-bg-1.png'
import koreanBg1 from '../../../assets/backgrounds/korean-bg-1.png'
import koreanBg2 from '../../../assets/backgrounds/korean-bg-2.png'
import store01 from '../../../assets/stores/store-01.png'
import store02 from '../../../assets/stores/store-02.png'
import store03 from '../../../assets/stores/store-03.png'
import store04 from '../../../assets/stores/store-04.png'
import store05 from '../../../assets/stores/store-05.png'
import store06 from '../../../assets/stores/store-06.png'
import store07 from '../../../assets/stores/store-07.png'
import store08 from '../../../assets/stores/store-08.png'

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
        console.error('추천 데이터 가져오기 실패:', err)
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

  // 디버깅용 콘솔 로그
  console.log('Debug - recommendationData:', recommendationData)
  console.log('Debug - userNickname:', userNickname)
  console.log('Debug - userDistrict:', userDistrict)

  const handleRecommendationClick = () => {
    navigate('/home/recommendation')
  }

  // 카테고리별 배경 이미지 반환
  const getCategoryBackground = (category: string) => {
    switch (category) {
      case '한식':
        return koreanBg1
      case '카페':
      case '커피':
        return cafeBg1
      case '양식':
        return koreanBg2
      default:
        return koreanBg1
    }
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
        <div className="hero-cta-card" onClick={handleRecommendationClick}>
          <div className="hero-cta-content">
            <div className="hero-location-text">{userDistrict}</div>
            <div className="hero-cta-text">
              {recommendationData?.today_recommend?.stores && recommendationData.today_recommend.stores.length > 0 
                ? '오늘의 가게 추천' 
                : '오늘의 가게 추천 받기'
              }
            </div>
          </div>
          <div className="hero-arrow-button">
            <img src={arrowIcon} alt="추천 받기" width="24" height="24" />
          </div>
        </div>
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
                    <img src={getCategoryBackground(store.category)} alt={`${store.category} 배경`} />
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
