import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import './CouponPage.css'

// 음식 이미지들을 import
import cafe1 from '../../../assets/foods/category-cafe-1.jpeg'
import cafe2 from '../../../assets/foods/category-cafe-2.jpeg'
import cafe3 from '../../../assets/foods/category-cafe-3.jpeg'
import chinese1 from '../../../assets/foods/category-chinese-1.jpeg'
import chinese2 from '../../../assets/foods/category-chinese-2.jpeg'
import chinese3 from '../../../assets/foods/category-chinese-3.jpeg'
import giftshop1 from '../../../assets/foods/category-giftshop-1.jpeg'
import giftshop2 from '../../../assets/foods/category-giftshop-2.jpeg'
import icecream1 from '../../../assets/foods/category-icecream-1.jpeg'
import icecream2 from '../../../assets/foods/category-icecream-2.jpeg'
import japanese1 from '../../../assets/foods/category-japanese-1.jpeg'
import japanese2 from '../../../assets/foods/category-japanese-2.jpeg'
import japanese3 from '../../../assets/foods/category-japanese-3.jpeg'
import korean1 from '../../../assets/foods/category-korean-1.jpeg'
import omakase1 from '../../../assets/foods/category-omakase-1.jpeg'
import omakase2 from '../../../assets/foods/category-omakase-2.jpeg'
import western1 from '../../../assets/foods/category-western-1.jpeg'
import western2 from '../../../assets/foods/category-western-2.jpeg'

interface Coupon {
  id: string
  restaurantName: string
  discountAmount: number
  expirationDate: string
  imageUrl: string
}

const CouponPage: React.FC = () => {
  const navigate = useNavigate()
  
  // 음식 이미지 배열
  const foodImages = [
    cafe1, cafe2, cafe3, chinese1, chinese2, chinese3,
    giftshop1, giftshop2, icecream1, icecream2,
    japanese1, japanese2, japanese3, korean1,
    omakase1, omakase2, western1, western2
  ]

  // 음식점 이름 배열
  const restaurantNames = [
    '슈니만두', 'SWU 31', '슈니천국', '슈밥', '슈슈치킨'
  ]

  // 랜덤 이미지와 음식점 이름 선택 함수
  const getRandomImage = () => {
    return foodImages[Math.floor(Math.random() * foodImages.length)]
  }

  const getRandomRestaurantName = () => {
    return restaurantNames[Math.floor(Math.random() * restaurantNames.length)]
  }

  const [coupons] = useState<Coupon[]>(() => {
    // 컴포넌트 초기화 시 랜덤하게 쿠폰 생성
    return Array.from({ length: 4 }, (_, index) => ({
      id: (index + 1).toString(),
      restaurantName: getRandomRestaurantName(),
      discountAmount: Math.floor(Math.random() * 5) * 1000 + 1000, // 1000, 2000, 3000, 4000, 5000원
      expirationDate: '25.08.31',
      imageUrl: getRandomImage()
    }))
  })

  // 페이지 진입 시 쿠폰 읽음 상태를 localStorage에 저장
  useEffect(() => {
    localStorage.setItem('couponRead', 'true')
  }, [])

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
            사용 가능한 쿠폰 <span className="coupon-count">{coupons.length}</span>
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
