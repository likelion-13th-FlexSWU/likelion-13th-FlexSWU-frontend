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
  const [hasUnreadCoupon, setHasUnreadCoupon] = useState(true)
  const [hoveredBar, setHoveredBar] = useState<number | null>(null)
  const [clickedBar, setClickedBar] = useState<number | null>(null)

  // API에서 사용자 정보 가져오기
  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const data = await authAPI.getUserInfo()
        console.log('API에서 받아온 사용자 정보:', data)
        setUserInfo(data)
      } catch (err: any) {
        console.error('사용자 정보 가져오기 실패:', err)
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
    navigate('/home/mypage/coupon')
    setHasUnreadCoupon(false)
    localStorage.setItem('couponRead', 'true')
  }

  const handleSettingClick = () => {
    navigate('/home/mypage/setting')
  }

  const handleReviewClick = () => {
    navigate('/home/mypage/reviews')
  }

  const formatMonth = (monthStr: string) => {
    const month = monthStr.split('-')[1]
    return `${parseInt(month)}`
  }

  // 지역기여도 차트 데이터 (6개월 전체 표시)
  const chartData = (() => {
    // 최근 6개월 데이터 생성 (현재 월 기준으로 역순)
    const currentDate = new Date()
    const months = []
    
    for (let i = 5; i >= 0; i--) {
      const targetDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1)
      const monthStr = `${targetDate.getFullYear()}-${String(targetDate.getMonth() + 1).padStart(2, '0')}`
      months.push(monthStr)
    }
    
    if (userInfo?.monthly && userInfo.monthly.length > 0) {
      console.log('API 데이터로 차트 생성')
      
      // API 데이터를 월별로 매핑
      const monthlyMap = new Map()
      userInfo.monthly.forEach(item => {
        monthlyMap.set(item.month, item.score)
      })
      
      // 6개월 전체 데이터 생성 (API 데이터가 있으면 실제 점수, 없으면 0)
      const chartData = months.map(month => {
        const score = monthlyMap.get(month) || 0
        return {
          month: formatMonth(month),
          score: score,
          originalMonth: month
        }
      })
      
      // 최대 점수 계산 (실제 데이터 기준)
      const maxScore = Math.max(...chartData.map(item => item.score))
      
      // 차트 높이를 적절하게 표시하기 위해 최대값에 여유분 추가 (20% 여유)
      const chartMaxScore = maxScore > 0 ? maxScore * 1.2 : 1000
      
      // 높이 계산
      const result = chartData.map(item => ({
        ...item,
        height: `${(item.score / chartMaxScore) * 100}%`
      }))
      
      console.log('생성된 차트 데이터:', result)
      console.log('최대 점수:', maxScore, '차트 최대값:', chartMaxScore)
      return result
    } else {
      console.log('기본 데이터로 차트 생성')
      return [
        { month: '3', score: 25000, height: '41.7%' },
        { month: '4', score: 35000, height: '58.3%' },
        { month: '5', score: 50000, height: '83.3%' },
        { month: '6', score: 30000, height: '50.0%' },
        { month: '7', score: 42500, height: '70.8%' },
        { month: '8', score: 50000, height: '83.3%' }
      ]
    }
  })()

  const handleBarClick = (index: number) => {
    setClickedBar(clickedBar === index ? null : index)
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
