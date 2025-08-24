import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import deleteIcon from '../../../assets/icons/delete.svg'
import './MyReviewsPage.css'

interface Review {
  id: string
  restaurantName: string
  content: string
  keywords: string[]
  date: string
}

const MyReviewsPage: React.FC = () => {
  const navigate = useNavigate()
  const [reviews, setReviews] = useState<Review[]>([
    {
      id: '1',
      restaurantName: '솔직하다',
      content: '김치 카츠나베가 진짜 마싯음 대박임',
      keywords: ['혼밥 하기 편해요', '인테리어가 감성적이에요'],
      date: '2025. 08. 25'
    },
    {
      id: '2',
      restaurantName: '블라',
      content: '브런치가 진짜 마싯음 대박임',
      keywords: ['혼밥 하기 편해요', '인테리어가 감성적이에요'],
      date: '2025. 08. 25'
    },
    {
      id: '3',
      restaurantName: '753 베이글비스트로',
      content: '베이글이 진짜 마싯음 대박임',
      keywords: ['혼밥 하기 편해요', '인테리어가 감성적이에요'],
      date: '2025. 08. 25'
    }
  ])

  const [selectedReviewId, setSelectedReviewId] = useState<string | null>(null)

  const handleBackClick = () => {
    navigate('/home/mypage')
  }

  const handleOptionsClick = (reviewId: string) => {
    setSelectedReviewId(selectedReviewId === reviewId ? null : reviewId)
  }

  const handleDeleteReview = (reviewId: string) => {
    if (window.confirm('이 리뷰를 삭제하시겠습니까?')) {
      setReviews(prev => prev.filter(review => review.id !== reviewId))
      setSelectedReviewId(null)
    }
  }

  const renderKeywords = (keywords: string[]) => {
    return keywords.map((keyword, index) => (
      <span key={index} className="review-keyword">
        {keyword}
      </span>
    ))
  }

  return (
    <div className="my-reviews-page">
      {/* 상단 헤더 */}
      <header className="my-reviews-header">
        <button className="my-reviews-back-button" onClick={handleBackClick}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M15 18L9 12L15 6" stroke="#4B4B4B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        <h1 className="my-reviews-title">내가 적은 리뷰</h1>
        <div className="my-reviews-header-spacer"></div>
      </header>

      {/* 리뷰 목록 */}
      <div className="my-reviews-content">
        {reviews.length > 0 ? (
          <div className="reviews-list">
            {reviews.map((review) => (
              <div key={review.id} className="review-item">
                {/* 리뷰 헤더 */}
                <div className="review-header">
                  <div className="review-restaurant-info">
                    <h3 className="review-restaurant-name">{review.restaurantName}</h3>
                    <span className="review-date">{review.date}</span>
                  </div>
                  <div className="review-options">
                    <button 
                      className="review-options-button"
                      onClick={() => handleOptionsClick(review.id)}
                    >
                      ⋯
                    </button>
                    {selectedReviewId === review.id && (
                      <div className="review-options-menu">
                        <button 
                          className="review-delete-button"
                          onClick={() => handleDeleteReview(review.id)}
                        >
                          <img src={deleteIcon} alt="삭제" />
                          삭제하기
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* 리뷰 내용 */}
                <div className="review-content">
                  <p className="review-text">{review.content}</p>
                  <div className="review-keywords">
                    {renderKeywords(review.keywords)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="no-reviews">
            <div className="no-reviews-icon">📝</div>
            <h3 className="no-reviews-title">아직 작성한 리뷰가 없어요</h3>
            <p className="no-reviews-description">
              맛있는 음식을 먹고 리뷰를 작성해보세요!
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default MyReviewsPage
