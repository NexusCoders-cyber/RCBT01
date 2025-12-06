import { useEffect } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import useStore from './store/useStore'
import Layout from './components/Layout'
import Dashboard from './pages/Dashboard'
import PracticeSetup from './pages/PracticeSetup'
import ExamSetup from './pages/ExamSetup'
import Exam from './pages/Exam'
import Results from './pages/Results'
import Review from './pages/Review'
import Analytics from './pages/Analytics'
import Settings from './pages/Settings'

function App() {
  const { theme } = useStore()

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [theme])

  return (
    <div className={`min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-900 dark:to-slate-800 bg-pattern transition-colors duration-300`}>
      <AnimatePresence mode="wait">
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path="practice" element={<PracticeSetup />} />
            <Route path="exam-setup" element={<ExamSetup />} />
            <Route path="exam" element={<Exam />} />
            <Route path="results" element={<Results />} />
            <Route path="review" element={<Review />} />
            <Route path="analytics" element={<Analytics />} />
            <Route path="settings" element={<Settings />} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AnimatePresence>
    </div>
  )
}

export default App
