import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './SignupOnboarding.css'
// 회원가입 온보딩 단계별 이미지 import
import step1Image from '../../assets/images/signup/step-1.png'
import step2Image from '../../assets/images/signup/step-2.png'
import step3Image from '../../assets/images/signup/step-3.png'

/**
 * 회원가입 온보딩 컴포넌트 (3단계 슬라이더)
 */
const SignupOnboarding = () => {
  // 현재 활성화된 슬라이드 인덱스 (0: 첫 번째, 1: 두 번째, 2: 세 번째)
  const [currentSlide, setCurrentSlide] = useState(0)
  const navigate = useNavigate()

  // 온보딩 슬라이드 데이터 정의
  const slides = [
    { 
      id: 1, 
      image: step1Image,
      title: "우리 동네 곳곳 궁금하죠?",
      subtitle: "가치:가게가 알려드릴게요"
    },
    { 
      id: 2, 
      image: step2Image,
      title: "미션을 통해 지역 기여도를",
      subtitle: "높여 보세요!"
    },
    { 
      id: 3, 
      image: step3Image,
      title: "포인트와 제휴쿠폰도",
      subtitle: "얻을 수 있어요!"
    }
  ]

  // 다음 슬라이드로 이동하는 함수 (마지막 슬라이드에서는 이동하지 않음)
  const handleNextSlide = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1)
    }
  }

  // 회원가입 폼으로 이동하는 함수
  const handleStartSignup = () => {
    navigate('/signup')
  }

  // 이전 슬라이드로 이동하는 함수 (첫 번째 슬라이드에서는 이동하지 않음)
  const handlePrevSlide = () => {
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1)
    }
  }

  // 터치 제스처를 감지하여 슬라이드 전환을 처리하는 함수
  // 좌우 스와이프로 이전/다음 슬라이드 이동
  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0]
    const startX = touch.clientX
    const startY = touch.clientY

    // 터치 종료 시 스와이프 방향을 감지하여 슬라이드 전환
    const handleTouchEnd = (e: TouchEvent) => {
      const touch = e.changedTouches[0]
      const endX = touch.clientX
      const endY = touch.clientY

      const diffX = startX - endX
      const diffY = startY - endY

      // 수평 스와이프가 수직 스와이프보다 클 때만 처리 (50px 이상)
      if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 50) {
        if (diffX > 0) {
          // 왼쪽으로 스와이프 -> 다음 슬라이드
          handleNextSlide()
        } else {
          // 오른쪽으로 스와이프 -> 이전 슬라이드
          handlePrevSlide()
        }
      }

      // 이벤트 리스너 정리
      document.removeEventListener('touchend', handleTouchEnd)
    }

    document.addEventListener('touchend', handleTouchEnd)
  }

  // 슬라이드 전환을 위한 CSS transform 값 계산
  // 3개 슬라이드가 각각 33.333% 너비를 가지므로 currentSlide * 33.333%만큼 이동
  const slideTransform = `translateX(-${currentSlide * 33.333}%)`

  // 현재 슬라이드에 따라 단계별 인디케이터를 렌더링하는 함수
  const renderStepIndicator = () => {
    switch (currentSlide) {
      case 0: // 첫 번째 단계
        return (
          <div className="step-indicator">
            <div className="step-item">
              <div className="step-bar active"></div>      {/* 첫 번째 단계 - 활성화 */}
              <div className="step-circle"></div>          {/* 두 번째 단계 - 비활성화 */}
              <div className="step-circle"></div>          {/* 세 번째 단계 - 비활성화 */}
            </div>
          </div>
        )
      case 1: // 두 번째 단계
        return (
          <div className="step-indicator">
            <div className="step-item">
              <div className="step-circle"></div>          {/* 첫 번째 단계 - 비활성화 */}
              <div className="step-bar active"></div>      {/* 두 번째 단계 - 활성화 */}
              <div className="step-circle"></div>          {/* 세 번째 단계 - 비활성화 */}
            </div>
          </div>
        )
      case 2: // 세 번째 단계
        return (
          <div className="step-indicator">
            <div className="step-item">
              <div className="step-circle"></div>          {/* 첫 번째 단계 - 비활성화 */}
              <div className="step-circle"></div>          {/* 두 번째 단계 - 비활성화 */}
              <div className="step-bar active"></div>      {/* 세 번째 단계 - 활성화 */}
            </div>
          </div>
        )
      default:
        return null
    }
  }

  return (
    <div className="mobile-container">
      {/* 메인 콘텐츠 영역 */}
      <div className="main-content">
        <div className="content-wrapper">
          {/* 헤더 영역 - 로그인 버튼과 메인 타이틀 */}
          <div className="header">
            {/* 우측 상단 로그인 버튼 */}
            <div className="login-button">로그인</div>
            {/* 메인 타이틀 - 현재 슬라이드에 따라 동적으로 변경 */}
            <div className="main-title">
              <h1>{slides[currentSlide].title}</h1>
              <h2>{slides[currentSlide].subtitle}</h2>
            </div>
          </div>

          {/* 이미지 슬라이드 영역 - 터치 제스처 지원 */}
          <div className="slide-container" onTouchStart={handleTouchStart}>
            <div className="slide-wrapper" style={{ transform: slideTransform }}>
              {slides.map((slide) => (
                <div key={slide.id} className="slide">
                  <img
                    src={slide.image}
                    alt={`Signup Step ${slide.id}`}
                    className="slide-image"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* 단계별 인디케이터 - 현재 진행 상황 표시 */}
          <div className="step-indicators">
            {renderStepIndicator()}
          </div>

          {/* 하단 버튼 영역 - 다음 단계 이동 또는 시작하기 */}
          <div className="bottom-bar">
            <div className="bottom-content">
              <button 
                className="next-button" 
                onClick={currentSlide === slides.length - 1 ? handleStartSignup : handleNextSlide}
                data-slide={currentSlide} // CSS에서 버튼 스타일 구분을 위한 속성
              >
                {/* 마지막 슬라이드에서는 '시작하기', 그 외에는 '다음으로' */}
                {currentSlide === slides.length - 1 ? '시작하기' : '다음으로'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SignupOnboarding