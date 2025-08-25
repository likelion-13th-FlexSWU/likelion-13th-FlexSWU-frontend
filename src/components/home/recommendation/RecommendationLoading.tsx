import React, { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { authAPI } from '../../../services/api'
import type { RecommendationRequest } from '../../../types/auth'
import './RecommendationLoading.css'
import loadingStep1Icon from '../../../assets/icons/loading-step-1.svg'
import loadingStep2Icon from '../../../assets/icons/loading-step-2.svg'
import loadingStep3Icon from '../../../assets/icons/loading-step-3.svg'

const RecommendationLoading: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const navigate = useNavigate()
  const location = useLocation()

  // 전달받은 추천 요청 데이터
  const recommendationRequest = location.state?.recommendationRequest
  const isInitialLoad = location.state?.isInitialLoad

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStep((prev) => (prev + 1) % 3)
    }, 400) // 0.4초마다 변경

    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    // 초기 로딩인 경우에만 API 호출
    if (isInitialLoad && recommendationRequest) {
      handleRecommendationRequest()
    } else {
      // 이미 데이터가 있는 경우 3초 후 결과 페이지로 이동
      const timer = setTimeout(() => {
        navigate('/home/recommendation/result')
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [isInitialLoad, recommendationRequest, navigate])

  const handleRecommendationRequest = async () => {
          try {
        // 오늘의 추천 받기 (조회용) API 호출
        const response = await authAPI.getTodayRecommendation(recommendationRequest)
      
      // 로컬 스토리지에 저장 (다시하기/추천받기용)
      localStorage.setItem('recommendationData', JSON.stringify(response))
      localStorage.setItem('recommendationRequest', JSON.stringify(recommendationRequest))
      
      // 성공 시 결과 페이지로 이동
      navigate('/home/recommendation/result', {
        state: { recommendationData: response }
      })
      
    } catch (error: any) {
      // 추천 결과가 없는 경우
      if (error.message === 'NO_RESULTS') {
        navigate('/home/recommendation/no-result')
        return
      }
      
      setError(error.message)
      setIsLoading(false)
      
      // 에러 발생 시 3초 후 결과 페이지로 이동 (에러 상태로)
      setTimeout(() => {
        navigate('/home/recommendation/result', {
          state: { error: error.message }
        })
      }, 3000)
    }
  }

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
        {error ? (
          <>
            <h2 className="loading-title">추천을 받는데 실패했습니다</h2>
            <p className="loading-subtitle">{error}</p>
          </>
        ) : (
          <>
            <h2 className="loading-title">가게를 찾는 중..</h2>
            <p className="loading-subtitle">당신의 취향에 맞는 가게를 찾고 있어요</p>
          </>
        )}
      </div>
    </div>
  )
}

export default RecommendationLoading
