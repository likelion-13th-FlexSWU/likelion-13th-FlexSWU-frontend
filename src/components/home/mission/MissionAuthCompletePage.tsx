import React from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import logoImage from '../../../assets/onlyLogo.svg'
import './MissionAuthCompletePage.css'

const MissionAuthCompletePage: React.FC = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { missionId, receiptData } = location.state || {}

  const handleWriteReview = () => {
    navigate('/home/mission/review', { 
      state: { 
        missionId,
        receiptData 
      } 
    })
  }

  const handleSkipReview = () => {
    // 홈으로 이동
    navigate('/home')
  }

  return (
    <div className="mission-auth-complete-container">
      {/* 메인 콘텐츠 */}
      <main className="mission-auth-complete-main">
        {/* 로고 캐릭터 */}
        <div className="mission-auth-complete-logo">
          <img src={logoImage} alt="Logo" className="mission-auth-complete-logo-image" />
        </div>

        {/* 완료 메시지 */}
        <div className="mission-auth-complete-message">
          <h1 className="mission-auth-complete-title">미션 인증 완료</h1>
          <p className="mission-auth-complete-subtitle">
            남은 미션도 완료하고 지역기여도를 쌓아보세요!
          </p>
        </div>

        {/* 리뷰 작성 안내 */}
        <div className="mission-auth-complete-review-modal">
          <div className="mission-auth-complete-review-content">
            {/* 드래그 핸들 */}
            <div className="mission-auth-complete-review-drag-handle"></div>
            
            <h2 className="mission-auth-complete-review-title">
              추천 받은 장소는 어떠셨나요?
            </h2>
            <p className="mission-auth-complete-review-subtitle">
              해당 가게의 리뷰를 써주세요.
            </p>
            
            <div className="mission-auth-complete-review-actions">
              <button 
                className="mission-auth-complete-skip-button"
                onClick={handleSkipReview}
              >
                건너뛰기
              </button>
              <button 
                className="mission-auth-complete-review-button"
                onClick={handleWriteReview}
              >
                리뷰 작성하기
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default MissionAuthCompletePage
