import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { cityData } from '../../../types/location'
import type { CityName, DistrictName } from '../../../types/location'
import './RegionChangePage.css'

const RegionChangePage: React.FC = () => {
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCity, setSelectedCity] = useState<CityName | ''>('')
  const [selectedDistrict, setSelectedDistrict] = useState<DistrictName | ''>('')

  // 검색 결과 필터링
  const filteredCities = Object.keys(cityData).filter(city => 
    city.includes(searchQuery)
  )
  
  const filteredDistricts = selectedCity 
    ? cityData[selectedCity].filter(district => 
        district.includes(searchQuery)
      )
    : []

  const handleBackClick = () => {
    navigate('/setting')
  }

  const handleCityChange = (city: CityName) => {
    setSelectedCity(city)
    setSelectedDistrict('') // 시/도 변경 시 구 초기화
  }

  const handleDistrictChange = (district: DistrictName) => {
    setSelectedDistrict(district)
  }

  const handleCancel = () => {
    navigate('/setting')
  }

  const handleConfirm = () => {
    if (selectedCity && selectedDistrict) {
      // TODO: API 호출로 지역 변경
      console.log('지역 변경:', selectedCity, selectedDistrict)
      // 변경 완료 후 설정 페이지로 이동
      navigate('/setting')
    }
  }

  return (
    <div className="region-change-page">
      {/* 상단 헤더 */}
      <header className="region-change-header">
        <button className="region-change-back-button" onClick={handleBackClick}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M15 18L9 12L15 6" stroke="#4B4B4B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        <h1 className="region-change-title">동네 설정</h1>
        <div className="region-change-header-spacer"></div>
      </header>

      {/* 메인 콘텐츠 */}
      <div className="region-change-content">
        {/* 검색 바 */}
        <div className="region-change-search-bar">
          <input 
            type="text" 
            placeholder="지역명을 검색하세요."
            className="region-change-search-input"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <span className="region-change-search-icon">🔍</span>
        </div>

        {/* 지역 선택 영역 */}
        <div className="region-change-location-content">
          <div className="region-change-location-column">
            <div className="region-change-location-column-header">시·도</div>
            <div className="region-change-location-list">
              {(searchQuery ? filteredCities : Object.keys(cityData)).map(city => (
                <div 
                  key={city} 
                  className={`region-change-location-item ${selectedCity === city ? 'selected' : ''}`}
                  onClick={() => handleCityChange(city as CityName)}
                >
                  {city}
                </div>
              ))}
              {searchQuery && filteredCities.length === 0 && (
                <div className="region-change-location-no-results">검색 결과가 없습니다.</div>
              )}
            </div>
          </div>
          
          <div className="region-change-location-column">
            <div className="region-change-location-column-header">시·군·구</div>
            <div className="region-change-location-list">
              {selectedCity && (searchQuery ? filteredDistricts : cityData[selectedCity])?.map(district => (
                <div 
                  key={district} 
                  className={`region-change-location-item ${selectedDistrict === district ? 'selected' : ''}`}
                  onClick={() => handleDistrictChange(district as DistrictName)}
                >
                  {district}
                </div>
              ))}
              {searchQuery && selectedCity && filteredDistricts.length === 0 && (
                <div className="region-change-location-no-results">검색 결과가 없습니다.</div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 하단 버튼 */}
      <div className="region-change-bottom-buttons">
        <button className="region-change-cancel-btn" onClick={handleCancel}>
          취소
        </button>
        <button 
          className="region-change-confirm-btn"
          disabled={!selectedCity || !selectedDistrict}
          onClick={handleConfirm}
        >
          확인
        </button>
      </div>
    </div>
  )
}

export default RegionChangePage
