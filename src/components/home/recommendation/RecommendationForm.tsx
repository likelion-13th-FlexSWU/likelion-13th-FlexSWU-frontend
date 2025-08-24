import React, { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import './RecommendationForm.css'
import backArrowIcon from '../../../assets/icons/icon-back-arrow.svg'
import { REGIONS } from '../../../types/location'

const RecommendationForm: React.FC = () => {
  const navigate = useNavigate()
  const [selectedRegion, setSelectedRegion] = useState<string>('nowon-all')
  const [searchTerm, setSearchTerm] = useState('')
  const [currentDistrict] = useState('노원구')

  // 현재 구에 해당하는 동네들만 필터링
  const filteredRegions = useMemo(() => {
    return REGIONS.filter(region => 
      region.district === currentDistrict &&
      region.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
  }, [currentDistrict, searchTerm])

  const handleBack = () => {
    window.history.back()
  }

  const handleCancel = () => {
    window.history.back()
  }

  const handleConfirm = () => {
    const selected = REGIONS.find(r => r.id === selectedRegion)
    console.log('선택된 동네:', selected)
    // 카테고리 선택 화면으로 이동
    navigate('/home/recommendation/category')
  }

  const handleRegionSelect = (regionId: string) => {
    setSelectedRegion(regionId)
  }

  return (
    <div className="recommendation-form-container">
      {/* 상단 헤더 */}
      <header className="recommendation-form-header">
        <button className="recommendation-back-button" onClick={handleBack}>
          <img src={backArrowIcon} alt="뒤로가기" width="18" height="17" />
        </button>
        <h1 className="recommendation-form-title">동네 설정</h1>
        <div className="recommendation-header-spacer"></div>
      </header>

      {/* 메인 폼 내용 */}
      <main className="recommendation-form-content">
        <div className="recommendation-form-section">
          <h2 className="recommendation-section-title">
            <span className="district-name">{currentDistrict}에서 추천 받고 싶은</span>
            <span className="title-subtext">동네를 선택해 주세요.</span>
          </h2>
          <p className="recommendation-section-note">* 중복 선택 불가</p>
        </div>

        {/* 검색바 */}
        <div className="recommendation-search-section">
          <div className="recommendation-search-container">
            <input
              type="text"
              placeholder="동네이름을 검색하세요."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="recommendation-search-input"
            />
            <div className="recommendation-search-icon">🔍</div>
          </div>
        </div>

        {/* 동네 목록 */}
        <div className="recommendation-region-section">
          <div className="recommendation-region-label">동·읍·면</div>
          <div className="recommendation-region-list">
            {filteredRegions.map((region) => (
              <div
                key={region.id}
                className={`recommendation-region-item ${selectedRegion === region.id ? 'selected' : ''}`}
                onClick={() => handleRegionSelect(region.id)}
              >
                <span className="recommendation-region-name">{region.name}</span>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* 하단 버튼 */}
      <footer className="recommendation-form-footer">
        <button className="recommendation-cancel-button" onClick={handleCancel}>
          취소
        </button>
        <button className="recommendation-confirm-button" onClick={handleConfirm}>
          확인
        </button>
      </footer>
    </div>
  )
}

export default RecommendationForm
