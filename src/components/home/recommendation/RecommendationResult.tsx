import React, { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { authAPI } from '../../../services/api'
import type { TodayRecommendationResponse } from '../../../types/auth'
import './RecommendationResult.css'
import bgbg from '../../../assets/backgrounds/bgbg.svg'
import callIcon from '../../../assets/icons/call.svg'
import houseIcon from '../../../assets/icons/house.svg'
import arrowIcon from '../../../assets/icons/icon-arrow.svg'

const RecommendationResult: React.FC = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const [recommendationData, setRecommendationData] = useState<TodayRecommendationResponse | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  // 전달받은 추천 데이터 또는 로컬 스토리지에서 가져오기
  useEffect(() => {
    const data = location.state?.recommendationData || 
                 JSON.parse(localStorage.getItem('recommendationData') || 'null')
    setRecommendationData(data)
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
      console.error('다시하기 실패:', error)
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
      console.error('추천 저장 실패:', error)
      alert(error.message || '추천을 저장하는데 실패했습니다.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleStoreClick = (storeUrl: string) => {
    // 카카오맵 주소로 이동
    if (storeUrl) {
      window.open(storeUrl, '_blank')
    }
  }

  // 데이터가 없으면 로딩 표시
  if (!recommendationData) {
    return (
      <div className="recommendation-result-container">
        <div className="loading-message">추천 데이터를 불러오는 중...</div>
      </div>
    )
  }

  return (
    <div className="recommendation-result-container">
      {/* 배경 이미지 */}
      <div className="result-background">
        <img src={bgbg} alt="배경" className="result-bg-image" />
      </div>

      {/* 메인 콘텐츠 */}
      <div className="result-content">
        {/* 타이틀 섹션 */}
        <div className="result-title-section">
          <h1 className="result-title">
            취향과 무드에 맞는<br />
            가게를 찾았어요!
          </h1>
          <p className="result-subtitle">총 {recommendationData.stores.length}개</p>
        </div>

        {/* 추천 결과 리스트 */}
        <div className="result-stores-list">
          {recommendationData.stores.map((store, index) => (
            <div key={index} className="result-store-card">
              {/* 티켓 가운데 점선 구분선 */}
              <div className="ticket-divider"></div>
              
              {/* 티켓 위쪽: 가게 이름 */}
              <div className="ticket-upper">
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
                  {store.phone && (
                    <div className="store-detail-item">
                      <img src={callIcon} alt="전화" className="detail-icon" />
                      <span className="detail-text">{store.phone}</span>
                    </div>
                  )}
                  
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
          <button 
            className="retry-button" 
            onClick={handleRetry}
            disabled={isLoading}
          >
            {isLoading ? '처리 중...' : '다시하기'}
          </button>
          <button 
            className="confirm-button" 
            onClick={handleConfirm}
            disabled={isLoading}
          >
            {isLoading ? '저장 중...' : '추천받기'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default RecommendationResult
