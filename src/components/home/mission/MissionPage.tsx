import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import './MissionPage.css'
import regionContribution from '../../../assets/region-contribution.png'
import myContribution from '../../../assets/my-contribution.png'
import type { APIMission, MissionResponse } from '../../../types/mission'
import { missionAPI } from '../../../services/api'

const MissionPage: React.FC = () => {
  const navigate = useNavigate()
  const [currentRankingIndex, setCurrentRankingIndex] = useState(0)
  const [touchStart, setTouchStart] = useState<number | null>(null)
  const [touchEnd, setTouchEnd] = useState<number | null>(null)
  const [missionData, setMissionData] = useState<MissionResponse | null>(null)
  const [loading, setLoading] = useState(true)

  // 컴포넌트 마운트 시 미션 데이터 가져오기
  useEffect(() => {
    const fetchMissionData = async () => {
      try {
        setLoading(true)
        const data = await missionAPI.getMissions()
        setMissionData(data)
      } catch (error) {
        console.error('미션 데이터를 가져오는데 실패했습니다:', error)
        // 에러 발생 시 기본값 설정
        setMissionData({
          gugun: "노원구",
          region: {
            rank: 1,
            score: 500000
          },
          me: {
            rank: 13,
            score: 50000
          },
          missions: []
        })
      } finally {
        setLoading(false)
      }
    }

    fetchMissionData()
  }, [])

  const handleMissionCertify = (missionId: string) => {
    // 미션 인증 페이지로 이동 (미션 ID와 함께)
    navigate('/home/mission/auth', { state: { missionId: parseInt(missionId) } })
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

  // API 미션 데이터를 컴포넌트에서 사용하는 형식으로 변환
  const apiMissions = missionData?.missions.map((mission: APIMission) => {
    const convertedMission = {
      id: mission.id.toString(),
      title: mission.title,
      description: mission.body,
      points: mission.score,
      type: mission._special ? 'special' : 'normal',
      isCompleted: mission.is_verified
    }
    console.log('API Mission:', mission)
    console.log('Converted Mission:', convertedMission)
    return convertedMission
  }) || []

  // API에서 미션 데이터를 가져온 경우 API 데이터 사용
  const displayMissions = apiMissions
  
  console.log('Display Missions:', displayMissions)

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
                      <span className="mission-page-ranking-question">🏆 {missionData?.gugun || '노원구'}의 지역기여도는 몇등?</span>
                    </div>
                    <div className="mission-page-ranking-score">{missionData?.region.rank || 1}위 {missionData?.region.score?.toLocaleString() || '500,000'} 점</div>
                  </>
                ) : (
                  <>
                    <div className="mission-page-ranking-header">
                      <span className="mission-page-ranking-question">🏆 나의 지역기여도는?</span>
                    </div>
                    <div className="mission-page-ranking-score">{missionData?.me.score?.toLocaleString() || '2,450'} 점</div>
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
          {loading ? (
            <div className="mission-loading">미션을 불러오는 중...</div>
          ) : (
            displayMissions.map((mission) => (
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
            ))
          )}
        </div>
      </section>
    </div>
  )
}

export default MissionPage

