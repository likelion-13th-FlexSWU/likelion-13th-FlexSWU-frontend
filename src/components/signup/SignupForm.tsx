import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './SignupForm.css'
import BackArrowIcon from '../../assets/back-arrow.png'
import UncheckedIcon from '../../assets/unchecked.png'
import CheckedIcon from '../../assets/checked.png'

/**
 * 회원가입 폼 컴포넌트 (단계별 입력)
 */
const SignupForm = () => {
  // 현재 단계 (0: 아이디, 1: 비밀번호, 2: 닉네임, 3: 지역)
  const [currentStep, setCurrentStep] = useState(0)
  
  // 페이지 이동을 위해 사용하는 함수
  const navigate = useNavigate()
  
  // 사용자가 입력한 폼 데이터를 저장하는 상태
  const [formData, setFormData] = useState({
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
    }
    
    // 모든 조건이 만족되면 다음 단계로 이동
    if (currentStep < 3) {
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
        return <div className="signup-step">동네 설정</div>  // TODO: 구현 예정
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
              (currentStep === 2 && nicknameValidationStatus !== 2)
            }
            onClick={currentStep === 3 ? handleSignupComplete : handleNextStep}
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
              onClick={handleSignupComplete}
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
