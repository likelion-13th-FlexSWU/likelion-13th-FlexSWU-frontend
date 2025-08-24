import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { authAPI } from '../../../services/api'
import './SettingPage.css'

const SettingPage: React.FC = () => {
  const navigate = useNavigate()
  const [showRegionAlert, setShowRegionAlert] = useState(false)

  const handleBackClick = () => {
    navigate('/home/mypage')
  }

  const handleProfileChange = () => {
    // 프로필 변경 페이지로 이동
    navigate('/home/mypage/profile-change')
  }

  const handleRegionChange = () => {
    // 지역 변경 알러트 표시
    setShowRegionAlert(true)
  }

  const handleRegionAlertConfirm = () => {
    // 알러트 닫고 지역 설정 페이지로 이동
    setShowRegionAlert(false)
    navigate('/home/mypage/region-change')
  }

  const handleRegionAlertCancel = () => {
    // 알러트만 닫기
    setShowRegionAlert(false)
  }

  // 준비 중인 기능
  const handleNotice = () => {
    // 공지사항 페이지로 이동
    navigate('/notice')
  }
  const handleTerms = () => {
    // 이용약관 페이지로 이동
    navigate('/terms')
  }
  const handlePrivacy = () => {
    // 개인정보 처리방침 페이지로 이동
    navigate('/privacy')
  }

  return (
    <div className="setting-page">
      {/* 상단 헤더 */}
      <header className="setting-header">
        <button className="setting-back-button" onClick={handleBackClick}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M15 18L9 12L15 6" stroke="#4B4B4B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        <h1 className="setting-title">환경설정</h1>
        <div className="setting-header-spacer"></div>
      </header>

      {/* 설정 콘텐츠 */}
      <div className="setting-content">
        {/* 프로필 섹션 */}
        <section className="setting-section">
          <h2 className="setting-section-title">프로필</h2>
          <div className="setting-options">
            <button className="setting-option" onClick={handleProfileChange}>
              <span>닉네임 변경</span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M9 18L15 12L9 6" stroke="#6c757d" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            <button className="setting-option" onClick={handleRegionChange}>
              <span>지역 변경</span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M9 18L15 12L9 6" stroke="#6c757d" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>
        </section>

        {/* 기타 섹션 */}
        <section className="setting-section">
          <h2 className="setting-section-title">기타</h2>
          <div className="setting-options">
            <button className="setting-option" onClick={handleNotice}>
              <span>공지사항</span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M9 18L15 12L9 6" stroke="#6c757d" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            <button className="setting-option" onClick={handleTerms}>
              <span>이용약관</span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M9 18L15 12L9 6" stroke="#6c757d" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            <button className="setting-option" onClick={handlePrivacy}>
              <span>개인정보 처리방침</span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M9 18L15 12L9 6" stroke="#6c757d" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>
        </section>

        {/* 푸터 */}
        <footer className="setting-footer">
          <p className="setting-copyright">© 2025. 플렉슈</p>
        </footer>
      </div>

      {/* 지역 변경 알러트 */}
      {showRegionAlert && (
        <div className="setting-alert-overlay">
          <div className="setting-alert">
            <h3 className="setting-alert-title">지역 변경을 하시겠습니까?</h3>
            <p className="setting-alert-message">
              지역 변경 후에는 2개월 간 지역변경을 할 수 없습니다. 그래도 하시겠습니까?
            </p>
            <div className="setting-alert-buttons">
              <button 
                className="setting-alert-button setting-alert-button-cancel"
                onClick={handleRegionAlertCancel}
              >
                아니오
              </button>
              <button 
                className="setting-alert-button setting-alert-button-confirm"
                onClick={handleRegionAlertConfirm}
              >
                네
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default SettingPage
