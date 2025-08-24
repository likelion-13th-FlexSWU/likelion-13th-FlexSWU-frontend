import './App.css'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
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
import MissionAuthPage from './components/home/mission/MissionAuthPage'
import MissionAuthResultPage from './components/home/mission/MissionAuthResultPage'
import MissionAuthCompletePage from './components/home/mission/MissionAuthCompletePage'
import MissionReviewPage from './components/home/mission/MissionReviewPage'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<SignupOnboarding />} />
        <Route path="/signup" element={<SignupForm />} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/home" element={<Home />} />
        <Route path="/home/recommendation" element={<RecommendationForm />} />
        <Route path="/home/recommendation/category" element={<RecommendationCategoryForm />} />
        <Route path="/home/recommendation/atmosphere" element={<RecommendationAtmosphereForm />} />
        <Route path="/home/recommendation/options" element={<RecommendationOptionsForm />} />
        <Route path="/home/recommendation/loading" element={<RecommendationLoading />} />
        <Route path="/home/recommendation/result" element={<RecommendationResult />} />
        <Route path="/home/mission/auth" element={<MissionAuthPage />} />
        <Route path="/home/mission/auth/result" element={<MissionAuthResultPage />} />
        <Route path="/mission-complete" element={<MissionAuthCompletePage />} />
        <Route path="/mission-review" element={<MissionReviewPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  )
}

export default App
