import React from 'react'
import { useNavigate } from 'react-router-dom'
import './RecommendationResult.css'
import bgbg from '../../../assets/backgrounds/bgbg.svg'
import callIcon from '../../../assets/icons/call.svg'
import houseIcon from '../../../assets/icons/house.svg'
import arrowIcon from '../../../assets/icons/icon-arrow.svg'
import store01 from '../../../assets/stores/store-01.png'
import store02 from '../../../assets/stores/store-02.png'
import store03 from '../../../assets/stores/store-03.png'

interface StoreInfo {
  id: string
  name: string
  address: string
  phone: string
  image: string
}

// 임시 추천 결과 데이터 (나중에 API로 교체)
const RECOMMENDED_STORES: StoreInfo[] = [
  {
    id: '1',
    name: '솔직하다',
    address: '서울 노원구 동일로 174길, 37-8',
    phone: '02-6956-5607',
    image: store01
  },
  {
    id: '2',
    name: '코타브레드',
    address: '서울 노원구 동일로 172길, 15-3',
    phone: '02-6956-5607',
    image: store02
  },
  {
    id: '3',
    name: '753베이글리스트로',
    address: '서울 노원구 동일로 170길, 22-1',
    phone: '010-3036-7736',
    image: store03
  }
]

const RecommendationResult: React.FC = () => {
  const navigate = useNavigate()

  const handleRetry = () => {
    // TODO: 추천 API를 한 번 더 실행
    // 현재는 임시로 추천 첫 화면으로 이동
    navigate('/home/recommendation')
  }

  const handleConfirm = () => {
    // 추천받기 - 홈으로 이동
    navigate('/home')
  }

  const handleStoreClick = (storeId: string) => {
    // 나중에 카카오맵 주소로 이동
    console.log('가게 클릭:', storeId)
  }

  return (
    <div className="recommendation-result-container">
      {/* 배경 이미지 */}
      <div className="result-background">
        <img src={bgbg} alt="배경" className="result-bg-image" />
      </div>

      {/* 메인 콘텐츠 */}
      <div className="result-content">
        {/* 타이틀 섹션 */}
        <div className="result-title-section">
          <h1 className="result-title">
            취향과 무드에 맞는<br />
            가게를 찾았어요!
          </h1>
          <p className="result-subtitle">총 {RECOMMENDED_STORES.length}개</p>
        </div>

        {/* 추천 결과 리스트 */}
        <div className="result-stores-list">
          {RECOMMENDED_STORES.map((store, index) => (
            <div key={store.id} className="result-store-card">
              {/* 티켓 가운데 점선 구분선 */}
              <div className="ticket-divider"></div>
              
              {/* 티켓 위쪽: 가게 이미지 + 이름 */}
              <div className="ticket-upper">
                <div className="store-image-container">
                  <img src={store.image} alt={store.name} className="store-image" />
                </div>
                <h3 className="store-name">{store.name}</h3>
                
                {/* 우측 상단 화살표 아이콘 */}
                <button 
                  className="store-arrow-button"
                  onClick={() => handleStoreClick(store.id)}
                >
                  <img src={arrowIcon} alt="가게 상세보기" className="arrow-icon" />
                </button>
              </div>
              
              {/* 티켓 아래쪽: 전화번호 + 주소 */}
              <div className="ticket-lower">
                <div className="store-details">
                  <div className="store-detail-item">
                    <img src={callIcon} alt="전화" className="detail-icon" />
                    <span className="detail-text">{store.phone}</span>
                  </div>
                  
                  <div className="store-detail-item">
                    <img src={houseIcon} alt="주소" className="detail-icon" />
                    <span className="detail-text">{store.address}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* 하단 버튼들 */}
        <div className="result-buttons">
          <button className="retry-button" onClick={handleRetry}>
            다시하기
          </button>
          <button className="confirm-button" onClick={handleConfirm}>
            추천받기
          </button>
        </div>
      </div>
    </div>
  )
}

export default RecommendationResult
