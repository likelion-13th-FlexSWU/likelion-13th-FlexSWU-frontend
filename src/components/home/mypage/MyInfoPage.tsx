import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { authAPI } from '../../../services/api'
import type { UserInfo } from '../../../types/auth'
import witchIcon from '../../../assets/icons/witch.svg'
import couponIcon from '../../../assets/icons/coupon.svg'
import settingIcon from '../../../assets/icons/setting.svg'
import mypageBg from '../../../assets/backgrounds/mypage-bg.svg'
import bgType from '../../../assets/backgrounds/bg-type.png'
import './MyInfoPage.css'


const MyInfoPage: React.FC = () => {
  const navigate = useNavigate()
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null)
  const [hasUnreadCoupon, setHasUnreadCoupon] = useState(true) // 쿠폰 읽음 여부
  const [hoveredBar, setHoveredBar] = useState<number | null>(null)
  const [clickedBar, setClickedBar] = useState<number | null>(null)

  // API에서 사용자 정보 가져오기
  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const data = await authAPI.getUserInfo()
        setUserInfo(data)
      } catch (err: any) {
        // 에러 발생 시 기본값 설정
        setUserInfo({
          sido: "서울",
          gugun: "노원구",
          username: "사용자",
          type: null,
          monthly: []
        })
      }
    }

    fetchUserInfo()
  }, [])

  // 쿠폰 읽음 상태 확인
  useEffect(() => {
    const couponRead = localStorage.getItem('couponRead')
    if (couponRead === 'true') {
      setHasUnreadCoupon(false)
    }
  }, [])

  const handleCouponClick = () => {
    // 쿠폰 페이지로 이동
    navigate('/home/mypage/coupon')
    // 쿠폰을 봤으므로 빨간 점 제거
    setHasUnreadCoupon(false)
    localStorage.setItem('couponRead', 'true')
  }

  const handleSettingClick = () => {
    // 설정 페이지로 이동
    navigate('/home/mypage/setting')
  }

  const handleReviewClick = () => {
    // 내가 적은 리뷰 페이지로 이동
    navigate('/home/mypage/reviews')
  }

  const formatMonth = (monthStr: string) => {
    const month = monthStr.split('-')[1]
    return `${parseInt(month)}`
  }

  // 지역기여도 차트 데이터 (하이브리드 방식)
  const BASE_MAX = 60000 // 기본 최대값: 6만점
  const chartData = userInfo?.monthly && userInfo.monthly.length > 0 
    ? (() => {
        const dynamicMax = Math.max(...userInfo.monthly.map(item => item.score))
        const maxScore = Math.max(BASE_MAX, dynamicMax) // 6만점 vs 실제 최대값
        
        // 월별 데이터 시간순으로 정렬(오름차순)
        const sortedMonthly = [...userInfo.monthly].sort((a, b) => {
          const aDate = new Date(a.month)
          const bDate = new Date(b.month)
          return aDate.getTime() - bDate.getTime()
        })
        
        return sortedMonthly.map(item => ({
          month: formatMonth(item.month),
          score: item.score,
          height: `${(item.score / maxScore) * 100}%`
        }))
      })()
    : [
        { month: '3', score: 25000, height: '41.7%' },  // 25000/60000 = 41.7%
        { month: '4', score: 35000, height: '58.3%' },  // 35000/60000 = 58.3%
        { month: '5', score: 50000, height: '83.3%' },  // 50000/60000 = 83.3%
        { month: '6', score: 30000, height: '50.0%' },  // 30000/60000 = 50.0%
        { month: '7', score: 42500, height: '70.8%' },  // 42500/60000 = 70.8%
        { month: '8', score: 50000, height: '83.3%' }   // 50000/60000 = 83.3%
      ]

  // 막대 클릭 핸들러
  const handleBarClick = (index: number) => {
    setClickedBar(clickedBar === index ? null : index) // 같은 막대 클릭 시 해제
  }


  return (
    <div className="myinfo-container">
      {/* 1. 프로필 섹션 */}
      <section className="myinfo-profile-section">
        <div 
          className="myinfo-profile-background"
          style={{ backgroundImage: `url(${mypageBg})` }}
        >
          {/* 상단 우측 버튼들 */}
          <div className="myinfo-top-buttons">
            <button 
              className="myinfo-coupon-button"
              onClick={handleCouponClick}
            >
              <img src={couponIcon} alt="쿠폰" />
              {hasUnreadCoupon && <span className="myinfo-coupon-dot"></span>}
            </button>
            <button 
              className="myinfo-setting-button"
              onClick={handleSettingClick}
            >
              <img src={settingIcon} alt="설정" />
            </button>
          </div>

          {/* 프로필 정보 */}
          <div className="myinfo-profile-info">
            <div className="myinfo-location">
              <img src={witchIcon} alt="지역" />
              <span>{userInfo?.gugun || '노원구'}</span>
            </div>
            <h1 className="myinfo-username">
              {userInfo?.username || '사용자'}
            </h1>
          </div>

          {/* 내가 적은 리뷰 버튼 */}
          <button 
            className="myinfo-review-button"
            onClick={handleReviewClick}
          >
            <span>내가 적은 리뷰</span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
      </section>

      {/* 2. 취향 유형 섹션 */}
      <section className="myinfo-taste-section">
        <div 
          className="myinfo-taste-card"
          style={{ 
            backgroundImage: `url(${bgType})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            backgroundColor: 'transparent'
          }}
        >
          <h2 className="myinfo-taste-title">
            🐧 나는 어떤 취향 유형일까?
          </h2>
          {userInfo?.type ? (
            <p className="myinfo-taste-description">
              {userInfo.type}까치
            </p>
          ) : (
            <p className="myinfo-taste-description">
              AI추천 10번 받으면 확인 가능해요!
            </p>
          )}
        </div>
      </section>

      {/* 3. 지역기여도 차트 섹션 */}
      <section className="myinfo-chart-section">
        <div className="myinfo-chart-container">
          <h2 className="myinfo-chart-title">6개월 간의 지역기여도</h2>
          <div className="myinfo-chart-bars">
            {chartData.map((data, index) => (
              <div 
                key={data.month}
                className={`myinfo-chart-bar ${hoveredBar === index ? 'hovered' : ''} ${clickedBar === index ? 'clicked' : ''}`}
                style={{ height: data.height }}
                onMouseEnter={() => setHoveredBar(index)}
                onMouseLeave={() => setHoveredBar(null)}
                onClick={() => handleBarClick(index)}
              >
                {hoveredBar === index && (
                  <div className="myinfo-chart-tooltip">
                    {data.score.toLocaleString()}점
                  </div>
                )}
                <span className="myinfo-chart-month">{data.month}월</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}

export default MyInfoPage
