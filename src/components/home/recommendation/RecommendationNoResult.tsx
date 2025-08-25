import React from 'react'
import { useNavigate } from 'react-router-dom'
import './RecommendationNoResult.css'
import bgbg from '../../../assets/backgrounds/bgbg.svg'

const RecommendationNoResult: React.FC = () => {
  const navigate = useNavigate()

  const handleRetryRecommendation = () => {
    // 추천 첫 화면으로 이동
    navigate('/home/recommendation')
  }

  return (
    <div className="recommendation-no-result-container">
      {/* 배경 이미지 */}
      <div className="no-result-background">
        <img src={bgbg} alt="배경" className="no-result-bg-image" />
      </div>

      {/* 메인 콘텐츠 */}
      <div className="no-result-content">
        {/* 메인 텍스트 블록 */}
        <div className="no-result-text-block">
          <h1 className="no-result-title">
            취향에 맞는 가게를<br />
            찾지 못했어요..
          </h1>
          <p className="no-result-subtitle">
            다시 추천해드릴까요?
          </p>
        </div>

        {/* 액션 버튼 */}
        <div className="no-result-action">
          <button 
            className="retry-recommendation-button"
            onClick={handleRetryRecommendation}
          >
            다시 추천 받기
          </button>
        </div>
      </div>
    </div>
  )
}

export default RecommendationNoResult
