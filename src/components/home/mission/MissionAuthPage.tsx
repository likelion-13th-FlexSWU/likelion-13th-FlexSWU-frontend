import React, { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import './MissionAuthPage.css'
import receiptImage from '../../../assets/reciept.png'

const MissionAuthPage: React.FC = () => {
  const navigate = useNavigate()
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleBackClick = () => {
    navigate(-1)
  }

  const handleReceiptClick = () => {
    // 갤러리 열기
    if (fileInputRef.current) {
      fileInputRef.current.click()
    }
  }

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const imageUrl = URL.createObjectURL(file)
      setSelectedImage(imageUrl)
      
      // OCR 결과 페이지로 이동
      navigate(`/home/mission/auth/result?image=${encodeURIComponent(imageUrl)}`)
    }
  }

  const handleAuthClick = () => {
    if (selectedImage) {
      // TODO: 인증 처리 로직 구현
      navigate(-1)
    }
  }

  return (
    <div className="mission-auth-container">
      {/* 숨겨진 input 요소 */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        style={{ display: 'none' }}
      />

      {/* 상단바 */}
      <header className="mission-auth-header">
        <button className="mission-auth-back-button" onClick={handleBackClick}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        <h1 className="mission-auth-title">미션 인증</h1>
        <div className="mission-auth-spacer"></div>
      </header>

      {/* 메인 콘텐츠 */}
      <main className="mission-auth-main">
        {/* 안내 텍스트 */}
        <div className="mission-auth-instruction">
          <p className="mission-auth-instruction-text">미션 인증을 위해</p>
          <p className="mission-auth-instruction-text">영수증 촬영을 진행해 주세요</p>
        </div>

        {/* 영수증 촬영 영역 */}
        <div className="mission-auth-capture-area">
          <div className="mission-auth-capture-frame" onClick={handleReceiptClick}>
            <div className="mission-auth-frame-corner top-left"></div>
            <div className="mission-auth-frame-corner top-right"></div>
            <div className="mission-auth-frame-corner bottom-left"></div>
            <div className="mission-auth-frame-corner bottom-right"></div>
            
            {selectedImage ? (
              <img 
                src={selectedImage} 
                alt="선택된 영수증" 
                className="mission-auth-selected-image"
              />
            ) : (
              <img 
                src={receiptImage} 
                alt="영수증 예시" 
                className="mission-auth-example-image"
              />
            )}
          </div>
        </div>
      </main>

      {/* 하단 인증하기 버튼 */}
      <div className="mission-auth-bottom">
        <button 
          className={`mission-auth-submit-button ${selectedImage ? 'active' : 'disabled'}`}
          onClick={handleAuthClick}
          disabled={!selectedImage}
        >
          인증하기
        </button>
      </div>
    </div>
  )
}

export default MissionAuthPage
