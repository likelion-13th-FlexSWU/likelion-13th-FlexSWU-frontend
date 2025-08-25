import React from 'react'
import { useNavigate } from 'react-router-dom'
import './ComingSoonPage.css'

interface ComingSoonPageProps {
  title: string
  description?: string
  backPath?: string
}

const ComingSoonPage: React.FC<ComingSoonPageProps> = ({ 
  title, 
  description = "곧 만나보실 수 있습니다!",
  backPath = '/setting'
}) => {
  const navigate = useNavigate()

  const handleBackClick = () => {
    navigate(backPath)
  }

  return (
    <div className="coming-soon-page">
      {/* 상단 헤더 */}
      <header className="coming-soon-header">
        <button className="coming-soon-back-button" onClick={handleBackClick}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M15 18L9 12L15 6" stroke="#4B4B4B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        <h1 className="coming-soon-title">{title}</h1>
        <div className="coming-soon-header-spacer"></div>
      </header>

      {/* 메인 콘텐츠 */}
      <div className="coming-soon-content">
        <div className="coming-soon-illustration">
          <div className="coming-soon-icon">🚧</div>
        </div>
        
        <h2 className="coming-soon-heading">준비 중입니다</h2>
        
        <p className="coming-soon-description">
          {description}
        </p>
        
        <div className="coming-soon-features">
          <div className="coming-soon-feature">
            <span className="coming-soon-feature-icon">💦</span>
            <span>더 나은 서비스를 위해 준비하고 있어요</span>
          </div>
          <div className="coming-soon-feature">
            <span className="coming-soon-feature-icon">🦁</span>
            <span>조금만 기다려 주세요, 곧 찾아뵐게요!</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ComingSoonPage
