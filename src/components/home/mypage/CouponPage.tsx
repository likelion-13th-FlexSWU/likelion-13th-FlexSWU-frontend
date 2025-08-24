import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './CouponPage.css'

interface Coupon {
  id: string
  restaurantName: string
  discountAmount: number
  expirationDate: string
  imageUrl: string
}

const CouponPage: React.FC = () => {
  const navigate = useNavigate()
  const [coupons] = useState<Coupon[]>([
    {
      id: '1',
      restaurantName: '슈니만두',
      discountAmount: 3000,
      expirationDate: '25.08.20',
      imageUrl: 'https://via.placeholder.com/60x60/FF6B6B/FFFFFF?text=🍜'
    },
    {
      id: '2',
      restaurantName: '슈니만두',
      discountAmount: 3000,
      expirationDate: '25.08.20',
      imageUrl: 'https://via.placeholder.com/60x60/FF6B6B/FFFFFF?text=🍜'
    },
    {
      id: '3',
      restaurantName: '슈니만두',
      discountAmount: 3000,
      expirationDate: '25.08.20',
      imageUrl: 'https://via.placeholder.com/60x60/FF6B6B/FFFFFF?text=🍜'
    },
    {
      id: '4',
      restaurantName: '슈니만두',
      discountAmount: 3000,
      expirationDate: '25.08.20',
      imageUrl: 'https://via.placeholder.com/60x60/FF6B6B/FFFFFF?text=🍜'
    }
  ])

  const handleBackClick = () => {
    navigate('/home/mypage')
  }

  return (
    <div className="coupon-page">
      {/* 상단 헤더 */}
      <header className="coupon-header">
        <button className="coupon-back-button" onClick={handleBackClick}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M15 18L9 12L15 6" stroke="#4B4B4B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        <h1 className="coupon-title">내 쿠폰함</h1>
        <div className="coupon-header-spacer"></div>
      </header>

      {/* 쿠폰 목록 */}
      <div className="coupon-content">
        <div className="coupon-section-header">
          <h2 className="coupon-section-title">
            사용 가능한 쿠폰 {coupons.length}
            <span className="coupon-new-dot"></span>
          </h2>
        </div>

        <div className="coupon-list">
          {coupons.map((coupon) => (
            <div key={coupon.id} className="coupon-item">
              <div className="coupon-left">
                <img src={coupon.imageUrl} alt="음식 이미지" className="coupon-image" />
              </div>
              <div className="coupon-divider"></div>
              <div className="coupon-right">
                <h3 className="coupon-restaurant-name">{coupon.restaurantName}</h3>
                <p className="coupon-discount">{coupon.discountAmount.toLocaleString()}원 할인 쿠폰</p>
                <p className="coupon-expiration">유효기간: ~ {coupon.expirationDate}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default CouponPage
