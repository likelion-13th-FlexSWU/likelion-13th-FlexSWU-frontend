import React, { useEffect } from 'react'
import './Toast.css'

interface ToastProps {
  message: string
  isVisible: boolean
  onClose: () => void
  type?: 'success' | 'error' | 'info'
  duration?: number
}

const Toast: React.FC<ToastProps> = ({ 
  message, 
  isVisible, 
  onClose, 
  type = 'success', 
  duration = 3000 
}) => {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        onClose()
      }, duration)
      
      return () => clearTimeout(timer)
    }
  }, [isVisible, duration, onClose])

  if (!isVisible) return null

  return (
    <div className={`toast toast-${type}`}>
      <div className="toast-content">
        <span className="toast-icon">
          {type === 'success' && '✅'}
          {type === 'error' && '❌'}
          {type === 'info' && 'ℹ️'}
        </span>
        <span className="toast-message">{message}</span>
      </div>
    </div>
  )
}

export default Toast
