import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './LoginForm.css'
import logo from '../../assets/logo.png'
import { authAPI } from '../../services/api'
import { useAuth } from '../../contexts/AuthContext'

/**
 * 로그인 폼 컴포넌트
 */
const LoginForm = () => {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [formData, setFormData] = useState({
    id: '',
    password: ''
  })
  const [errors, setErrors] = useState({
    id: '',
    password: ''
  })
  const [isLoginError, setIsLoginError] = useState(false)
  const [loginErrorMessage, setLoginErrorMessage] = useState('')

  // 입력값 변경 핸들러
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    
    // 에러 메시지 초기화
    if (errors[name as keyof typeof errors]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
    
    // 로그인 에러 상태 초기화
    if (isLoginError) {
      setIsLoginError(false)
      setLoginErrorMessage('')
    }
  }

  // 로그인 제출 핸들러
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // 유효성 검사
    const newErrors = { id: '', password: '' }
    
    if (!formData.id.trim()) {
      newErrors.id = '아이디를 입력해주세요.'
    }
    
    if (!formData.password.trim()) {
      newErrors.password = '비밀번호를 입력해주세요.'
    }
    
    if (newErrors.id || newErrors.password) {
      setErrors(newErrors)
      return
    }
    
    try {
      // 로그인 API 호출
      const response = await authAPI.login({
        identify: formData.id,
        password: formData.password
      })
      
      // AuthContext를 통해 로그인 처리
      login(response.access_token, response.refresh_token, response.user_id)
      
      // 로그인 성공 시 홈 페이지로 이동
      navigate('/home')
    } catch (error: any) {
      setIsLoginError(true)
      setLoginErrorMessage(error.message || '아이디 또는 비밀번호 오류입니다.')
    }
  }

  // 회원가입 페이지로 이동
  const handleSignup = () => {
    navigate('/signup')
  }

  // 아이디 & 비밀번호 찾기 (기능 미구현)
  const handleFindId = () => {
    // TODO: 아이디 찾기 기능 구현
  }
  const handleFindPassword = () => {
    // TODO: 비밀번호 찾기 기능 구현
  }

  return (
    <div className="login-container">
      <div className="login-content">
        {/* 헤더 영역 */}
        <div className="header">
          <div className="signup-button" onClick={handleSignup}>회원가입</div>
        </div>

        {/* 로고 및 타이틀 영역 */}
        <div className="logo-section">
          <img 
            src={logo} 
            alt="가치:가게 로고" 
            className="logo-image"
          />
        </div>

        {/* 로그인 폼 */}
        <form className="login-form" onSubmit={handleSubmit}>
          {/* 아이디 입력 */}
          <div className="login-input-group">
            <div className={`login-input-container ${formData.id.trim() ? 'login-input-valid' : ''} ${isLoginError ? 'login-input-error' : ''}`}>
              <label className="login-input-label">아이디</label>
              <input
                type="text"
                name="id"
                value={formData.id}
                onChange={handleInputChange}
                placeholder="아이디를 입력해 주세요."
                className="login-input-field"
              />
            </div>
            {errors.id && <span className="login-error-message">{errors.id}</span>}
          </div>

          {/* 비밀번호 입력 */}
          <div className="login-input-group">
            <div className={`login-input-container ${formData.password.trim() ? 'login-input-valid' : ''} ${isLoginError ? 'login-input-error' : ''}`}>
              <label className="login-input-label">비밀번호</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="비밀번호"
                className="login-input-field"
              />
            </div>
            {errors.password && <span className="login-error-message">{errors.password}</span>}
            {/* 로그인 에러 메시지 */}
            {isLoginError && (
              <div className="login-error-message">
                {loginErrorMessage}
              </div>
            )}
          </div>

          {/* 도움말 링크 */}
          <div className="login-help-links">
            <button 
              type="button" 
              className="login-help-link"
              onClick={handleFindId}
            >
              아이디 찾기
            </button>
            <span className="login-separator">|</span>
            <button 
              type="button" 
              className="login-help-link"
              onClick={handleFindPassword}
            >
              비밀번호 찾기
            </button>
          </div>

          {/* 로그인 버튼 */}
          <button 
            type="submit" 
            className={`submit-button ${!formData.id.trim() || !formData.password.trim() ? 'submit-button-disabled' : ''}`}
            onClick={handleSubmit}
            disabled={!formData.id.trim() || !formData.password.trim()}
          >
            로그인
          </button>
        </form>
      </div>
    </div>
  )
}

export default LoginForm
