import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './SignupForm.css'
import BackArrowIcon from '../../assets/icons/icon-back-arrow.png'
import UncheckedIcon from '../../assets/icons/icon-unchecked.png'
import CheckedIcon from '../../assets/icons/icon-checked.png'
import { cityData } from '../../types/location'
import type { CityName, DistrictName } from '../../types/location'

/**
 * 회원가입 폼 컴포넌트 (단계별 입력)
 */
const SignupForm = () => {
  // 현재 단계 (0: 아이디, 1: 비밀번호, 2: 닉네임, 3: 약관동의, 4: 동네위치설정, 5: 회원가입완료)
  const [currentStep, setCurrentStep] = useState(0)
  
  // 페이지 이동을 위해 사용하는 함수
  const navigate = useNavigate()
  
  // 사용자가 입력한 폼 데이터를 저장하는 상태
  const [formData, setFormData] = useState<{
    userId: string
    password: string
    confirmPassword: string
    nickname: string
    city: CityName | ''
    district: DistrictName | ''
  }>({
    userId: '',
    password: '',
    confirmPassword: '',
    nickname: '',
    city: '',      // 시
    district: ''   // 구
  })

  // 아이디 관련 상태 관리
  const [isIdChecked, setIsIdChecked] = useState(false)        // 중복확인 완료 여부
  const [idValidationStatus, setIdValidationStatus] = useState(0)  // 유효성 상태 (0: 초기, 1: 유효하지 않음, 2: 유효함)
  const [idDuplicateStatus, setIdDuplicateStatus] = useState(0)    // 중복 상태 (0: 초기, 1: 중복, 2: 사용가능)

  // 비밀번호 관련 상태 관리
  const [passwordValidationStatus, setPasswordValidationStatus] = useState(0)  // 비밀번호 유효성 상태 (0: 초기, 1: 유효하지 않음, 2: 유효함)
  const [passwordMatchStatus, setPasswordMatchStatus] = useState(0)           // 비밀번호 일치 상태 (0: 초기, 1: 불일치, 2: 일치)

  // 닉네임 관련 상태 관리
  const [nicknameValidationStatus, setNicknameValidationStatus] = useState(0)  // 닉네임 유효성 상태 (0: 초기, 1: 유효하지 않음, 2: 유효함)

  // 약관 동의 관련 상태 관리
  const [showTermsModal, setShowTermsModal] = useState(false)  // 약관 동의 모달 표시 여부
  const [agreements, setAgreements] = useState({
    serviceTerms: false,      // 서비스 이용약관 (필수)
    privacyPolicy: false,     // 개인정보 처리방침 (필수)
    locationService: false,   // 위치기반 서비스 이용약관 (필수)
    marketing: false          // 마케팅 정보 수신 동의 (선택)
  })

  // 지역 선택 관련 상태 관리
  const [searchQuery, setSearchQuery] = useState('')  // 검색어

  // 지역 관련 상태 관리
  const [cityValidationStatus, setCityValidationStatus] = useState(0)      // 시 선택 상태 (0: 미선택, 1: 선택됨)
  const [districtValidationStatus, setDistrictValidationStatus] = useState(0)  // 구 선택 상태 (0: 미선택, 1: 선택됨)

  // 검색 결과 필터링
  const filteredCities = Object.keys(cityData).filter(city => 
    city.includes(searchQuery)
  )
  
  const filteredDistricts = formData.city 
    ? cityData[formData.city].filter(district => 
        district.includes(searchQuery)
      )
    : []

  // 아이디 입력값 변경 핸들러
  const handleUserIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    
    // 폼 데이터 업데이트
    setFormData(prev => ({ ...prev, userId: value }))
    
    // 아이디가 변경되면 중복확인 상태 초기화 (사용자가 다시 중복확인해야 함)
    if (isIdChecked || idDuplicateStatus !== 0) {
      setIsIdChecked(false)
      setIdDuplicateStatus(0)
    }
    
    // 실시간 아이디 유효성 검사
    if (value.length === 0) {
      // 빈 값인 경우 - 초기 상태
      setIdValidationStatus(0)
    } else if (value.length < 6 || value.length > 12 || !/^[a-zA-Z0-9]+$/.test(value)) {
      // 유효하지 않은 경우: 6자 미만, 12자 초과, 또는 영문/숫자 외 문자 포함
      setIdValidationStatus(1)
    } else {
      // 유효한 경우: 6~12자 영문/숫자만
      setIdValidationStatus(2)
    }
  }

  // 아이디 중복 확인 핸들러
  const handleIdCheck = () => {
    // TODO: 실제 API 호출로 중복 확인
    // 개발 단계에서는 항상 사용가능한 아이디로 처리
    setIdDuplicateStatus(2)  // 사용가능 상태로 설정
    setIsIdChecked(true)     // 중복확인 완료로 설정
  }

  // 비밀번호 입력값 변경 핸들러
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setFormData(prev => ({ ...prev, password: value }))
    
    // 비밀번호가 변경되면 일치 상태 초기화
    if (passwordMatchStatus !== 0) {
      setPasswordMatchStatus(0)
    }
    
    // 실시간 비밀번호 유효성 검사
    if (value.length === 0) {
      setPasswordValidationStatus(0)
    } else if (value.length < 6 || value.length > 12 || !/^[a-zA-Z0-9!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+$/.test(value)) {
      setPasswordValidationStatus(1)
    } else {
      setPasswordValidationStatus(2)
    }
  }

  // 비밀번호 확인 입력값 변경 핸들러
  const handleConfirmPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setFormData(prev => ({ ...prev, confirmPassword: value }))
    
    // 실시간 비밀번호 일치 검사
    if (value.length === 0) {
      setPasswordMatchStatus(0)
    } else if (value === formData.password) {
      setPasswordMatchStatus(2)
    } else {
      setPasswordMatchStatus(1)
    }
  }

  // 닉네임 입력값 변경 핸들러
  const handleNicknameChange = (e: React.ChangeEvent<HTMLInputElement> | React.FormEvent<HTMLInputElement>) => {
    const value = (e.target as HTMLInputElement).value
    
    // 15자로 제한
    if (value.length > 15) {
      setNicknameValidationStatus(1) // 15자 초과 시 에러 상태로 설정
      return // 입력은 무시
    }
    
    setFormData(prev => ({ ...prev, nickname: value }))
    
    // 실시간 닉네임 유효성 검사
    if (value.length === 0) {
      setNicknameValidationStatus(0)
    } else if (value.trim() === '') {
      setNicknameValidationStatus(1)
    } else {
      setNicknameValidationStatus(2)
    }
  }

  // 약관 동의 체크박스 핸들러
  const handleAgreementChange = (key: keyof typeof agreements) => {
    setAgreements(prev => ({
      ...prev,
      [key]: !prev[key]
    }))
  }

  // 약관 동의 모달 열기
  const openTermsModal = () => {
    setShowTermsModal(true)
  }

  // 약관 동의 모달 닫기
  const closeTermsModal = () => {
    setNicknameValidationStatus(0)
  }

  // 필수 약관 동의 확인
  const isRequiredAgreementsChecked = () => {
    return agreements.serviceTerms && agreements.privacyPolicy && agreements.locationService
  }


  // 시 선택 핸들러
  const handleCityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value as CityName | ''
    setFormData(prev => ({ ...prev, city: value, district: '' })) // 시가 변경되면 구 초기화
    
    if (value) {
      setCityValidationStatus(1)
      setDistrictValidationStatus(0) // 구 선택 상태 초기화
    } else {
      setCityValidationStatus(0)
      setDistrictValidationStatus(0)
    }
  }

  // 구 선택 핸들러
  const handleDistrictChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value as DistrictName | ''
    setFormData(prev => ({ ...prev, district: value }))
    
    if (value) {
      setDistrictValidationStatus(1)
    } else {
      setDistrictValidationStatus(0)
    }
  }



  // 다음 단계로 이동 핸들러
  const handleNextStep = () => {
    if (currentStep === 0) {
      // 아이디 단계: 이미 버튼이 비활성화되어 있어서 추가 검증 불필요
    } else if (currentStep === 1) {
      // 비밀번호 단계: 비밀번호와 비밀번호 확인이 일치하는지 확인
      if (!formData.password) {
        alert('비밀번호를 입력해주세요.')
        return
      }
      if (!formData.confirmPassword) {
        alert('비밀번호 확인을 입력해주세요.')
        return
      }
      if (formData.password !== formData.confirmPassword) {
        alert('비밀번호가 일치하지 않습니다.')
        return
      }
    } else if (currentStep === 2) {
      // 닉네임 단계: 약관 동의 모달 열기
      openTermsModal()
      return
    } else if (currentStep === 3) {
      // 지역 단계: 시와 구가 모두 선택되었는지 확인
      if (!formData.city || !formData.district) {
        alert('시와 구를 모두 선택해주세요.')
        return
      }
    }
    
    // 모든 조건이 만족되면 다음 단계로 이동
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1)
    }
  }

  // 이전 단계로 이동 핸들러
  const handlePrevStep = () => {
    if (currentStep === 0) {
      // 아이디 입력 단계에서는 온보딩으로 이동
      navigate('/')
    } else {
      // 다른 단계에서는 이전 단계로 이동
      setCurrentStep(currentStep - 1)
    }
  }

  // 약관 동의 후 동네 위치 설정으로 이동
  const handleTermsAgreement = () => {
    setCurrentStep(4) // 동네 위치 설정 단계로 이동
    setShowTermsModal(false) // 모달 닫기
  }

  // 회원가입 완료 핸들러
  const handleSignupComplete = () => {
    // TODO: 실제 회원가입 API 호출
    console.log('회원가입 완료:', formData)
    alert('회원가입이 완료되었습니다!')
  }

  // 아이디 입력 단계 렌더링
  const renderIdStep = () => (
    <div className="signup-step">
      <div className="step-title">아이디 입력</div>
              <div className="input-group">
          <div className="input-row">
            <div className={`input-container ${
              idValidationStatus === 2 ? 'input-container-valid' : ''
            }`}>
              <div className="input-label">아이디</div>
              <input
                type="text"
                className="input-field"
                placeholder="아이디를 입력해 주세요."
                value={formData.userId}
                onChange={handleUserIdChange}
                maxLength={12}
              />
            </div>
            
            <button 
              className={`duplicate-check-btn ${
                idValidationStatus === 2 && idDuplicateStatus === 0 ? 'duplicate-check-btn-valid' : 'duplicate-check-btn-disabled'
              }`}
              onClick={handleIdCheck}
              disabled={idValidationStatus !== 2 || idDuplicateStatus !== 0}
            >
              중복확인
            </button>
          </div>
          
          <div className={`input-hint ${
            idValidationStatus === 1 ? 'error' : 
            idDuplicateStatus === 1 ? 'error' : 
            idDuplicateStatus === 2 ? 'success' : ''
          }`}>
            {idValidationStatus === 1 ? '6~12자의 영문과 숫자로 입력해 주세요.' :
             idDuplicateStatus === 1 ? '중복되는 아이디입니다.' :
             idDuplicateStatus === 2 ? '사용 가능한 아이디입니다.' :
             '6~12자의 영문과 숫자로 입력해 주세요.'}
          </div>
      </div>
    </div>
  )

  // 비밀번호 입력 단계 렌더링
  const renderPasswordStep = () => (
    <div className="signup-step">
      <div className="step-title">비밀번호 입력</div>
      
      {/* 비밀번호 입력 */}
      <div className={`input-container password-input-container ${
        passwordValidationStatus === 2 ? 'input-container-valid' : ''
      }`}>
        <div className="input-label">비밀번호</div>
        <input
          type="password"
          className="input-field"
          placeholder="비밀번호를 입력해 주세요."
          value={formData.password}
          onChange={handlePasswordChange}
          maxLength={12}
        />
      </div>
      
      <div className="input-hint">
        6~12자의 영문과 숫자, 특수문자로 입력해 주세요.
      </div>
      
      {/* 비밀번호 확인 입력 */}
      <div className={`input-container password-input-container ${
        passwordMatchStatus === 2 ? 'input-container-valid' : ''
      }`}>
        <div className="input-label">비밀번호 확인</div>
        <input
          type="password"
          className="input-field"
          placeholder="비밀번호 확인"
          value={formData.confirmPassword}
          onChange={handleConfirmPasswordChange}
          maxLength={12}
        />
      </div>
      
      <div className={`input-hint ${
        passwordMatchStatus === 2 ? 'success' : ''
      }`}>
        {passwordMatchStatus === 2 ? '확인되었습니다.' : '한번 더 입력해 주세요.'}
      </div>
    </div>
  )

  // 닉네임 입력 단계 렌더링
  const renderNicknameStep = () => (
    <div className="signup-step">
      <div className="step-title">뭐라고 불러 드릴까요?</div>
      
      {/* 닉네임 입력 */}
      <div className={`input-container password-input-container ${
        nicknameValidationStatus === 2 ? 'input-container-valid' : ''
      }`}>
        <div className="input-label">닉네임</div>
        <input
          type="text"
          className="input-field"
          placeholder="닉네임을 입력해 주세요."
          value={formData.nickname}
          onChange={handleNicknameChange}
          onInput={handleNicknameChange}
          onKeyDown={(e) => {
            if (formData.nickname.length >= 15 && e.key !== 'Backspace' && e.key !== 'Delete') {
              e.preventDefault()
              setNicknameValidationStatus(1) // 15자 초과 시 에러 상태
            }
          }}
        />
      </div>
      
      <div className={`input-hint ${
        nicknameValidationStatus === 1 ? 'error' : ''
      }`}>
        {nicknameValidationStatus === 1 ? '닉네임은 최대 15자입니다.' : '닉네임은 최대 15자입니다.'}
      </div>
    </div>
  )

  // 동네 위치 설정 화면 렌더링 (지역 선택 UI 포함)
  const renderLocationSettingStep = () => (
    <div className="signup-step">
      <div className="step-title">동네 설정</div>
      
      {/* 검색 바 */}
      <div className="location-search-bar">
        <input 
          type="text" 
          placeholder="지역명을 검색하세요."
          className="location-search-input"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <span className="location-search-icon">🔍</span>
      </div>

      {/* 지역 선택 영역 */}
      <div className="location-content">
        <div className="location-column">
          <div className="location-column-header">시·도</div>
          <div className="location-list">
            {(searchQuery ? filteredCities : Object.keys(cityData)).map(city => (
              <div 
                key={city} 
                className={`location-item ${formData.city === city ? 'selected' : ''}`}
                onClick={() => handleCityChange({ target: { value: city } } as React.ChangeEvent<HTMLSelectElement>)}
              >
                {city}
              </div>
            ))}
            {searchQuery && filteredCities.length === 0 && (
              <div className="location-no-results">검색 결과가 없습니다.</div>
            )}
          </div>
        </div>
        
        <div className="location-column">
          <div className="location-column-header">시·군·구</div>
          <div className="location-list">
            {formData.city && (searchQuery ? filteredDistricts : cityData[formData.city])?.map(district => (
              <div 
                key={district} 
                className={`location-item ${formData.district === district ? 'selected' : ''}`}
                onClick={() => handleDistrictChange({ target: { value: district } } as React.ChangeEvent<HTMLSelectElement>)}
              >
                {district}
              </div>
            ))}
            {searchQuery && formData.city && filteredDistricts.length === 0 && (
              <div className="location-no-results">검색 결과가 없습니다.</div>
            )}
          </div>
        </div>
      </div>

      {/* 하단 버튼 */}
      <div className="location-modal-buttons">
        <button className="location-cancel-btn" onClick={() => setCurrentStep(2)}>
          이전
        </button>
        <button 
          className="location-confirm-btn"
          disabled={!formData.city || !formData.district}
                          onClick={() => {
                  if (formData.city && formData.district) {
                    // 지역 확인 알림 표시
                    if (window.confirm(`${formData.district}로 지역을 설정하시겠습니까?`)) {
                      // 회원가입 완료 단계로 이동
                      setCurrentStep(4)
                    }
                  }
                }}
        >
          다음
        </button>
      </div>
    </div>
  )

  // 회원가입 완료 화면 렌더링
  const renderSignupCompleteStep = () => (
    <div className="signup-step">
      {/* 중앙 아이콘 */}
      <div className="signup-complete-icon">
        <div className="signup-complete-circle">
          <div className="signup-complete-emoji">🥳</div>
        </div>
      </div>
      
      {/* 제목 */}
      <div className="signup-complete-title">회원 가입 완료</div>
      
      {/* 안내 메시지 */}
      <div className="signup-complete-message">
        <p>가치:가게 회원 가입을</p>
        <p>완료했어요!</p>
      </div>
      
      {/* 시작하기 버튼 */}
      <button 
        className="signup-complete-button"
        onClick={() => {
          // TODO: 메인 페이지로 이동
          console.log('가치:가게 시작!')
          alert('가치:가게를 시작합니다!')
        }}
      >
        시작하기
      </button>
    </div>
  )

  // 지역 선택 단계 렌더링 (기존 함수는 유지)
  const renderLocationStep = () => (
    <div className="signup-step">
      <div className="step-title">어느 동네에 계신가요?</div>
      
      {/* 시 선택 */}
      <div className={`input-container ${
        cityValidationStatus === 1 ? 'input-container-valid' : ''
      }`}>
        <div className="input-label">시/도</div>
        <select
          className="input-field"
          value={formData.city}
          onChange={handleCityChange}
        >
          <option value="">시/도를 선택해주세요</option>
          {Object.keys(cityData).map(city => (
            <option key={city} value={city}>{city}</option>
          ))}
        </select>
      </div>
      
      {/* 구 선택 */}
      <div className={`input-container ${
        districtValidationStatus === 1 ? 'input-container-valid' : ''
      }`}>
        <div className="input-label">구/군</div>
        <select
          className="input-field"
          value={formData.district}
          onChange={handleDistrictChange}
          disabled={!formData.city} // 시가 선택되지 않으면 비활성화
        >
          <option value="">구/군을 선택해주세요</option>
                            {formData.city && cityData[formData.city]?.map(district => (
                    <option key={district} value={district}>{district}</option>
                  ))}
        </select>
      </div>
      
      <div className="input-hint">
        시/도와 구/군을 모두 선택해주세요.
      </div>
    </div>
  )

  // 현재 단계에 따른 제목과 내용 렌더링
  const renderCurrentStep = () => {
    switch (currentStep) {
      case 0:
        return renderIdStep()  // 아이디 입력 단계
      case 1:
        return renderPasswordStep()  // 비밀번호 입력 단계
      case 2:
        return renderNicknameStep()  // 닉네임 입력 단계
      case 3:
        return renderLocationStep()  // 동네 위치 설정 단계
      case 4:
        return renderSignupCompleteStep()   // 회원가입 완료 단계
      default:
        return null
    }
  }


  // 메인 렌더링 (Main Render)
  return (
    <div className="signup-container">
      {/* 헤더 */}
      <div className="signup-header">
        <button className="back-button" onClick={handlePrevStep}>
          <img src={BackArrowIcon} alt="뒤로가기" className="back-icon" />
        </button>
        <h1 className="signup-title">회원가입</h1>
      </div>

      {/* 메인 콘텐츠 */}
      <div className="signup-content">
        {/* 현재 단계에 따른 UI 렌더링 */}
        {renderCurrentStep()}
        
        {/* 하단 버튼 */}
        <div className={`signup-bottom step-${currentStep}`}>
          <button 
            className="next-button"
            disabled={
              (currentStep === 0 && (idValidationStatus !== 2 || idDuplicateStatus !== 2)) ||
              (currentStep === 1 && (passwordValidationStatus !== 2 || passwordMatchStatus !== 2)) ||
              (currentStep === 2 && nicknameValidationStatus !== 2) ||
              (currentStep === 3 && (cityValidationStatus !== 1 || districtValidationStatus !== 1))
            }
            onClick={currentStep === 3 ? handleSignupComplete : handleNextStep}
            style={{ display: currentStep === 4 ? 'none' : 'block' }}
          >
            {/* 마지막 단계에서는 '가입완료', 그 외에는 '다음으로' */}
            {currentStep === 3 ? '회원가입하기' : '다음으로'}
          </button>
        </div>
      </div>
      
      {/* 약관 동의 모달 */}
      {showTermsModal && (
        <div className="terms-modal-overlay" onClick={closeTermsModal}>
          <div className="terms-modal" onClick={(e) => e.stopPropagation()}>
            {/* 드래그 핸들 */}
            <div className="modal-drag-handle"></div>
            
            {/* 모달 제목 */}
            <div className="modal-title">서비스 약관 동의</div>
            
            {/* 약관 목록 */}
            <div className="agreements-list">
              {/* 서비스 이용약관 */}
              <div className="agreement-item">
                <div className="agreement-checkbox" onClick={() => handleAgreementChange('serviceTerms')}>
                  <img 
                    src={agreements.serviceTerms ? CheckedIcon : UncheckedIcon} 
                    alt="체크" 
                    className="check-icon"
                  />
                </div>
                <div className="agreement-text" onClick={() => handleAgreementChange('serviceTerms')}>
                  <span className="agreement-title">서비스 이용약관 (필수)</span>
                </div>
                <span className="agreement-view">보기</span>
              </div>
              
              {/* 개인정보 처리방침 */}
              <div className="agreement-item">
                <div className="agreement-checkbox" onClick={() => handleAgreementChange('privacyPolicy')}>
                  <img 
                    src={agreements.privacyPolicy ? CheckedIcon : UncheckedIcon} 
                    alt="체크" 
                    className="check-icon"
                  />
                </div>
                <div className="agreement-text" onClick={() => handleAgreementChange('privacyPolicy')}>
                  <span className="agreement-title">개인정보 처리방침 (필수)</span>
                </div>
                <span className="agreement-view">보기</span>
              </div>
              
              {/* 위치기반 서비스 이용약관 */}
              <div className="agreement-item">
                <div className="agreement-checkbox" onClick={() => handleAgreementChange('locationService')}>
                  <img 
                    src={agreements.locationService ? CheckedIcon : UncheckedIcon} 
                    alt="체크" 
                    className="check-icon"
                  />
                </div>
                <div className="agreement-text" onClick={() => handleAgreementChange('locationService')}>
                  <span className="agreement-title">위치기반 서비스 이용약관 (필수)</span>
                </div>
                <span className="agreement-view">보기</span>
              </div>
              
              {/* 마케팅 정보 수신 동의 */}
              <div className="agreement-item">
                <div className="agreement-checkbox" onClick={() => handleAgreementChange('marketing')}>
                  <img 
                    src={agreements.marketing ? CheckedIcon : UncheckedIcon} 
                    alt="체크" 
                    className="check-icon"
                  />
                </div>
                <div className="agreement-text" onClick={() => handleAgreementChange('marketing')}>
                  <span className="agreement-title">마케팅 정보 수신 동의 (선택)</span>
                </div>
                <span className="agreement-view">보기</span>
              </div>
            </div>
            
            {/* 회원가입 버튼 */}
            <button 
              className={`signup-button ${isRequiredAgreementsChecked() ? 'signup-button-active' : ''}`}
              disabled={!isRequiredAgreementsChecked()}
              onClick={handleTermsAgreement}
            >
              회원가입하기
            </button>
          </div>
        </div>
      )}

    </div>
  )
}

export default SignupForm
