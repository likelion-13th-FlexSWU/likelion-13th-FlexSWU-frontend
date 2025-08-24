import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { authAPI } from '../../../services/api'
import type { UserInfo } from '../../../types/auth'
import './MyInfoTab.css'
import witchIcon from '../../../assets/icons/witch.svg'
import couponIcon from '../../../assets/icons/coupon.svg'
import settingIcon from '../../../assets/icons/setting.svg'
import mypageBg from '../../../assets/backgrounds/mypage-bg.svg'

const MyInfoTab: React.FC = () => {
  const navigate = useNavigate()
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [hasUnreadCoupon, setHasUnreadCoupon] = useState(true) // 쿠폰 읽음 여부

  // API에서 사용자 정보 가져오기
  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        setLoading(true)
        const data = await authAPI.getUserInfo()
        setUserInfo(data)
        setError(null)
      } catch (err: any) {
        setError(err.message)
        // 에러 발생 시 기본값 설정
        setUserInfo({
          sido: "서울",
          gugun: "노원구",
          username: "사용자",
          type: null,
          monthly: []
        })
      } finally {
        setLoading(false)
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

  if (loading) {
    return (
      <div className="myinfo-tab">
        <div className="loading-message">사용자 정보를 불러오는 중...</div>
      </div>
    )
  }

  if (error && !userInfo) {
    return (
      <div className="myinfo-tab">
        <div className="error-message">사용자 정보를 불러올 수 없습니다: {error}</div>
      </div>
    )
  }

  if (!userInfo) {
    return (
      <div className="myinfo-tab">
        <div className="error-message">사용자 정보가 없습니다.</div>
      </div>
    )
  }

  return (
    <div className="myinfo-tab">
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
            <div className="myinfo-profile-avatar">
              <img src={witchIcon} alt="프로필 아바타" />
            </div>
            <div className="myinfo-profile-details">
              <h1 className="myinfo-username">
                {userInfo?.username || '사용자'}
              </h1>
              <p className="myinfo-location">
                <span>{userInfo?.gugun || '노원구'}</span>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 2. 통계 섹션 */}
      <section className="myinfo-stats-section">
        <div className="stats-grid">
          <div className="stat-item">
            <div className="stat-number">0</div>
            <div className="stat-label">방문한 가게</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">0</div>
            <div className="stat-label">리뷰</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">0</div>
            <div className="stat-label">쿠폰</div>
          </div>
        </div>
      </section>

      {/* 3. 월별 점수 차트 */}
      {userInfo.monthly && userInfo.monthly.length > 0 && (
        <section className="myinfo-chart-section">
          <h3 className="chart-section-title">월별 점수</h3>
          <div className="chart-container">
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="score" fill="#4DA9FF" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>
      )}

      {/* 4. 액션 버튼들 */}
      <section className="myinfo-actions-section">
        <button className="action-button" onClick={handleReviewClick}>
          <span className="action-icon">📝</span>
          <span className="action-text">내가 적은 리뷰</span>
        </button>
      </section>
    </div>
  )
}

export default MyInfoTab
