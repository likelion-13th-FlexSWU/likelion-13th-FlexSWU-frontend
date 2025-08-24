import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import './RecommendationLoading.css'
import loadingStep1Icon from '../../../assets/icons/loading-step-1.svg'
import loadingStep2Icon from '../../../assets/icons/loading-step-2.svg'
import loadingStep3Icon from '../../../assets/icons/loading-step-3.svg'

const RecommendationLoading: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0)
  const navigate = useNavigate()

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStep((prev) => (prev + 1) % 3)
    }, 400) // 0.4초마다 변경

    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    // 3초 후 추천 결과 페이지로 이동
    const timer = setTimeout(() => {
      navigate('/home/recommendation/result')
    }, 3000)

    return () => clearTimeout(timer)
  }, [navigate])

  const getIconClass = (step: number) => {
    // 현재 활성화된 단계는 진한색, 나머지는 연한색
    if (step === currentStep) {
      return 'loading-icon active'
    }
    return 'loading-icon inactive'
  }

  return (
    <div className="recommendation-loading-container">
      {/* 로딩 아이콘들 */}
      <div className="loading-icons">
        <img 
          src={loadingStep1Icon} 
          alt="로딩 1" 
          className={getIconClass(0)}
        />
        <img 
          src={loadingStep2Icon} 
          alt="로딩 2" 
          className={getIconClass(1)}
        />
        <img 
          src={loadingStep3Icon} 
          alt="로딩 3" 
          className={getIconClass(2)}
        />
      </div>

      {/* 로딩 텍스트 */}
      <div className="loading-text">
        <h2 className="loading-title">가게를 찾는 중..</h2>
        <p className="loading-subtitle">당신의 취향에 맞는 가게를 찾고 있어요</p>
      </div>
    </div>
  )
}

export default RecommendationLoading
