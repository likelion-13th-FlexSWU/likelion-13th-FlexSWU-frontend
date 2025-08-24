import React, { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import './RecommendationAtmosphereForm.css'
import backArrowIcon from '../../../assets/icons/icon-back-arrow.svg'
import selected2Icon from '../../../assets/icons/step-2-active.svg'
import selected1Icon from '../../../assets/icons/step-1-inactive.svg'
import selected3Icon from '../../../assets/icons/step-3-inactive.svg'

interface AtmosphereOption {
  id: string
  name: string
  emoji: string
}

const ATMOSPHERE_OPTIONS: AtmosphereOption[] = [
  { id: 'solo', name: '혼밥 하기 편해요', emoji: '👤' },
  { id: 'date', name: '데이트하기 좋아요', emoji: '👫' },
  { id: 'family', name: '가족과 가기 좋아요', emoji: '🏠' },
  { id: 'diverse', name: '메뉴가 다양해요', emoji: '🍽️' },
  { id: 'music', name: '음악 선정이 좋아요', emoji: '🎵' },
  { id: 'reading', name: '책 읽기 좋아요', emoji: '📚' },
  { id: 'photo', name: '사진찍기 좋아요', emoji: '📸' },
  { id: 'lively', name: '활기찬 공간이에요', emoji: '🔥' },
  { id: 'pets', name: '반려동물과 함께', emoji: '🐾' },
  { id: 'quiet', name: '조용해요', emoji: '🤫' },
  { id: 'overseas', name: '해외같아요', emoji: '🌍' },
  { id: 'cozy', name: '🛋️ 아늑해요', emoji: '🛋️' },
  { id: 'concentrate', name: '집중하기 좋아요', emoji: '💻' },
  { id: 'view', name: '뷰가 좋아요', emoji: '🖼️' },
  { id: 'spacious', name: '매장이 넓어요', emoji: '✅' },
  { id: 'plants', name: '식물이 많아요', emoji: '🌿' },
  { id: 'stay', name: '오래 머물기 좋아요', emoji: '🛋️' },
  { id: 'trendy', name: '트렌디해요', emoji: '😎' },
  { id: 'noisy', name: '시끌벅적해요', emoji: '🪩' },
  { id: 'interior', name: '인테리어가 감성적이에요', emoji: '🪞' }
]

const StoreAtmosphereForm: React.FC = () => {
  const [selectedOptions, setSelectedOptions] = useState<string[]>([])
  const navigate = useNavigate()
  const location = useLocation()
  
  // 전달받은 이전 단계 정보
  const selectedRegion = location.state?.selectedRegion
  const userDistrict = location.state?.userDistrict
  const selectedCategory = location.state?.selectedCategory

  const handleBack = () => {
    window.history.back()
  }

  const handleOptionSelect = (optionId: string) => {
    setSelectedOptions(prev => {
      if (prev.includes(optionId)) {
        // 이미 선택된 옵션을 다시 클릭하면 제거
        return prev.filter(id => id !== optionId)
      } else if (prev.length < 3) {
        // 3개 미만이면 추가
        return [...prev, optionId]
      }
      // 3개가 이미 선택된 상태에서는 추가 불가
      return prev
    })
  }

  const handleNext = () => {
    if (selectedOptions.length > 0) {
      const selectedAtmospheres = ATMOSPHERE_OPTIONS.filter(option => 
        selectedOptions.includes(option.id)
      ).map(option => option.name)
      
  
      
      // 선택된 정보와 함께 중복 여부 선택 화면으로 이동
      navigate('/home/recommendation/options', {
        state: {
          selectedRegion,
          userDistrict,
          selectedCategory,
          selectedAtmospheres
        }
      })
    }
  }

  return (
    <div className="store-atmosphere-container">
      {/* 상단 헤더 */}
      <header className="store-atmosphere-header">
        <button className="store-atmosphere-back-button" onClick={handleBack}>
          <img src={backArrowIcon} alt="뒤로가기" width="18" height="17" />
        </button>
        <h1 className="store-atmosphere-title">가게 추천</h1>
        <div className="store-atmosphere-header-spacer"></div>
      </header>

      {/* 진행 단계 표시 */}
      <div className="progress-section">
        <div className="progress-steps">
          <div className="progress-step">
            <img src={selected1Icon} alt="1단계" width="32" height="32" />
          </div>
          <div className="progress-step">
            <img src={selected2Icon} alt="2단계" width="32" height="32" />
          </div>
          <div className="progress-step">
            <img src={selected3Icon} alt="3단계" width="32" height="32" />
          </div>
        </div>
      </div>

      {/* 메인 콘텐츠 */}
      <main className="store-atmosphere-content">
        <div className="question-section">
          <h2 className="question-title">어떤 가게의 분위기이면 좋겠나요?</h2>
          <p className="question-note">* 중복 3개까지 가능</p>
        </div>

        {/* 분위기 옵션 그리드 */}
        <div className="atmosphere-grid">
          {ATMOSPHERE_OPTIONS.map((option) => (
            <div
              key={option.id}
              className={`atmosphere-item ${selectedOptions.includes(option.id) ? 'selected' : ''}`}
              onClick={() => handleOptionSelect(option.id)}
            >
              <div className="atmosphere-emoji">{option.emoji}</div>
              <div className="atmosphere-name">{option.name}</div>
            </div>
          ))}
        </div>
      </main>

      {/* 하단 버튼 */}
      <footer className="store-atmosphere-footer">
        <button 
          className={`store-atmosphere-next-button ${selectedOptions.length > 0 ? 'active' : 'disabled'}`}
          onClick={handleNext}
          disabled={selectedOptions.length === 0}
        >
          다음으로
        </button>
      </footer>
    </div>
  )
}

export default StoreAtmosphereForm
