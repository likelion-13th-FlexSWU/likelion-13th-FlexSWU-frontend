import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './StoreOverlapForm.css'
import backArrowIcon from '../../../assets/icons/icon-back-arrow.svg'
import inactive1Icon from '../../../assets/icons/step-1-inactive.svg'
import inactive2Icon from '../../../assets/icons/step-2-inactive.svg'
import active3Icon from '../../../assets/icons/step-3-active.svg'
import checkedIcon from '../../../assets/icons/icon-checked.svg'
import uncheckedIcon from '../../../assets/icons/icon-unchecked.svg'

interface OverlapOption {
  id: string
  name: string
}

const OVERLAP_OPTIONS: OverlapOption[] = [
  { id: 'allow', name: '네, 중복 추천도 좋아요.' },
  { id: 'disallow', name: '아니요, 중복 없이 추천해 주세요.' },
]

const StoreOverlapForm: React.FC = () => {
  const navigate = useNavigate()
  const [selectedOption, setSelectedOption] = useState<string | null>(null)

  const handleBack = () => {
    navigate(-1) // 이전 페이지로 이동
  }

  const handleOptionSelect = (optionId: string) => {
    setSelectedOption(optionId === selectedOption ? null : optionId) // 토글 기능
  }

  const handleGetRecommendation = () => {
    if (selectedOption) {
      console.log('선택된 중복 옵션:', selectedOption)
      // 로딩 화면으로 이동
      navigate('/home/recommendation/loading')
    }
  }

  return (
    <div className="store-overlap-container">
      <header className="store-overlap-header">
        <button className="store-overlap-back-button" onClick={handleBack}>
          <img src={backArrowIcon} alt="뒤로가기" width="18" height="17" />
        </button>
        <h1 className="store-overlap-title">가게 추천</h1>
        <div className="store-overlap-header-spacer"></div>
      </header>

      <main className="store-overlap-content">
        {/* 진행 단계 표시 */}
        <div className="store-overlap-progress-section">
          <div className="store-overlap-progress-steps">
            <div className="store-overlap-progress-step">
              <img src={inactive1Icon} alt="1단계" width="32" height="32" />
            </div>
            <div className="store-overlap-progress-step">
              <img src={inactive2Icon} alt="2단계" width="32" height="32" />
            </div>
            <div className="store-overlap-progress-step">
              <img src={active3Icon} alt="3단계" width="32" height="32" />
            </div>
          </div>
        </div>

        <div className="store-overlap-question-section">
          <h2 className="store-overlap-question">이전 추천 결과와<br/>중복되어도 괜찮나요?</h2>
        </div>

        <div className="store-overlap-options">
          {OVERLAP_OPTIONS.map((option) => (
            <div
              key={option.id}
              className={`store-overlap-item ${selectedOption === option.id ? 'selected' : ''}`}
              onClick={() => handleOptionSelect(option.id)}
            >
              <img 
                src={selectedOption === option.id ? checkedIcon : uncheckedIcon} 
                alt="체크" 
                className="store-overlap-check-icon" 
              />
              <span className="store-overlap-name">{option.name}</span>
            </div>
          ))}
        </div>
      </main>

      <footer className="store-overlap-footer">
        <button
          className="store-overlap-recommend-button"
          onClick={handleGetRecommendation}
          disabled={!selectedOption}
        >
          추천 받기
        </button>
      </footer>
    </div>
  )
}

export default StoreOverlapForm
