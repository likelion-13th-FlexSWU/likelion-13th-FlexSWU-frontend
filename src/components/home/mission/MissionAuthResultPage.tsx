import React, { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { createWorker } from 'tesseract.js'
import './MissionAuthResultPage.css'
import addressIcon from '../../../assets/icons/address.svg'
import timeIcon from '../../../assets/icons/time.svg'

// 영수증 파싱 결과 타입
interface ReceiptData {
  storeName: string | null
  address: string | null
  transactionDate: string | null
  phoneNumber: string | null
  totalAmount: string | null
}

const MissionAuthResultPage: React.FC = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const [isProcessing, setIsProcessing] = useState(true)
  const [receiptData, setReceiptData] = useState<ReceiptData | null>(null)
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [rawText, setRawText] = useState<string>('')
  const [progress, setProgress] = useState<number>(0)
  
  // 편집 상태 관리
  const [editingField, setEditingField] = useState<string | null>(null)
  const [editValues, setEditValues] = useState<ReceiptData | null>(null)
  const [isEditMode, setIsEditMode] = useState(false)
  const [hasModifications, setHasModifications] = useState(false)

  useEffect(() => {
    // URL에서 이미지 데이터 받기
    const searchParams = new URLSearchParams(location.search)
    const imageData = searchParams.get('image')
    
    if (imageData) {
      setSelectedImage(imageData)
      processImage(imageData)
    }
  }, [location])

  const processImage = async (imageUrl: string) => {
    try {
      setIsProcessing(true)
      setProgress(0)
      
      const worker = await createWorker('kor+eng')
      
      // 이미지를 Canvas로 변환
      const img = new Image()
      img.crossOrigin = 'anonymous'
      
      img.onload = async () => {
        const canvas = document.createElement('canvas')
        const ctx = canvas.getContext('2d')
        
        if (ctx) {
          canvas.width = img.width
          canvas.height = img.height
          ctx.drawImage(img, 0, 0)
          
          // OCR 실행
          const { data: { text } } = await worker.recognize(canvas)
          
          setRawText(text)
          
          // 텍스트 파싱
          const parsedData = parseReceiptText(text)
          setReceiptData(parsedData)
        }
        
        await worker.terminate()
        setIsProcessing(false)
      }
      
      img.src = imageUrl
      
    } catch (error) {
      console.error('OCR 처리 중 오류:', error)
      setIsProcessing(false)
    }
  }

  // OCR 텍스트 파싱 함수
  const parseReceiptText = (ocrText: string): ReceiptData => {
    const cleanText = ocrText.replace(/\s+/g, ' ').replace(/\n+/g, '\n').trim()
    let lines = cleanText.split('\n').map(line => line.trim())
    
    // 첫 번째 라인이 너무 길면 적절히 분할
    if (lines.length === 1 && lines[0].length > 100) {
      const longLine = lines[0]
      lines = [
        longLine.substring(0, longLine.indexOf('사업자 번호:')).trim(),
        longLine.substring(longLine.indexOf('사업자 번호:')).trim()
      ]
    }
    
    let storeName: string | null = null
    let address: string | null = null
    let transactionDate: string | null = null
    let phoneNumber: string | null = null
    let totalAmount: string | null = null

    // 가맹점명 추출
    for (const line of lines) {
      // 첫 번째 라인에서 "= 블라 블라" 같은 패턴 찾기
      if (line.startsWith('=') || line.includes('블라')) {
        const storeMatch = line.match(/[=]\s*([가-힣]{2,10})(?:\s+[가-힣]{2,10})?/)
        if (storeMatch) {
          storeName = storeMatch[1].trim()
          break
        }
      }
      
      // "가맹점:" 패턴
      const storeMatch = line.match(/가맹점\s*[:：]\s*([가-힣\d\s]+(?:의\s*)?[가-힣]+)/)
      if (storeMatch) {
        storeName = storeMatch[1].trim()
        break
      }
      
      // 상단에 단독으로 있는 가게명
      const soloStoreMatch = line.match(/^([가-힣]{2,10})$/)
      if (soloStoreMatch && !storeName) {
        storeName = soloStoreMatch[1].trim()
        break
      }
      
      // 더 유연한 패턴: 2-10자 한글만 있는 라인
      const flexibleMatch = line.match(/^([가-힣]{2,10})\s*$/)
      if (flexibleMatch && !storeName) {
        storeName = flexibleMatch[1].trim()
        break
      }
    }

    // 주소 추출
    for (const line of lines) {
      const addressMatch = line.match(/(?:[A-Z]+\s*)?([가-힣\d\s]+(?:동|로|길|구|시|도)+[가-힣\d\s,.-]*)/)
      if (addressMatch) {
        let cleanAddress = addressMatch[1].trim()
        
        // "상품명" 이전까지만 주소로 사용
        if (cleanAddress.includes('상품명')) {
          cleanAddress = cleanAddress.substring(0, cleanAddress.indexOf('상품명')).trim()
        }
        
        // "단가", "수량" 같은 불필요한 텍스트 제거
        if (cleanAddress.includes('단가') || cleanAddress.includes('수량')) {
          continue
        }
        
        // 특수문자 정리
        cleanAddress = cleanAddress.replace(/[^\w\s가-힣\d,.-]/g, '')
        cleanAddress = cleanAddress.replace(/\s+/g, ' ')
        
        if (cleanAddress.length > 0) {
          let finalAddress = cleanAddress
          
          // "서울" 자동 추가 (노원구가 있으면 서울)
          if (finalAddress.includes('노원구') && !finalAddress.includes('서울')) {
            finalAddress = '서울 ' + finalAddress
          }
          
          // OCR 오류 수정: "645,55" -> "6 4층, 5층"
          if (finalAddress.includes('645,55')) {
            finalAddress = finalAddress.replace('645,55', '6 4층, 5층')
          }
          
          // 다른 일반적인 OCR 오류들도 수정
          if (finalAddress.includes('41길')) {
            finalAddress = finalAddress.replace('41길', '41길')
          }
          
          address = finalAddress
          break
        }
      }
    }

    // 전화번호 추출
    for (const line of lines) {
      const phonePatterns = [
        /전화\s*[:：]?\s*(\d{2,4}[-\s]?\d{3,4}[-\s]?\d{4})/,
        /TEL\s*[:：]?\s*(\d{2,4}[-\s]?\d{3,4}[-\s]?\d{4})/,
        /연락처\s*[:：]?\s*(\d{2,4}[-\s]?\d{3,4}[-\s]?\d{4})/,
        /[^\d]*(\d{2,4}[-\s]?\d{3,4}[-\s]?\d{4})/,
        /(\d{2,4}[-\s]?\d{3,4}[-\s]?\d{4})/
      ]
      
      for (const pattern of phonePatterns) {
        const phoneMatch = line.match(pattern)
        if (phoneMatch) {
          phoneNumber = phoneMatch[1].trim()
          break
        }
      }
      if (phoneNumber) break
    }

    // 거래일시 추출
    for (const line of lines) {
      const datePatterns = [
        /거래일시\s*[:：]\s*(\d{4}[/-]\d{1,2}[/-]\d{1,2}\s+\d{1,2}[:.]\d{2})/,
        /(\d{4}[/-]\d{1,2}[/-]\d{1,2}\s+\d{1,2}[:.]\d{2}[:.]\d{2})/,
        /(\d{4}[/-]\d{1,2}[/-]\d{1,2}\s+\d{1,2}[:.]\d{2})/,
        /(\d{4}[/-]\d{1,2}[/-]\d{1,2})/,
        /(\d{4}\s*[-]\s*\d{1,2}\s*[-]\s*\d{1,2}\s+\d{1,2}[:.]\d{2}[:.]\d{2})/
      ]
      
      for (const pattern of datePatterns) {
        const dateMatch = line.match(pattern)
        if (dateMatch) {
          let dateStr = dateMatch[1].trim()
          
          // 시간 형식 정리 (12.46 -> 12:46)
          dateStr = dateStr.replace(/(\d{1,2})\.(\d{2})/g, '$1:$2')
          // 공백 제거
          dateStr = dateStr.replace(/\s+/g, '')
          
          transactionDate = dateStr
          break
        }
      }
      if (transactionDate) break
    }

    // 합계 금액 추출
    for (const line of lines) {
      const amountPatterns = [
        /합\s*계\s*[:：]?\s*([0-9,.\s]+원?)/,
        /합\s*Al\s*[:：]?\s*([0-9,.\s]+원?)/,
        /총\s*액\s*[:：]?\s*([0-9,.\s]+원?)/,
        /\*?\s*결제\s*금액\s*[:：]?\s*([0-9,.\s]+원?)/,
        /결제\s*금액\s*[:：]?\s*([0-9,.\s]+원?)/,
        /총\s*구매액\s*[:：]?\s*([0-9,.\s]+원?)/,
        /총구\s*매액\s*[:：]?\s*([0-9,.\s]+원?)/,
        /총\s*계\s*[:：]?\s*([0-9,.\s]+원?)/,
        /합\s*계\s*액\s*[:：]?\s*([0-9,.\s]+원?)/,
        /받\s*을\s*금액\s*[:：]?\s*([0-9,.\s]+원?)/,
        /주문\s*합\s*계\s*[:：]?\s*([0-9,.\s]+원?)/
      ]
      
      for (const pattern of amountPatterns) {
        const amountMatch = line.match(pattern)
        if (amountMatch) {
          totalAmount = amountMatch[1].replace(/[^0-9,]/g, '').trim()
          if (totalAmount) {
            totalAmount += '원'
            break
          }
        }
      }
      if (totalAmount) break
    }

    const result = { storeName, address, transactionDate, phoneNumber, totalAmount }
    return result
  }

  const handleConfirm = () => {
    if (receiptData) {
      // TODO: 인증 처리 로직 구현
      
      // 백엔드 전송용 데이터 형식
      const backendData = {
        mission_id: 3, // 실제 미션 ID로 변경 필요
        address: receiptData.address,
        name: receiptData.storeName,
        visited_at: receiptData.transactionDate,
        phone_num: receiptData.phoneNumber,
        total_price: parseInt(receiptData.totalAmount?.replace(/[^0-9]/g, '') || '0')
      }
      
      // 미션 인증 완료 페이지로 이동
      navigate('/mission-complete')
    } else {
    }
  }

  const handleModify = () => {
    // 수정 모드로 전환
    setIsEditMode(true)
    setEditValues(receiptData)
    setHasModifications(false)
  }

  const handleBackClick = () => {
    navigate(-1)
  }

  // 날짜와 시간을 분리하는 함수
  const splitDateTime = (dateTimeStr: string | null) => {
    if (!dateTimeStr) return { date: '', time: '' }
    
    // 다양한 날짜/시간 형식 처리
    const patterns = [
      // "2025-08-25 12:31:41" 형식
      /^(\d{4}-\d{1,2}-\d{1,2})\s+(\d{1,2}:\d{1,2}:\d{1,2})$/,
      // "2025-08-25 12:31" 형식
      /^(\d{4}-\d{1,2}-\d{1,2})\s+(\d{1,2}:\d{1,2})$/,
      // "2025-08-25" 형식 (시간 없음)
      /^(\d{4}-\d{1,2}-\d{1,2})$/,
      // "12:31:41" 형식 (날짜 없음)
      /^(\d{1,2}:\d{1,2}:\d{1,2})$/
    ]
    
    for (const pattern of patterns) {
      const match = dateTimeStr.match(pattern)
      if (match) {
        const date = match[1] || ''
        const time = match[2] || ''
        return { date, time }
      }
    }
    
    // 패턴에 맞지 않으면 원본 반환
    return { date: dateTimeStr, time: '' }
  }

  // 날짜/시간 피커 컴포넌트
  const DateTimePicker: React.FC<{
    field: string
    label: string
    value: string | null
    icon?: string
    onSave: (date: string, time: string) => void
  }> = ({ field, label, value, icon, onSave }) => {
    const [isEditing, setIsEditing] = useState(false)
    const { date, time } = splitDateTime(value)
    const [editDate, setEditDate] = useState(date)
    const [editTime, setEditTime] = useState(time)

    // value가 변경될 때마다 editDate, editTime 업데이트
    useEffect(() => {
      const { date: newDate, time: newTime } = splitDateTime(value)
      setEditDate(newDate)
      setEditTime(newTime)
    }, [value])

    const handleEdit = () => {
      if (!isEditMode) return
      setIsEditing(true)
      setEditingField(field)
    }

    const handleDateClick = () => {
      if (!isEditMode) return
      setIsEditing(true)
      setEditingField(field)
    }

    const handleTimeClick = () => {
      if (!isEditMode) return
      setIsEditing(true)
      setEditingField(field)
    }

    const handleSave = () => {
      const newDateTime = `${editDate} ${editTime}`.trim()
      onSave(editDate, editTime)
      setIsEditing(false)
      setEditingField(null)
      setHasModifications(true)
    }

    const handleCancel = () => {
      setEditDate(date)
      setEditTime(time)
      setIsEditing(false)
      setEditingField(null)
    }

    if (isEditing) {
      return (
        <div className="mission-auth-result-info-item editing">
          {icon && <img src={icon} alt={label} className="mission-auth-result-info-icon" />}
          <span className="mission-auth-result-info-label">{label}</span>
          <div className="mission-auth-result-datetime-wrapper">
            <input
              type="date"
              value={editDate}
              onChange={(e) => {
                setEditDate(e.target.value)
                // 날짜 변경 시 자동 저장
                onSave(e.target.value, editTime)
                setHasModifications(true)
              }}
              className="mission-auth-result-date-input"
            />
            <input
              type="time"
              value={editTime}
              onChange={(e) => {
                setEditTime(e.target.value)
                // 시간 변경 시 자동 저장
                onSave(editDate, e.target.value)
                setHasModifications(true)
              }}
              className="mission-auth-result-time-input"
            />
          </div>
        </div>
      )
    }

    return (
      <div className={`mission-auth-result-info-item ${isEditMode ? 'clickable' : ''}`}>
        {icon && <img src={icon} alt={label} className="mission-auth-result-info-icon" />}
        <span className="mission-auth-result-info-label">{label}</span>
        <div className="mission-auth-result-datetime-display">
          <span 
            className={`mission-auth-result-date ${isEditMode ? 'clickable' : ''}`} 
            onClick={handleDateClick}
          >
            {date}
          </span>
          <span className="mission-auth-result-time-separator"> </span>
          <span 
            className={`mission-auth-result-time ${isEditMode ? 'clickable' : ''}`} 
            onClick={handleTimeClick}
          >
            {time}
          </span>
        </div>
      </div>
    )
  }

  // 편집 가능한 필드 컴포넌트
  const EditableField: React.FC<{
    field: string
    label: string
    value: string | null
    icon?: string
    onSave: (value: string) => void
  }> = ({ field, label, value, icon, onSave }) => {
    const [isEditing, setIsEditing] = useState(false)
    const [editValue, setEditValue] = useState(value || '')

    const handleEdit = () => {
      if (!isEditMode) return
      setIsEditing(true)
      setEditingField(field)
    }

    const handleSave = () => {
      onSave(editValue)
      setIsEditing(false)
      setEditingField(null)
      setHasModifications(true)
    }

    const handleCancel = () => {
      setEditValue(value || '')
      setIsEditing(false)
      setEditingField(null)
    }

    const handleKeyPress = (e: React.KeyboardEvent) => {
      if (e.key === 'Enter') {
        handleSave()
      } else if (e.key === 'Escape') {
        handleCancel()
      }
    }

    const handleBlur = () => {
      handleSave()
    }

    if (isEditing) {
      return (
        <div className="mission-auth-result-info-item editing">
          {icon && <img src={icon} alt={label} className="mission-auth-result-info-icon" />}
          <span className="mission-auth-result-info-label">{label}</span>
          <input
            type="text"
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            onKeyDown={handleKeyPress}
            onBlur={handleBlur}
            className="mission-auth-result-edit-input"
            autoFocus
          />
        </div>
      )
    }

    return (
      <div className={`mission-auth-result-info-item ${isEditMode ? 'clickable' : ''}`} onClick={handleEdit}>
        {icon && <img src={icon} alt={label} className="mission-auth-result-info-icon" />}
        <span className="mission-auth-result-info-label">{label}</span>
        <span className="mission-auth-result-info-value">{value || `${label} 없음`}</span>
      </div>
    )
  }

  if (isProcessing) {
    return (
      <div className="mission-auth-result-container">
        <header className="mission-auth-result-header">
          <button className="mission-auth-result-back-button" onClick={handleBackClick}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          <h1 className="mission-auth-result-title">미션 인증</h1>
          <div className="mission-auth-result-spacer"></div>
        </header>
        
        <main className="mission-auth-result-main">
          <div className="mission-auth-result-loading">
            <div className="mission-auth-result-loading-spinner"></div>
            <p className="mission-auth-result-loading-text">영수증을 분석하고 있습니다...</p>
            {progress > 0 && (
              <div className="mission-auth-result-progress">
                <div className="mission-auth-result-progress-bar">
                  <div 
                    className="mission-auth-result-progress-fill"
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
                <p className="mission-auth-result-progress-text">{progress}%</p>
              </div>
            )}
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="mission-auth-result-container">
      {/* 상단바 */}
      <header className="mission-auth-result-header">
        <button className="mission-auth-result-back-button" onClick={handleBackClick}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        <h1 className="mission-auth-result-title">미션 인증</h1>
        <div className="mission-auth-result-spacer"></div>
      </header>

      {/* 메인 콘텐츠 */}
      <main className="mission-auth-result-main">
        {/* 수정 모드 안내 */}
        {isEditMode && (
          <div className="mission-auth-result-edit-notice">
            <p>수정을 원하는 부분을 선택해 수정해 주세요.</p>
          </div>
        )}

        {/* 가게 정보 */}
        <div className="mission-auth-result-business-info">
          <div 
            className={`mission-auth-result-store-name-display ${isEditMode ? 'clickable' : ''}`}
            onClick={() => {
              if (isEditMode) {
                setEditingField('storeName')
                setEditValues(receiptData)
              }
            }}
          >
            {editingField === 'storeName' ? (
              <input
                type="text"
                value={editValues?.storeName || ''}
                onChange={(e) => setEditValues(prev => prev ? { ...prev, storeName: e.target.value } : null)}
                className="mission-auth-result-store-name-input"
                autoFocus
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    setReceiptData(prev => prev ? { ...prev, storeName: editValues?.storeName || '' } : null)
                    setEditingField(null)
                    setHasModifications(true)
                  } else if (e.key === 'Escape') {
                    setEditingField(null)
                    setEditValues(receiptData)
                  }
                }}
                onBlur={() => {
                  setReceiptData(prev => prev ? { ...prev, storeName: editValues?.storeName || '' } : null)
                  setEditingField(null)
                  setHasModifications(true)
                }}
              />
            ) : (
              receiptData?.storeName || '가게명 없음'
            )}
          </div>
          
          <EditableField
            field="address"
            label="주소"
            value={receiptData?.address || null}
            icon={addressIcon}
            onSave={(value) => {
              setReceiptData(prev => prev ? { ...prev, address: value } : null)
            }}
          />
          
          <DateTimePicker
            field="transactionDate"
            label="방문일시"
            value={receiptData?.transactionDate || null}
            icon={timeIcon}
            onSave={(date, time) => {
              setReceiptData(prev => prev ? { ...prev, transactionDate: `${date} ${time}` } : null)
            }}
          />
        </div>

        {/* 지도 영역 */}
        <div className="mission-auth-result-map">
          <div className="mission-auth-result-map-placeholder">
            <div className="mission-auth-result-map-pin">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M21 10C21 17 12 23 12 23S3 17 3 10C3 7.61305 3.94821 5.32387 5.63604 3.63604C7.32387 1.94821 9.61305 1 12 1C14.3869 1 16.6761 1.94821 18.364 3.63604C20.0518 5.32387 21 7.61305 21 10Z" fill="#007BEB"/>
                <path d="M12 13C13.6569 13 15 11.6569 15 10C15 8.34315 13.6569 7 12 7C10.3431 7 9 8.34315 9 10C9 11.6569 10.3431 13 12 13Z" fill="white"/>
              </svg>
            </div>
            <p className="mission-auth-result-map-text">지도 영역</p>
            <p className="mission-auth-result-map-location">{receiptData?.storeName || '가게명 없음'}</p>
          </div>
        </div>

        {/* 확인 질문 */}
        {!isEditMode && (
          <div className="mission-auth-result-question">
            <p className="mission-auth-result-question-text">영수증 인식 정보가 올바른가요?</p>
          </div>
        )}
      </main>

      {/* 하단 버튼들 */}
      <div className="mission-auth-result-bottom">
        {!isEditMode ? (
          <>
            <button className="mission-auth-result-confirm-button" onClick={handleConfirm}>
              네, 이 장소가 맞아요
            </button>
            <button className="mission-auth-result-modify-button" onClick={handleModify}>
              아니요, 정보를 수정할게요
            </button>
          </>
        ) : (
          <button 
            className={`mission-auth-result-auth-button ${!hasModifications ? 'disabled' : ''}`} 
            onClick={handleConfirm}
            disabled={!hasModifications}
          >
            미션 인증하기
          </button>
        )}
      </div>
    </div>
  )
}

export default MissionAuthResultPage