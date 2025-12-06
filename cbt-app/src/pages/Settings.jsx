import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { 
  ArrowLeft, Sun, Moon, Clock, Volume2, Vibrate, 
  Type, Trash2, AlertTriangle, Check, Info
} from 'lucide-react'
import useStore from '../store/useStore'

export default function Settings() {
  const {
    theme,
    setTheme,
    fontSize,
    setFontSize,
    timerEnabled,
    setTimerEnabled,
    soundEnabled,
    setSoundEnabled,
    vibrationEnabled,
    setVibrationEnabled,
    practiceHistory,
    examHistory,
    clearAllData,
  } = useStore()

  const [showClearConfirm, setShowClearConfirm] = useState(false)
  const [clearSuccess, setClearSuccess] = useState(false)

  const handleClearData = () => {
    clearAllData()
    setShowClearConfirm(false)
    setClearSuccess(true)
    setTimeout(() => setClearSuccess(false), 3000)
  }

  const totalSessions = practiceHistory.length + examHistory.length

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-24 md:pb-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        <div className="flex items-center gap-4">
          <Link
            to="/"
            className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-slate-600 dark:text-slate-400" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Settings</h1>
            <p className="text-slate-600 dark:text-slate-400">Customize your experience</p>
          </div>
        </div>

        {clearSuccess && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 rounded-xl bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 flex items-center gap-3"
          >
            <Check className="w-5 h-5 text-green-600 dark:text-green-400" />
            <p className="text-green-700 dark:text-green-300">All data has been cleared successfully</p>
          </motion.div>
        )}

        <div className="card p-6">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
            {theme === 'dark' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
            Theme
          </h2>
          <div className="flex gap-3">
            <button
              onClick={() => setTheme('light')}
              className={`flex-1 p-4 rounded-xl border-2 transition-all duration-200 flex flex-col items-center gap-2
                ${theme === 'light'
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30'
                  : 'border-slate-200 dark:border-slate-700 hover:border-blue-300'
                }`}
            >
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-yellow-300 to-orange-400 flex items-center justify-center">
                <Sun className="w-6 h-6 text-white" />
              </div>
              <span className="font-medium text-slate-900 dark:text-white">Light</span>
            </button>
            <button
              onClick={() => setTheme('dark')}
              className={`flex-1 p-4 rounded-xl border-2 transition-all duration-200 flex flex-col items-center gap-2
                ${theme === 'dark'
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30'
                  : 'border-slate-200 dark:border-slate-700 hover:border-blue-300'
                }`}
            >
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-slate-700 to-slate-900 flex items-center justify-center">
                <Moon className="w-6 h-6 text-white" />
              </div>
              <span className="font-medium text-slate-900 dark:text-white">Dark</span>
            </button>
          </div>
        </div>

        <div className="card p-6">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
            <Type className="w-5 h-5" />
            Font Size
          </h2>
          <div className="flex gap-3">
            {['small', 'medium', 'large'].map((size) => (
              <button
                key={size}
                onClick={() => setFontSize(size)}
                className={`flex-1 p-4 rounded-xl border-2 transition-all duration-200 flex flex-col items-center gap-2
                  ${fontSize === size
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30'
                    : 'border-slate-200 dark:border-slate-700 hover:border-blue-300'
                  }`}
              >
                <span className={`font-medium text-slate-900 dark:text-white
                  ${size === 'small' ? 'text-sm' : size === 'large' ? 'text-xl' : 'text-base'}`}>
                  Aa
                </span>
                <span className="font-medium text-slate-900 dark:text-white capitalize text-sm">{size}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="card p-6 space-y-4">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">Exam Settings</h2>
          
          <div className="flex items-center justify-between p-4 rounded-xl bg-slate-50 dark:bg-slate-700/50">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center">
                <Clock className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="font-medium text-slate-900 dark:text-white">Timer</p>
                <p className="text-sm text-slate-500 dark:text-slate-400">Show countdown timer during exams</p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={timerEnabled}
                onChange={(e) => setTimerEnabled(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-slate-600 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
            </label>
          </div>

          <div className="flex items-center justify-between p-4 rounded-xl bg-slate-50 dark:bg-slate-700/50">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-purple-100 dark:bg-purple-900/50 flex items-center justify-center">
                <Volume2 className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <p className="font-medium text-slate-900 dark:text-white">Sound</p>
                <p className="text-sm text-slate-500 dark:text-slate-400">Play sounds for actions</p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={soundEnabled}
                onChange={(e) => setSoundEnabled(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-slate-600 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
            </label>
          </div>

          <div className="flex items-center justify-between p-4 rounded-xl bg-slate-50 dark:bg-slate-700/50">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-green-100 dark:bg-green-900/50 flex items-center justify-center">
                <Vibrate className="w-5 h-5 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="font-medium text-slate-900 dark:text-white">Vibration</p>
                <p className="text-sm text-slate-500 dark:text-slate-400">Haptic feedback on mobile</p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={vibrationEnabled}
                onChange={(e) => setVibrationEnabled(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-slate-600 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
            </label>
          </div>
        </div>

        <div className="card p-6">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
            <Trash2 className="w-5 h-5 text-red-500" />
            Data Management
          </h2>
          
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-700/50 mb-4">
            <div className="flex items-center gap-3 mb-2">
              <Info className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              <p className="font-medium text-slate-900 dark:text-white">Storage Info</p>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              You have <strong>{totalSessions}</strong> exam sessions saved locally.
            </p>
          </div>

          <button
            onClick={() => setShowClearConfirm(true)}
            className="w-full p-4 rounded-xl border-2 border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20 
                       text-red-700 dark:text-red-300 font-medium hover:bg-red-100 dark:hover:bg-red-900/30 
                       transition-colors flex items-center justify-center gap-2"
          >
            <Trash2 className="w-5 h-5" />
            Clear All Data
          </button>
        </div>

        <div className="card p-6 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20">
          <h3 className="font-semibold text-slate-900 dark:text-white mb-2">About JAMB CBT Practice</h3>
          <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
            A modern CBT practice platform powered by the ALOC API. Practice JAMB questions 
            with official exam format and track your progress.
          </p>
          <div className="flex flex-wrap gap-2 text-xs">
            <span className="px-3 py-1 rounded-full bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400">
              Version 1.0.0
            </span>
            <a 
              href="https://questions.aloc.com.ng" 
              target="_blank" 
              rel="noopener noreferrer"
              className="px-3 py-1 rounded-full bg-blue-600 text-white hover:bg-blue-700 transition-colors"
            >
              ALOC API
            </a>
          </div>
        </div>
      </motion.div>

      {showClearConfirm && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          onClick={() => setShowClearConfirm(false)}
        >
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            className="bg-white dark:bg-slate-800 rounded-2xl p-6 max-w-md w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-900/50 flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-red-600 dark:text-red-400" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">Clear All Data?</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">This action cannot be undone</p>
              </div>
            </div>

            <p className="text-slate-600 dark:text-slate-400 mb-6">
              This will permanently delete all your practice history, exam records, and saved progress. 
              Your settings will be reset to defaults.
            </p>

            <div className="flex gap-3">
              <button
                onClick={() => setShowClearConfirm(false)}
                className="flex-1 btn-secondary"
              >
                Cancel
              </button>
              <button
                onClick={handleClearData}
                className="flex-1 btn-danger flex items-center justify-center gap-2"
              >
                <Trash2 className="w-5 h-5" />
                Clear All
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  )
}
