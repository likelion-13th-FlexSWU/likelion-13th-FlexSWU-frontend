import React, { useState } from 'react'
import './Home.css'
import RecommendationTab from './tabs/RecommendationTab'
import MissionTab from './tabs/MissionTab'
import MyInfoPage from './mypage/MyInfoPage'

// 네비게이션 아이콘 import
import recommendationActive from '../../assets/icons/nav-recommendation-active.svg'
import recommendationInactive from '../../assets/icons/nav-recommendation-inactive.svg'
import missionActive from '../../assets/icons/nav-mission-active.svg'
import missionInactive from '../../assets/icons/nav-mission-inactive.svg'
import profileActive from '../../assets/icons/nav-profile-active.svg'
import profileInactive from '../../assets/icons/nav-profile-inactive.svg'

const Home: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'recommendation' | 'mission' | 'myinfo'>('recommendation')

  const renderTabContent = () => {
    switch (activeTab) {
      case 'recommendation':
        return <RecommendationTab />
      case 'mission':
        return <MissionTab />
      case 'myinfo':
        return <MyInfoPage />
      default:
        return <RecommendationTab />
    }
  }

  return (
    <div className="home-container">
      {/* 메인 콘텐츠 영역 */}
      <div className="home-content">
        {renderTabContent()}
      </div>

      {/* 하단 네비게이션바 */}
      <nav className="bottom-navigation">
        <div 
          className={`nav-tab ${activeTab === 'recommendation' ? 'active' : ''}`}
          onClick={() => setActiveTab('recommendation')}
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
          onClick={() => setActiveTab('mission')}
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
          onClick={() => setActiveTab('myinfo')}
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
