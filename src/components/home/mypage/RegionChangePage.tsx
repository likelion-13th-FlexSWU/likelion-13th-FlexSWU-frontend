import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { cityData } from '../../../types/location'
import type { CityName, DistrictName } from '../../../types/location'
import { authAPI } from '../../../services/api'
import Toast from '../../common/Toast'
import './RegionChangePage.css'

const RegionChangePage: React.FC = () => {
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCity, setSelectedCity] = useState<CityName | ''>('')
  const [selectedDistrict, setSelectedDistrict] = useState<DistrictName | ''>('')
  const [toast, setToast] = useState({
    message: '',
    isVisible: false,
    type: 'success' as 'success' | 'error' | 'info'
  })

  // 검색 결과 필터링
  const filteredCities = Object.keys(cityData).filter(city => 
    city.includes(searchQuery)
  )
  
  const filteredDistricts = selectedCity 
    ? cityData[selectedCity].filter(district => 
        district.includes(searchQuery)
      )
    : []

  // 토스트 메시지 표시 함수
  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    setToast({
      message,
      isVisible: true,
      type
    })
  }

  const handleBackClick = () => {
    navigate('/home/mypage/setting')
  }

  const handleCityChange = (city: CityName) => {
    setSelectedCity(city)
    setSelectedDistrict('') // 시/도 변경 시 구 초기화
  }

  const handleDistrictChange = (district: DistrictName) => {
    setSelectedDistrict(district)
  }

  const handleCancel = () => {
    navigate('/home/mypage/setting')
  }

  const handleConfirm = async () => {
    if (selectedCity && selectedDistrict) {
      try {
        await authAPI.updateRegion({
          sido: selectedCity,
          gugun: selectedDistrict
        })
        
        // 성공 토스트 표시 후 설정 페이지로 이동
        showToast('지역이 성공적으로 변경되었습니다!', 'success')
        setTimeout(() => {
          navigate('/setting')
        }, 1500) // 토스트가 보인 후 이동
      } catch (error: any) {
        // 2개월 제한 에러인지 확인
        if (error.message.includes('2개월')) {
          showToast('지역 변경은 마지막 변경일로부터 2개월 후에 가능합니다.', 'info')
        } else {
          // 기타 에러 토스트 표시
          showToast(`지역 변경 실패: ${error.message}`, 'error')
        }
      }
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

      {/* 토스트 메시지 */}
      <Toast
        message={toast.message}
        isVisible={toast.isVisible}
        type={toast.type}
        onClose={() => setToast(prev => ({ ...prev, isVisible: false }))}
      />
    </div>
  )
}

export default RegionChangePage
