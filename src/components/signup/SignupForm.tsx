import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './SignupForm.css'
import BackArrowIcon from '../../assets/back-arrow.png'

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
    nickname: '',
    city: '',      // 시
    district: ''   // 구
  })

  // 아이디 관련 상태 관리
  const [isIdChecked, setIsIdChecked] = useState(false)        // 중복확인 완료 여부
  const [idValidationStatus, setIdValidationStatus] = useState(0)  // 유효성 상태 (0: 초기, 1: 유효하지 않음, 2: 유효함)
  const [idDuplicateStatus, setIdDuplicateStatus] = useState(0)    // 중복 상태 (0: 초기, 1: 중복, 2: 사용가능)

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
    // 현재는 임시로 랜덤하게 성공/실패 처리 (50% 확률)
    const isDuplicate = Math.random() > 0.5
    
    if (isDuplicate) {
      // 중복되는 아이디인 경우
      setIdDuplicateStatus(1)  // 중복 상태로 설정
      setIsIdChecked(false)    // 중복확인 미완료로 설정
    } else {
      // 사용 가능한 아이디인 경우
      setIdDuplicateStatus(2)  // 사용가능 상태로 설정
      setIsIdChecked(true)     // 중복확인 완료로 설정
    }
  }

  // 다음 단계로 이동 핸들러
  const handleNextStep = () => {
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

  // 현재 단계에 따른 제목과 내용 렌더링
  const renderCurrentStep = () => {
    switch (currentStep) {
      case 0:
        return renderIdStep()  // 아이디 입력 단계
      case 1:
        return <div className="signup-step">비밀번호 입력</div>  // TODO: 구현 예정
      case 2:
        return <div className="signup-step">뭐라고 불러 드릴까요?</div>  // TODO: 구현 예정
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
        <div className="signup-bottom">
          <button 
            className="next-button"
            disabled={currentStep === 0 && (idValidationStatus !== 2 || idDuplicateStatus !== 2)}
            onClick={currentStep === 3 ? handleSignupComplete : handleNextStep}
          >
            {/* 마지막 단계에서는 '가입완료', 그 외에는 '다음으로' */}
            {currentStep === 3 ? '회원가입하기' : '다음으로'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default SignupForm
