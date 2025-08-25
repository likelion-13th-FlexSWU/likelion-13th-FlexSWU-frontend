import React, { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import './Home.css'
import RecommendationTab from './tabs/RecommendationTab'
import MissionTab from './tabs/MissionTab'
import MyInfoTab from './tabs/MyInfoTab'
import CouponPage from './mypage/CouponPage'
import SettingPage from './mypage/SettingPage'
import MyReviewsPage from './mypage/MyReviewsPage'

// 네비게이션 아이콘 import
import recommendationActive from '../../assets/icons/nav-recommendation-active.svg'
import recommendationInactive from '../../assets/icons/nav-recommendation-inactive.svg'
import missionActive from '../../assets/icons/nav-mission-active.svg'
import missionInactive from '../../assets/icons/nav-mission-inactive.svg'
import profileActive from '../../assets/icons/nav-profile-active.svg'
import profileInactive from '../../assets/icons/nav-profile-inactive.svg'

interface HomeProps {
  defaultTab?: 'recommendation' | 'mission' | 'myinfo'
}

const Home: React.FC<HomeProps> = ({ defaultTab = 'recommendation' }) => {
  const [activeTab, setActiveTab] = useState<'recommendation' | 'mission' | 'myinfo'>(defaultTab)
  const location = useLocation()
  const navigate = useNavigate()

  // 탭 클릭 핸들러
  const handleTabClick = (tab: 'recommendation' | 'mission' | 'myinfo') => {
    setActiveTab(tab)
    
    // 현재 특정 페이지에 있다면 해당 탭의 기본 페이지로 이동
    const path = location.pathname
    if (path.includes('/coupon') || path.includes('/setting') || path.includes('/reviews')) {
      if (tab === 'recommendation') {
        navigate('/home')
      } else if (tab === 'mission') {
        navigate('/home')
      } else if (tab === 'myinfo') {
        navigate('/home/mypage')
      }
    }
  }

  // URL에 따라 적절한 페이지 렌더링
  const renderPageContent = () => {
    const path = location.pathname
    
    if (path.includes('/coupon')) {
      return <CouponPage />
    }
    if (path.includes('/setting')) {
      return <SettingPage />
    }
    if (path.includes('/reviews')) {
      return <MyReviewsPage />
    }
    
    // 기본 탭 콘텐츠
    return renderTabContent()
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case 'recommendation':
        return <RecommendationTab />
      case 'mission':
        return <MissionTab />
      case 'myinfo':
        return <MyInfoTab />
      default:
        return <RecommendationTab />
    }
  }

  return (
    <div className="home-container">
      {/* 메인 콘텐츠 영역 */}
      <div className="home-content">
        {renderPageContent()}
      </div>

      {/* 하단 네비게이션바 */}
      <nav className="bottom-navigation">
        <div 
          className={`nav-tab ${activeTab === 'recommendation' ? 'active' : ''}`}
          onClick={() => handleTabClick('recommendation')}
        >
          <div className="nav-icon">
            <img 
              src={activeTab === 'recommendation' ? recommendationActive : recommendationInactive} 
              alt="추천" 
              width="24" 
              height="24"
            />
          </div>
          <span className="nav-label">추천</span>
        </div>

        <div 
          className={`nav-tab ${activeTab === 'mission' ? 'active' : ''}`}
          onClick={() => handleTabClick('mission')}
        >
          <div className="nav-icon">
            <img 
              src={activeTab === 'mission' ? missionActive : missionInactive} 
              alt="미션" 
              width="24" 
              height="24"
            />
          </div>
          <span className="nav-label">미션</span>
        </div>

        <div 
          className={`nav-tab ${activeTab === 'myinfo' ? 'active' : ''}`}
          onClick={() => handleTabClick('myinfo')}
        >
          <div className="nav-icon">
            <img 
              src={activeTab === 'myinfo' ? profileActive : profileInactive} 
              alt="내 정보" 
              width="24" 
              height="24"
            />
          </div>
          <span className="nav-label">내 정보</span>
        </div>
      </nav>
    </div>
  )
}

export default Home
