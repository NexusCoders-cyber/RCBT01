import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, Clock, BookOpen, Play, Loader2, AlertCircle } from 'lucide-react'
import useStore from '../store/useStore'
import { loadPracticeQuestions } from '../services/api'

export default function PracticeSetup() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { subjects, years, timerEnabled, startPracticeMode } = useStore()

  const [selectedSubject, setSelectedSubject] = useState(null)
  const [selectedYear, setSelectedYear] = useState('random')
  const [questionCount, setQuestionCount] = useState(40)
  const [duration, setDuration] = useState(30)
  const [useTimer, setUseTimer] = useState(timerEnabled)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    const subjectParam = searchParams.get('subject')
    if (subjectParam) {
      const subject = subjects.find(s => s.id === subjectParam)
      if (subject) {
        setSelectedSubject(subject)
      }
    }
  }, [searchParams, subjects])

  const handleStartPractice = async () => {
    if (!selectedSubject) return

    setIsLoading(true)
    setError(null)

    try {
      const year = selectedYear === 'random' ? null : selectedYear
      const questions = await loadPracticeQuestions(selectedSubject, questionCount, year)

      if (questions.length === 0) {
        throw new Error('No questions available for this subject')
      }

      startPracticeMode(
        selectedSubject,
        year,
        questions,
        useTimer ? duration : 0
      )

      navigate('/exam')
    } catch (err) {
      setError(err.message || 'Failed to load questions. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-24 md:pb-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/')}
            className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-slate-600 dark:text-slate-400" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Practice Mode</h1>
            <p className="text-slate-600 dark:text-slate-400">Configure your practice session</p>
          </div>
        </div>

        {error && (
          <div className="p-4 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
            <p className="text-red-700 dark:text-red-300">{error}</p>
          </div>
        )}

        <div className="card p-6">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-blue-600" />
            Select Subject
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {subjects.map((subject) => (
              <button
                key={subject.id}
                onClick={() => setSelectedSubject(subject)}
                className={`p-4 rounded-xl border-2 transition-all duration-200 text-left
                  ${selectedSubject?.id === subject.id
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30'
                    : 'border-slate-200 dark:border-slate-700 hover:border-blue-300 dark:hover:border-blue-700'
                  }`}
              >
                <span className="text-2xl block mb-1">{subject.icon}</span>
                <span className="font-medium text-sm text-slate-900 dark:text-white">{subject.name}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="card p-6">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Select Year</h2>
          <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
            <button
              onClick={() => setSelectedYear('random')}
              className={`p-3 rounded-lg font-medium transition-all duration-200
                ${selectedYear === 'random'
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'
                }`}
            >
              Random
            </button>
            {years.slice(0, 15).map((year) => (
              <button
                key={year}
                onClick={() => setSelectedYear(year)}
                className={`p-3 rounded-lg font-medium transition-all duration-200
                  ${selectedYear === year
                    ? 'bg-blue-600 text-white shadow-lg'
                    : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'
                  }`}
              >
                {year}
              </button>
            ))}
          </div>
        </div>

        <div className="card p-6">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Number of Questions</h2>
          <div className="flex flex-wrap gap-2">
            {[10, 20, 30, 40, 50].map((count) => (
              <button
                key={count}
                onClick={() => setQuestionCount(count)}
                className={`px-6 py-3 rounded-lg font-medium transition-all duration-200
                  ${questionCount === count
                    ? 'bg-blue-600 text-white shadow-lg'
                    : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'
                  }`}
              >
                {count}
              </button>
            ))}
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white flex items-center gap-2">
              <Clock className="w-5 h-5 text-blue-600" />
              Timer Settings
            </h2>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={useTimer}
                onChange={(e) => setUseTimer(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
            </label>
          </div>
          
          {useTimer && (
            <div className="flex flex-wrap gap-2">
              {[15, 20, 30, 45, 60].map((mins) => (
                <button
                  key={mins}
                  onClick={() => setDuration(mins)}
                  className={`px-6 py-3 rounded-lg font-medium transition-all duration-200
                    ${duration === mins
                      ? 'bg-blue-600 text-white shadow-lg'
                      : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'
                    }`}
                >
                  {mins} mins
                </button>
              ))}
            </div>
          )}
        </div>

        <button
          onClick={handleStartPractice}
          disabled={!selectedSubject || isLoading}
          className="btn-primary w-full flex items-center justify-center gap-2 py-4 text-lg"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Loading Questions...
            </>
          ) : (
            <>
              <Play className="w-5 h-5" />
              Start Practice
            </>
          )}
        </button>
      </motion.div>
    </div>
  )
}
