import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { authAPI } from '../../../services/api'
import type { UserInfo } from '../../../types/auth'
import witchIcon from '../../../assets/icons/witch.svg'
import couponIcon from '../../../assets/icons/coupon.svg'
import settingIcon from '../../../assets/icons/setting.svg'
import mypageBg from '../../../assets/backgrounds/mypage-bg.svg'
import './MyInfoPage.css'


const MyInfoPage: React.FC = () => {
  const navigate = useNavigate()
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null)
  const [hasUnreadCoupon, setHasUnreadCoupon] = useState(true) // 쿠폰 읽음 여부


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

  const handleCouponClick = () => {
    // 쿠폰 페이지로 이동
    navigate('/coupon')
    // 쿠폰을 봤으므로 빨간 점 제거
    setHasUnreadCoupon(false)
  }

  const handleSettingClick = () => {
    // 설정 페이지로 이동
    navigate('/setting')
  }

  const handleReviewClick = () => {
    // 내가 적은 리뷰 페이지로 이동
    navigate('/my-reviews')
  }

  const formatMonth = (monthStr: string) => {
    const month = monthStr.split('-')[1]
    return `${parseInt(month)}월`
  }

  // Recharts용 차트 데이터 변환
  const chartData = userInfo?.monthly.map(item => ({
    name: formatMonth(item.month),
    score: item.score
  })) || []



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
        <div className="myinfo-taste-card">
          <span className="myinfo-taste-emoji">🐧</span>
          <h2 className="myinfo-taste-title">
            나는 어떤 취향 유형일까?
          </h2>
          <p className="myinfo-taste-description">
            AI추천 10번 받으면 확인 가능해요!
          </p>
        </div>
      </section>

      {/* 3. 지역기여도 섹션 */}
      <section className="myinfo-contribution-section">
        <div className="myinfo-contribution-card">
          <h2 className="myinfo-contribution-title">
            6개월 간의 지역기여도
          </h2>
          
                    {userInfo?.monthly && (
            <div className="myinfo-chart-container">
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={chartData} margin={{ top: 20, right: 20, left: 20, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e9ecef" />
                  <XAxis 
                    dataKey="name" 
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12, fill: '#6c757d' }}
                  />
                  <YAxis 
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 11, fill: '#6c757d' }}
                    domain={[0, 2000]}
                  />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: '#4B4B4B',
                      color: 'white',
                      border: 'none',
                      borderRadius: '8px',
                      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)'
                    }}
                    formatter={(value) => [`${value}점`, '점수']}
                    labelStyle={{ color: 'white' }}
                  />
                  <Bar 
                    dataKey="score" 
                    fill="#007BEB"
                    radius={[6, 6, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}

export default MyInfoPage
