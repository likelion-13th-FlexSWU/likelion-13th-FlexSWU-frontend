import React from 'react'
import { useNavigate } from 'react-router-dom'
import './RecommendationTab.css'
import arrowIcon from '../../../assets/icons/icon-arrow-right.svg'

const RecommendationTab: React.FC = () => {
  const navigate = useNavigate()
  // 임시 사용자 데이터 (TODO: 나중에 실제 데이터로 교체)
  const userNickname = "빌려온고양이"
  const userDistrict = "노원구"

  const handleRecommendationClick = () => {
    navigate('/home/recommendation')
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
            <div className="hero-cta-text">오늘의 가게 추천 받기</div>
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
        <p className="history-section-desc">
          최근 김밥을 좋아하셨어요!
        </p>
        <div className="history-store-grid">
          <div className="history-store-item">
            <div className="history-store-bg">
              <img src="/src/assets/backgrounds/cafe-bg-1.png" alt="카페 배경" />
            </div>
            <div className="history-store-info">
              <div className="history-store-name">웨이스테이션</div>
              <div className="history-store-address">서울 노원구 동일로 174길, 37-8</div>
            </div>
            <div className="history-store-arrow">
              <img src="/src/assets/icons/icon-arrow.png" alt="화살표" />
            </div>
          </div>
          
          <div className="history-store-item">
            <div className="history-store-bg">
              <img src="/src/assets/backgrounds/korean-bg-1.png" alt="한식 배경" />
            </div>
            <div className="history-store-info">
              <div className="history-store-name">오봉집</div>
              <div className="history-store-address">서울 노원구 동일로 172길, 15-3</div>
            </div>
            <div className="history-store-arrow">
              <img src="/src/assets/icons/icon-arrow.png" alt="화살표" />
            </div>
          </div>
          
          <div className="history-store-item">
            <div className="history-store-bg">
              <img src="/src/assets/backgrounds/korean-bg-2.png" alt="한식 배경" />
            </div>
            <div className="history-store-info">
              <div className="history-store-name">진미김밥</div>
              <div className="history-store-address">서울 노원구 동일로 170길, 22-1</div>
            </div>
            <div className="history-store-arrow">
              <img src="/src/assets/icons/icon-arrow.png" alt="화살표" />
            </div>
          </div>
        </div>
      </section>

      {/* 3섹션: 광고 가게 추천 */}
      <section className="sponsored-stores-section">
        <div className="sponsored-label">광고</div>
        <div className="sponsored-title">
          💡 이런 가게는 어때요?
        </div>
        <div className="sponsored-store-grid">
          <img src="/src/assets/stores/store-01.png" alt="반층야" className="sponsored-store-item" />
          <img src="/src/assets/stores/store-02.png" alt="오봉집" className="sponsored-store-item" />
          <img src="/src/assets/stores/store-03.png" alt="웨이스테이션" className="sponsored-store-item" />
          <img src="/src/assets/stores/store-04.png" alt="위플랜트위커피" className="sponsored-store-item" />
          <img src="/src/assets/stores/store-05.png" alt="제일콩집" className="sponsored-store-item" />
          <img src="/src/assets/stores/store-06.png" alt="진미김밥" className="sponsored-store-item" />
          <img src="/src/assets/stores/store-07.png" alt="코너집" className="sponsored-store-item" />
          <img src="/src/assets/stores/store-08.png" alt="테르미니" className="sponsored-store-item" />
        </div>
      </section>
    </div>
  )
}

export default RecommendationTab
