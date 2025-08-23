import React from 'react'
import './App.css'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import SignupOnboarding from './components/signup/SignupOnboarding'
import SignupForm from './components/signup/SignupForm'
import LoginForm from './components/login/LoginForm'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<SignupOnboarding />} />
        <Route path="/signup" element={<SignupForm />} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  )
}

export default App
