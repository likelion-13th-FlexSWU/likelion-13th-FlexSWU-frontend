import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import './MissionPage.css'
import regionContribution from '../../../assets/region-contribution.png'
import myContribution from '../../../assets/my-contribution.png'
import type { Mission } from '../../../types/mission'
import { 
  getRandomSpecialMission,
  getCurrentMissions
} from '../../../types/mission'

const MissionPage: React.FC = () => {
  const navigate = useNavigate()
  const [currentRankingIndex, setCurrentRankingIndex] = useState(0)
  const [selectedSpecialMission, setSelectedSpecialMission] = useState<Mission | null>(null)
  const [currentWeek, setCurrentWeek] = useState(0)
  const [touchStart, setTouchStart] = useState<number | null>(null)
  const [touchEnd, setTouchEnd] = useState<number | null>(null)

  // 컴포넌트 마운트 시 랜덤 스페셜 미션 선택 및 주차 계산
  useEffect(() => {
    // 랜덤 스페셜 미션 선택
    setSelectedSpecialMission(getRandomSpecialMission())
    
    // 현재 주차 계산
    const startDate = new Date('2025-08-25')
    const currentDate = new Date()
    const weeksDiff = Math.floor((currentDate.getTime() - startDate.getTime()) / (7 * 24 * 60 * 60 * 1000))
    setCurrentWeek(weeksDiff)
    
    // SVG 경로 디버깅
    console.log('regionContribution path:', regionContribution)
    console.log('myContribution path:', myContribution)
  }, [])

  const handleMissionCertify = (missionId: string) => {
    console.log('미션 인증:', missionId)
    // 미션 인증 페이지로 이동
    navigate('/home/mission/auth')
  }

  // 터치 이벤트 핸들러
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX)
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX)
  }

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return
    
    const distance = touchStart - touchEnd
    const isLeftSwipe = distance > 50
    const isRightSwipe = distance < -50

    if (isLeftSwipe && currentRankingIndex === 0) {
      setCurrentRankingIndex(1)
    } else if (isRightSwipe && currentRankingIndex === 1) {
      setCurrentRankingIndex(0)
    }

    setTouchStart(null)
    setTouchEnd(null)
  }

  const currentMissions = getCurrentMissions(selectedSpecialMission, currentWeek)

  return (
    <div className="mission-page-container">
      {/* 1섹션: 타이틀 + 기여도 (배경 포함) */}
      <section className="mission-hero-section">
        <div className="mission-hero-content">
          {/* 타이틀 섹션 */}
          <div className="mission-title-section">
            <h1 className="mission-title">주간 미션</h1>
            <p className="mission-subtitle">
              미션인증을 하면 지역 기여도를 높일 수 있어요!
            </p>
            <p className="mission-description">
              우리 지역의 기여도를 높여보아요
            </p>
          </div>

          {/* 랭킹 섹션 */}
          <div className="mission-ranking-section">
            <div className="mission-page-ranking-container">
              <div className={`mission-page-ranking-card ${currentRankingIndex === 0 ? 'region-bg' : 'my-bg'}`}
                   style={{
                     backgroundImage: currentRankingIndex === 0 
                       ? `url(${regionContribution})` 
                       : `url(${myContribution})`
                   }}
                   onTouchStart={handleTouchStart}
                   onTouchMove={handleTouchMove}
                   onTouchEnd={handleTouchEnd}
              >
                {currentRankingIndex === 0 ? (
                  <>
                    <div className="mission-page-ranking-header">
                      <span className="mission-page-ranking-question">🏆 노원구의 지역기여도는 몇등?</span>
                    </div>
                    <div className="mission-page-ranking-score">1위 500,000 점</div>
                  </>
                ) : (
                  <>
                    <div className="mission-page-ranking-header">
                      <span className="mission-page-ranking-question">🏆 나의 지역기여도는?</span>
                    </div>
                    <div className="mission-page-ranking-score">2,450 점</div>
                  </>
                )}
              </div>
              <div className="mission-page-ranking-dots">
                <span className={`mission-page-dot ${currentRankingIndex === 0 ? 'active' : ''}`}></span>
                <span className={`mission-page-dot ${currentRankingIndex === 1 ? 'active' : ''}`}></span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2섹션: 미션 리스트 (배경 없음) */}
      <section className="mission-list-section">
        <div className="mission-page-list">
          {currentMissions.map((mission) => (
            <div key={mission.id} className={`mission-page-card ${mission.type}`}>
              <div className="mission-page-points">{mission.points}점</div>
              <div className="mission-page-content-wrapper">
                <div className="mission-page-text-wrapper">
                  <h3 className="mission-page-title-text">
                    {mission.type === 'special' ? '[Special] ' : ''}{mission.title}
                  </h3>
                  <p className="mission-page-description-text">{mission.description}</p>
                </div>
                <button 
                  className={`mission-page-certify-button ${mission.type}`}
                  onClick={() => handleMissionCertify(mission.id)}
                  disabled={mission.isCompleted}
                >
                  {mission.isCompleted ? '완료' : '인증하기'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}

export default MissionPage

