import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import './NicknameChangePage.css'

const NicknameChangePage: React.FC = () => {
  const navigate = useNavigate()
  const [nickname, setNickname] = useState('')
  const [isValid, setIsValid] = useState(false)

  // 닉네임 유효성 검사
  useEffect(() => {
    setIsValid(nickname.trim().length > 0 && nickname.length <= 15)
  }, [nickname])

  const handleBackClick = () => {
    navigate('/setting')
  }

  const handleNicknameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    if (value.length <= 15) {
      setNickname(value)
    }
  }

  const handleSubmit = () => {
    if (isValid) {
      // TODO: API 호출로 닉네임 변경
      console.log('닉네임 변경:', nickname)
      // 변경 완료 후 설정 페이지로 이동
      navigate('/setting')
    }
  }

  return (
    <div className="nickname-change-page">
      {/* 상단 헤더 */}
      <header className="nickname-change-header">
        <button className="nickname-change-back-button" onClick={handleBackClick}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M15 18L9 12L15 6" stroke="#4B4B4B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        <h1 className="nickname-change-title">닉네임 변경</h1>
        <div className="nickname-change-header-spacer"></div>
      </header>

      {/* 메인 콘텐츠 */}
      <div className="nickname-change-content">
        <div className="nickname-change-description">
          <h2 className="nickname-change-heading">
            가치가게가 새롭게 부를 이름을 알려주세요.
          </h2>
        </div>

        <div className="nickname-change-form">
          <div className="nickname-input-group">
            <label htmlFor="nickname" className="nickname-label">
              닉네임
            </label>
            <input
              id="nickname"
              type="text"
              className="nickname-input"
              placeholder="닉네임을 입력해 주세요."
              value={nickname}
              onChange={handleNicknameChange}
              maxLength={15}
            />
            <p className="nickname-constraint">
              닉네임은 최대 15자입니다.
            </p>
          </div>
        </div>
      </div>

      {/* 하단 버튼 */}
      <div className="nickname-change-footer">
        <button
          className={`nickname-change-button ${isValid ? 'active' : 'disabled'}`}
          onClick={handleSubmit}
          disabled={!isValid}
        >
          변경하기
        </button>
      </div>
    </div>
  )
}

export default NicknameChangePage
