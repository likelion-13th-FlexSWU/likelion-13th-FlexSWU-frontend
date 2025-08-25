import React, { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { authAPI } from '../../../services/api'
import './RecommendationCategoryForm.css'
import backArrowIcon from '../../../assets/icons/icon-back-arrow.svg'
import selected1Icon from '../../../assets/icons/step-1-active.svg'
import unselected2Icon from '../../../assets/icons/step-2-inactive.svg'
import unselected3Icon from '../../../assets/icons/step-3-inactive.svg'

interface StoreCategory {
  id: string
  name: string
  emoji: string
}

const STORE_CATEGORIES: StoreCategory[] = [
  { id: 'korean', name: '한식당', emoji: '🍚' },
  { id: 'japanese', name: '일식당', emoji: '🍣' },
  { id: 'chinese', name: '중식당', emoji: '🥟' },
  { id: 'western', name: '양식집', emoji: '🍝' },
  { id: 'snack', name: '분식집', emoji: '🌭' },
  { id: 'coffee', name: '커피 전문점', emoji: '☕' },
  { id: 'pub', name: '호프집', emoji: '🍺' },
  { id: 'izakaya', name: '일본식 주점', emoji: '🍶' },
  { id: 'bakery', name: '제과점, 베이커리', emoji: '🥐' },
  { id: 'icecream', name: '아이스크림 가게', emoji: '🍦' },
  { id: 'accessory', name: '소품샵', emoji: '🧸' }
]

const RecommendationCategoryForm: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('')
  const navigate = useNavigate()
  const location = useLocation()
  
  // 전달받은 동네 정보
  const selectedRegion = location.state?.selectedRegion
  const userDistrict = location.state?.userDistrict

  const handleBack = () => {
    window.history.back()
  }

  const handleCategorySelect = (categoryId: string) => {
    if (selectedCategory === categoryId) {
      // 이미 선택된 카테고리를 다시 클릭하면 선택 취소
      setSelectedCategory('')
    } else {
      // 새로운 카테고리 선택
      setSelectedCategory(categoryId)
    }
  }

  const handleNext = () => {
    if (selectedCategory) {
      const selectedCategoryData = STORE_CATEGORIES.find(cat => cat.id === selectedCategory)
  
      
      // 선택된 정보와 함께 분위기 선택 화면으로 이동
      navigate('/home/recommendation/atmosphere', {
        state: {
          selectedRegion,
          userDistrict,
          selectedCategory: selectedCategoryData
        }
      })
    }
  }

  const handleWeatherBasedRecommendation = async () => {
    try {
      // 날씨 기반 추천 API 호출
      const data = await authAPI.getWeatherBasedRecommendation([userDistrict, selectedRegion?.name])
      
      // 날씨 기반 추천 결과를 result 화면으로 이동
      navigate('/home/recommendation/result', {
        state: {
          weatherRecommendation: true,
          weatherData: data,
          selectedRegion,
          userDistrict
        }
      })
    } catch (error: any) {
      alert('날씨 기반 추천을 가져오는데 실패했습니다.')
    }
  }

  return (
    <div className="recommendation-category-container">
      {/* 상단 헤더 */}
      <header className="recommendation-category-header">
        <button className="recommendation-category-back-button" onClick={handleBack}>
          <img src={backArrowIcon} alt="뒤로가기" width="18" height="17" />
        </button>
        <h1 className="recommendation-category-title">가게 추천</h1>
        <div className="recommendation-category-header-spacer"></div>
      </header>

      {/* 진행 단계 표시 */}
      <div className="progress-section">
        <div className="progress-steps">
          <div className="progress-step">
            <img src={selected1Icon} alt="1단계" width="32" height="32" />
          </div>
          <div className="progress-step">
            <img src={unselected2Icon} alt="2단계" width="32" height="32" />
          </div>
          <div className="progress-step">
            <img src={unselected3Icon} alt="3단계" width="32" height="32" />
          </div>
        </div>
      </div>

      {/* 메인 콘텐츠 */}
      <main className="recommendation-category-content">
        <div className="question-section">
          <h2 className="question-title">오늘 가고 싶은 장소는 어디인가요?</h2>
          <p className="question-note">* 중복 불가</p>
        </div>

        {/* 가게 카테고리 그리드 */}
        <div className="category-grid">
          {STORE_CATEGORIES.map((category) => (
            <div
              key={category.id}
              className={`category-item ${category.id} ${selectedCategory === category.id ? 'selected' : ''}`}
              onClick={() => handleCategorySelect(category.id)}
            >
              <div className="category-emoji">{category.emoji}</div>
              <div className="category-name">{category.name}</div>
            </div>
          ))}
        </div>
      </main>

      {/* 하단 버튼 */}
      <footer className="recommendation-category-footer">
        <button 
          className="weather-based-recommendation-button"
          onClick={handleWeatherBasedRecommendation}
        >
          🌤️현재날씨 기반 추천 받기🌤️
        </button>
        <button 
          className={`recommendation-category-next-button ${selectedCategory ? 'active' : 'disabled'}`}
          onClick={handleNext}
          disabled={!selectedCategory}
        >
          다음으로
        </button>
      </footer>
    </div>
  )
}

export default RecommendationCategoryForm
