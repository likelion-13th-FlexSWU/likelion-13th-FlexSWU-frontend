import React, { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import logoImage from '../../../assets/onlyLogo.svg'
import { missionAPI } from '../../../services/api'
import type { MissionReviewRequest } from '../../../types/mission'
import { ATMOSPHERE_OPTIONS } from '../recommendation/RecommendationAtmosphereForm'
import './MissionAuthCompletePage.css'

const MissionAuthCompletePage: React.FC = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { missionId, receiptData } = location.state || {}
  const [showReviewModal, setShowReviewModal] = useState(true)
  const [showReviewForm, setShowReviewForm] = useState(false)
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [reviewContent, setReviewContent] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSkipReview = () => {
    setShowReviewModal(false)
  }

  const handleWriteReview = () => {
    setShowReviewForm(true)
  }

  const handleTagToggle = (tagId: string) => {
    setSelectedTags(prev => 
      prev.includes(tagId) 
        ? prev.filter(id => id !== tagId)
        : [...prev, tagId]
    )
  }

  const handleSubmitReview = async () => {
    if (!missionId) {
      alert('미션 정보를 찾을 수 없습니다.')
      return
    }

    try {
      setIsSubmitting(true)
      
      const reviewData: MissionReviewRequest = {
        mission_id: missionId,
        tags: selectedTags,
        content: reviewContent.trim() || null
      }

      await missionAPI.createReview(reviewData)
      
      alert('리뷰가 성공적으로 작성되었습니다!')
      setShowReviewForm(false)
      setShowReviewModal(false)
      
    } catch (error: any) {
      alert(`리뷰 작성 실패: ${error.message}`)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleGoHome = () => {
    navigate('/home')
  }

  return (
    <div className="mission-auth-complete-container">
      {/* 메인 콘텐츠 */}
      <main className="mission-auth-complete-main">
        {/* 로고 캐릭터 */}
        <div className="mission-auth-complete-logo">
          <img src={logoImage} alt="Logo" className="mission-auth-complete-logo-image" />
        </div>

        {/* 완료 메시지 */}
        <div className="mission-auth-complete-message">
          <h1 className="mission-auth-complete-title">미션 인증 완료</h1>
          <p className="mission-auth-complete-subtitle">
            남은 미션도 완료하고 지역기여도를 쌓아보세요!
          </p>
        </div>

        {/* 리뷰 모달 */}
        {showReviewModal && !showReviewForm && (
          <div className="mission-auth-complete-review-modal">
            <div className="mission-auth-complete-review-content">
              {/* 드래그 핸들 */}
              <div className="mission-auth-complete-review-drag-handle"></div>
              
              <h2 className="mission-auth-complete-review-title">
                추천 받은 장소는 어떠셨나요?
              </h2>
              <p className="mission-auth-complete-review-subtitle">
                해당 가게의 리뷰를 써주세요.
              </p>
              
              <div className="mission-auth-complete-review-actions">
                <button 
                  className="mission-auth-complete-skip-button"
                  onClick={handleSkipReview}
                >
                  건너뛰기
                </button>
                <button 
                  className="mission-auth-complete-review-button"
                  onClick={handleWriteReview}
                >
                  리뷰 작성하기
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 리뷰 작성 폼 */}
        {showReviewForm && (
          <div className="mission-auth-complete-review-form">
            <div className="mission-auth-complete-review-form-content">
              <h2 className="mission-auth-complete-review-form-title">리뷰 작성</h2>
              
              {/* 태그 선택 */}
              <div className="review-tags-section">
                <h3>어떤 점이 좋았나요? (복수 선택 가능)</h3>
                <div className="review-tags">
                  {ATMOSPHERE_OPTIONS.map((tag: { id: string; name: string; emoji: string }) => (
                    <button
                      key={tag.id}
                      className={`review-tag ${selectedTags.includes(tag.id) ? 'selected' : ''}`}
                      onClick={() => handleTagToggle(tag.id)}
                    >
                      {tag.emoji} {tag.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* 리뷰 내용 */}
              <div className="review-content-section">
                <h3>리뷰 내용 (선택사항)</h3>
                <textarea
                  className="review-content-textarea"
                  placeholder="방문한 장소에 대한 리뷰를 작성해주세요..."
                  value={reviewContent}
                  onChange={(e) => setReviewContent(e.target.value)}
                  rows={4}
                />
              </div>

              {/* 버튼 */}
              <div className="review-form-actions">
                <button 
                  className="review-cancel-button"
                  onClick={() => setShowReviewForm(false)}
                  disabled={isSubmitting}
                >
                  취소
                </button>
                <button 
                  className="review-submit-button"
                  onClick={handleSubmitReview}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? '제출 중...' : '리뷰 제출'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 홈으로 버튼 (모달이 숨겨진 후 표시) */}
        {!showReviewModal && !showReviewForm && (
          <div className="mission-auth-complete-home-button-wrapper">
            <button 
              className="mission-auth-complete-home-button"
              onClick={handleGoHome}
            >
              홈으로
            </button>
          </div>
        )}
      </main>
    </div>
  )
}

export default MissionAuthCompletePage
