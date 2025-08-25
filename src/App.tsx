import './App.css'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import SignupOnboarding from './components/signup/SignupOnboarding'
import SignupForm from './components/signup/SignupForm'
import LoginForm from './components/login/LoginForm'
import Home from './components/home/Home'
import RecommendationForm from './components/home/recommendation/RecommendationForm'
import RecommendationCategoryForm from './components/home/recommendation/RecommendationCategoryForm'
import RecommendationAtmosphereForm from './components/home/recommendation/RecommendationAtmosphereForm'
import RecommendationOptionsForm from './components/home/recommendation/RecommendationOptionsForm'
import RecommendationLoading from './components/home/recommendation/RecommendationLoading'
import RecommendationResult from './components/home/recommendation/RecommendationResult'
import RecommendationNoResult from './components/home/recommendation/RecommendationNoResult'
import MissionAuthPage from './components/home/mission/MissionAuthPage'
import MissionAuthResultPage from './components/home/mission/MissionAuthResultPage'
import MissionAuthCompletePage from './components/home/mission/MissionAuthCompletePage'
import MissionReviewPage from './components/home/mission/MissionReviewPage'
import MyInfoPage from './components/home/mypage/MyInfoPage'
import CouponPage from './components/home/mypage/CouponPage'
import SettingPage from './components/home/mypage/SettingPage'
import NicknameChangePage from './components/home/mypage/NicknameChangePage'
import RegionChangePage from './components/home/mypage/RegionChangePage'
import MyReviewsPage from './components/home/mypage/MyReviewsPage'
import ComingSoonPage from './components/common/ComingSoonPage'

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<SignupOnboarding />} />
          <Route path="/signup" element={<SignupForm />} />
          <Route path="/login" element={<LoginForm />} />
          <Route path="/home" element={<Home />} />
          <Route path="/home/mypage" element={<Home defaultTab="myinfo" />} />
          <Route path="/home/recommendation" element={<RecommendationForm />} />
          <Route path="/home/recommendation/category" element={<RecommendationCategoryForm />} />
          <Route path="/home/recommendation/atmosphere" element={<RecommendationAtmosphereForm />} />
          <Route path="/home/recommendation/options" element={<RecommendationOptionsForm />} />
          <Route path="/home/recommendation/loading" element={<RecommendationLoading />} />
          <Route path="/home/recommendation/result" element={<RecommendationResult />} />
          <Route path="/home/recommendation/no-result" element={<RecommendationNoResult />} />
          <Route path="/home/mission/auth" element={<MissionAuthPage />} />
          <Route path="/home/mission/auth/result" element={<MissionAuthResultPage />} />
          <Route path="/home/mission/auth/complete" element={<MissionAuthCompletePage />} />
          <Route path="/home/mission/review" element={<MissionReviewPage />} />
          <Route path="/home/mypage/coupon" element={<Home defaultTab="myinfo" />} />
          <Route path="/home/mypage/setting" element={<Home defaultTab="myinfo" />} />
          <Route path="/home/mypage/profile-change" element={<NicknameChangePage />} />
          <Route path="/home/mypage/region-change" element={<RegionChangePage />} />
          <Route path="/home/mypage/reviews" element={<Home defaultTab="myinfo" />} />
          <Route path="/home/notice" element={<ComingSoonPage title="공지사항" description="공지사항은 아직 준비 중이에요!" />} />
          <Route path="/home/terms" element={<ComingSoonPage title="이용약관" description="이용약관은 아직 준비 중이에요!" />} />
          <Route path="/home/privacy" element={<ComingSoonPage title="개인정보 처리방침" description="개인정보 처리방침은 아직 준비 중이에요!" />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  )
}

export default App
