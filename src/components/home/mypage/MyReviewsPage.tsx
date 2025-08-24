import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import deleteIcon from '../../../assets/icons/delete.svg'
import { missionAPI } from '../../../services/api'
import type { ReviewItem } from '../../../types/mission'
import { ATMOSPHERE_OPTIONS } from '../recommendation/RecommendationAtmosphereForm'
import './MyReviewsPage.css'

const MyReviewsPage: React.FC = () => {
  const navigate = useNavigate()
  const [reviews, setReviews] = useState<ReviewItem[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedReviewId, setSelectedReviewId] = useState<string | null>(null)

  // 리뷰 목록 가져오기
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        setLoading(true)
        const response = await missionAPI.getReviews()
        setReviews(response.content)
      } catch (error: any) {
        console.error('리뷰 목록 가져오기 실패:', error)
        // 에러 발생 시 빈 배열로 설정
        setReviews([])
      } finally {
        setLoading(false)
      }
    }

    fetchReviews()
  }, [])

  const handleBackClick = () => {
    navigate('/home/mypage')
  }

  const handleOptionsClick = (reviewId: string) => {
    setSelectedReviewId(selectedReviewId === reviewId ? null : reviewId)
  }

  const handleDeleteReview = async (reviewId: string) => {
    if (window.confirm('이 리뷰를 삭제하시겠습니까?')) {
      try {
        await missionAPI.deleteReview(reviewId)
        
        // 성공적으로 삭제되면 로컬 상태 업데이트
        setReviews(prev => prev.filter(review => review.reviewid !== reviewId))
        setSelectedReviewId(null)
        
        alert('리뷰가 삭제되었습니다.')
      } catch (error: any) {
        alert(`리뷰 삭제 실패: ${error.message}`)
      }
    }
  }

  const renderTags = (tags: { code: string }[]) => {
    // 태그 코드를 사용자 친화적인 텍스트로 변환
    const tagMap: { [key: string]: string } = {}
    
    // ATMOSPHERE_OPTIONS에서 tagMap 생성
    ATMOSPHERE_OPTIONS.forEach(option => {
      tagMap[option.id] = option.name
    })

    return tags.map((tag, index) => (
      <span key={index} className="review-keyword">
        {tagMap[tag.code] || tag.code}
      </span>
    ))
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return `${date.getFullYear()}. ${String(date.getMonth() + 1).padStart(2, '0')}. ${String(date.getDate()).padStart(2, '0')}`
  }

  if (loading) {
    return (
      <div className="my-reviews-page">
        <header className="my-reviews-header">
          <button className="my-reviews-back-button" onClick={handleBackClick}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M15 18L9 12L15 6" stroke="#4B4B4B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          <h1 className="my-reviews-title">내가 적은 리뷰</h1>
          <div className="my-reviews-header-spacer"></div>
        </header>
        
        <div className="my-reviews-content">
          <div className="loading-reviews">
            <div className="loading-spinner"></div>
            <p>리뷰를 불러오는 중...</p>
          </div>
        </div>
      </div>
    )
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
        <h1 className="my-reviews-title">나의 리뷰</h1>
        <div className="my-reviews-header-spacer"></div>
      </header>

      {/* 리뷰 목록 */}
      <div className="my-reviews-content">
        {reviews.length > 0 ? (
          <div className="reviews-list">
            {reviews.map((review) => (
              <div key={review.reviewid} className="review-item">
                {/* 리뷰 헤더 */}
                <div className="review-header">
                  <div className="review-restaurant-info">
                    <h3 className="review-restaurant-name">{review.placeName}</h3>
                    <span className="review-date">{formatDate(review.visitedAt)}</span>
                  </div>
                  <div className="review-options">
                    <button 
                      className="review-options-button"
                      onClick={() => handleOptionsClick(review.reviewid)}
                    >
                      ⋯
                    </button>
                    {selectedReviewId === review.reviewid && (
                      <div className="review-options-menu">
                        <button 
                          className="review-delete-button"
                          onClick={() => handleDeleteReview(review.reviewid)}
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
                  {review.content && (
                    <p className="review-text">{review.content}</p>
                  )}
                  <div className="review-keywords">
                    {renderTags(review.tags)}
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
              나만의 솔직한 리뷰를 남겨보세요!
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default MyReviewsPage
