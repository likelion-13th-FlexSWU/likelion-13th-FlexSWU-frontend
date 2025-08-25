import React, { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { missionAPI } from '../../../services/api'
import type { MissionReviewRequest } from '../../../types/mission'
import './MissionReviewPage.css'

// 분위기 옵션 인터페이스
interface AtmosphereOption {
  id: string
  name: string
  emoji: string
}

// 분위기 옵션 데이터
const ATMOSPHERE_OPTIONS: AtmosphereOption[] = [
  { id: 'solo', name: '혼밥 하기 편해요', emoji: '👤' },
  { id: 'plants', name: '식물이 많아요', emoji: '🌿' },
  { id: 'stay', name: '오래 머물기 좋아요', emoji: '🛋️' },
  { id: 'diverse', name: '메뉴가 다양해요', emoji: '🍽️' },
  { id: 'music', name: '음악 선정이 좋아요', emoji: '🎵' },
  { id: 'reading', name: '책 읽기 좋아요', emoji: '📚' },
  { id: 'photo', name: '사진찍기 좋아요', emoji: '📸' },
  { id: 'lively', name: '활기찬 공간이에요', emoji: '🔥' },
  { id: 'pets', name: '강아지/고양이가 있어요', emoji: '🐾' },
  { id: 'quiet', name: '조용해요', emoji: '🤫' },
  { id: 'overseas', name: '해외같아요', emoji: '🌍' },
  { id: 'vegan', name: '비건 메뉴가 있어요', emoji: '🥑' },
  { id: 'concentrate', name: '집중하기 좋아요', emoji: '💻' },
  { id: 'view', name: '뷰가 좋아요', emoji: '🖼️' },
  { id: 'spacious', name: '매장이 넓어요', emoji: '✅' },
  { id: 'interior', name: '인테리어가 감성적이에요', emoji: '🪞' }
]

const MissionReviewPage: React.FC = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { missionId, receiptData } = location.state || {}
  const [selectedKeywords, setSelectedKeywords] = useState<string[]>([])
  const [reviewText, setReviewText] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleBackClick = () => {
    navigate('/home/mission/auth/complete')
  }

  const handleKeywordChange = (keywords: string[]) => {
    // 최대 4개까지만 선택 가능
    if (keywords.length <= 4) {
      setSelectedKeywords(keywords)
    }
  }

  const handleSkipReview = () => {
    // 리뷰 작성 건너뛰기
    navigate('/home')
  }

  const handleComplete = async () => {
    if (!missionId) {
      alert('미션 정보를 찾을 수 없습니다.')
      return
    }

    try {
      setIsSubmitting(true)
      
      const reviewData: MissionReviewRequest = {
        mission_id: missionId,
        tags: selectedKeywords,
        content: reviewText.trim() || null
      }

      await missionAPI.createReview(reviewData)
      
      alert('리뷰가 성공적으로 작성되었습니다!')
      navigate('/home')
      
    } catch (error: any) {
      alert(`리뷰 작성 실패: ${error.message}`)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="mission-review-container">
      {/* 상단바 */}
      <header className="mission-review-header">
        <button className="mission-review-back-button" onClick={handleBackClick}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        <h1 className="mission-review-title">후기 등록</h1>
        <div className="mission-review-spacer"></div>
      </header>

      {/* 메인 콘텐츠 */}
      <main className="mission-review-main">
        {/* 키워드 선택 섹션 */}
        <section className="mission-review-keywords-section">
          <h2 className="mission-review-section-title">
            어떤 점이 좋았나요? (1개~4개)
          </h2>
          <p className="mission-review-section-subtitle">
            아래 키워드를 선택해 주세요.
          </p>
          
          <div className="mission-review-atmosphere-options">
            {ATMOSPHERE_OPTIONS.map((option) => (
              <div
                key={option.id}
                className={`mission-review-atmosphere-option ${selectedKeywords.includes(option.id) ? 'selected' : ''}`}
                onClick={() => {
                  const newSelected = selectedKeywords.includes(option.id)
                    ? selectedKeywords.filter(id => id !== option.id)
                    : selectedKeywords.length < 4 
                      ? [...selectedKeywords, option.id]
                      : selectedKeywords;
                  handleKeywordChange(newSelected);
                }}
              >
                <span className="mission-review-atmosphere-emoji">{option.emoji}</span>
                <span className="mission-review-atmosphere-name">{option.name}</span>
              </div>
            ))}
          </div>
        </section>

        {/* 리뷰 작성 섹션 */}
        <section className="mission-review-text-section">
          <h2 className="mission-review-section-title">
            리뷰 작성(선택)
          </h2>
          
          <textarea
            className="mission-review-textarea"
            placeholder={`추천 받은 가게 이용 후
                느낀 점을 적어보세요.`}
            value={reviewText}
            onChange={(e) => setReviewText(e.target.value)}
            rows={6}
          />
        </section>
      </main>

      {/* 하단 액션 */}
      <div className="mission-review-bottom">
        <button className="mission-review-skip-button" onClick={handleSkipReview}>
          리뷰 작성 건너뛰기
        </button>
        <button 
          className={`mission-review-complete-button ${selectedKeywords.length > 0 ? 'active' : 'disabled'}`}
          onClick={handleComplete}
          disabled={selectedKeywords.length === 0 || isSubmitting}
        >
          {isSubmitting ? '작성 중...' : '완료하기'}
        </button>
      </div>
    </div>
  )
}

export default MissionReviewPage
