import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, Check, AlertCircle, Play, Loader2, Info } from 'lucide-react'
import useStore from '../store/useStore'
import { loadQuestionsForExam } from '../services/api'

const EXAM_DURATION = 120

export default function ExamSetup() {
  const navigate = useNavigate()
  const { subjects, startFullExamMode } = useStore()

  const english = subjects.find(s => s.id === 'english')
  const otherSubjects = subjects.filter(s => s.id !== 'english')

  const [selectedSubjects, setSelectedSubjects] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  const toggleSubject = (subject) => {
    setSelectedSubjects(prev => {
      if (prev.find(s => s.id === subject.id)) {
        return prev.filter(s => s.id !== subject.id)
      }
      if (prev.length >= 3) {
        return prev
      }
      return [...prev, subject]
    })
    setError(null)
  }

  const isSubjectSelected = (subjectId) => {
    return selectedSubjects.some(s => s.id === subjectId)
  }

  const handleStartExam = async () => {
    if (selectedSubjects.length !== 3) {
      setError('Please select exactly 3 subjects (English is compulsory)')
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const allSubjects = [english, ...selectedSubjects]
      const questionsMap = await loadQuestionsForExam(allSubjects)

      const totalQuestions = Object.values(questionsMap).reduce((sum, q) => sum + q.length, 0)
      if (totalQuestions < 100) {
        throw new Error('Could not load enough questions. Please try again.')
      }

      startFullExamMode(allSubjects, questionsMap, EXAM_DURATION)
      navigate('/exam')
    } catch (err) {
      setError(err.message || 'Failed to load exam questions. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-24 md:pb-8">
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
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Full Exam Mode</h1>
            <p className="text-slate-600 dark:text-slate-400">JAMB UTME Simulation</p>
          </div>
        </div>

        <div className="card p-6 border-2 border-blue-200 dark:border-blue-800 bg-blue-50/50 dark:bg-blue-900/20">
          <div className="flex items-start gap-3">
            <Info className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
            <div className="text-sm">
              <p className="font-semibold text-blue-900 dark:text-blue-100 mb-1">JAMB Exam Rules</p>
              <ul className="text-blue-800 dark:text-blue-200 space-y-1">
                <li>• <strong>4 subjects</strong> total (English is compulsory)</li>
                <li>• <strong>English:</strong> 60 questions</li>
                <li>• <strong>Other 3 subjects:</strong> 40 questions each</li>
                <li>• <strong>Total:</strong> 180 questions in 2 hours</li>
              </ul>
            </div>
          </div>
        </div>

        {error && (
          <div className="p-4 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
            <p className="text-red-700 dark:text-red-300">{error}</p>
          </div>
        )}

        <div className="card p-6">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
            Compulsory Subject
          </h2>
          <div className="p-4 rounded-xl bg-green-50 dark:bg-green-900/20 border-2 border-green-500 dark:border-green-600">
            <div className="flex items-center gap-4">
              <span className="text-3xl">{english?.icon}</span>
              <div className="flex-1">
                <p className="font-semibold text-slate-900 dark:text-white">{english?.name}</p>
                <p className="text-sm text-green-700 dark:text-green-300">60 questions (compulsory)</p>
              </div>
              <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center">
                <Check className="w-5 h-5 text-white" />
              </div>
            </div>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
              Select 3 More Subjects
            </h2>
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
              selectedSubjects.length === 3
                ? 'bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-300'
                : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400'
            }`}>
              {selectedSubjects.length}/3 selected
            </span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {otherSubjects.map((subject) => {
              const isSelected = isSubjectSelected(subject.id)
              const isDisabled = !isSelected && selectedSubjects.length >= 3
              
              return (
                <button
                  key={subject.id}
                  onClick={() => toggleSubject(subject)}
                  disabled={isDisabled}
                  className={`p-4 rounded-xl border-2 transition-all duration-200 text-left relative
                    ${isSelected
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30'
                      : isDisabled
                        ? 'border-slate-200 dark:border-slate-700 opacity-50 cursor-not-allowed'
                        : 'border-slate-200 dark:border-slate-700 hover:border-blue-300 dark:hover:border-blue-700'
                    }`}
                >
                  {isSelected && (
                    <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center">
                      <Check className="w-4 h-4 text-white" />
                    </div>
                  )}
                  <span className="text-2xl block mb-1">{subject.icon}</span>
                  <span className="font-medium text-sm text-slate-900 dark:text-white">{subject.name}</span>
                  <span className="block text-xs text-slate-500 dark:text-slate-400 mt-1">40 questions</span>
                </button>
              )
            })}
          </div>
        </div>

        <div className="card p-6">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Selected Subjects</h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50 dark:bg-slate-700/50">
              <div className="flex items-center gap-3">
                <span className="text-xl">{english?.icon}</span>
                <span className="font-medium text-slate-900 dark:text-white">{english?.name}</span>
              </div>
              <span className="text-sm font-medium text-blue-600 dark:text-blue-400">60 questions</span>
            </div>
            {selectedSubjects.map((subject) => (
              <div key={subject.id} className="flex items-center justify-between p-3 rounded-lg bg-slate-50 dark:bg-slate-700/50">
                <div className="flex items-center gap-3">
                  <span className="text-xl">{subject.icon}</span>
                  <span className="font-medium text-slate-900 dark:text-white">{subject.name}</span>
                </div>
                <span className="text-sm font-medium text-blue-600 dark:text-blue-400">40 questions</span>
              </div>
            ))}
            {selectedSubjects.length < 3 && (
              <div className="p-3 rounded-lg border-2 border-dashed border-slate-300 dark:border-slate-600 text-center">
                <p className="text-slate-500 dark:text-slate-400 text-sm">
                  Select {3 - selectedSubjects.length} more subject{3 - selectedSubjects.length > 1 ? 's' : ''}
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="card p-6 bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="font-semibold text-slate-900 dark:text-white">Total Questions</p>
              <p className="text-3xl font-bold text-gradient">180</p>
            </div>
            <div>
              <p className="font-semibold text-slate-900 dark:text-white">Duration</p>
              <p className="text-3xl font-bold text-gradient">2 hours</p>
            </div>
            <div>
              <p className="font-semibold text-slate-900 dark:text-white">Subjects</p>
              <p className="text-3xl font-bold text-gradient">4</p>
            </div>
          </div>
        </div>

        <button
          onClick={handleStartExam}
          disabled={selectedSubjects.length !== 3 || isLoading}
          className="btn-success w-full flex items-center justify-center gap-2 py-4 text-lg"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Loading Exam...
            </>
          ) : (
            <>
              <Play className="w-5 h-5" />
              Start Full Exam
            </>
          )}
        </button>
      </motion.div>
    </div>
  )
}
