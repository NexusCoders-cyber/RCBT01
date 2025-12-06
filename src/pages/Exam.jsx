import { useState, useEffect, useCallback, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Clock, ChevronLeft, ChevronRight, Flag, Send, 
  AlertTriangle, Grid, X, Check 
} from 'lucide-react'
import useStore from '../store/useStore'

export default function Exam() {
  const navigate = useNavigate()
  const {
    examMode,
    selectedSubjects,
    questions,
    currentQuestionIndex,
    currentSubjectIndex,
    answers,
    markedForReview,
    timeRemaining,
    timerEnabled,
    isExamActive,
    setCurrentQuestion,
    setCurrentSubject,
    answerQuestion,
    toggleMarkForReview,
    updateTimeRemaining,
    submitExam,
    resetExam,
  } = useStore()

  const [showNavGrid, setShowNavGrid] = useState(false)
  const [showSubmitModal, setShowSubmitModal] = useState(false)
  const [showTimeWarning, setShowTimeWarning] = useState(false)
  const hasSubmittedRef = useRef(false)

  useEffect(() => {
    if (!isExamActive || questions.length === 0) {
      navigate('/')
    }
  }, [isExamActive, questions, navigate])

  useEffect(() => {
    if (!timerEnabled || !isExamActive) return
    if (hasSubmittedRef.current) return

    const timer = setInterval(() => {
      const currentTime = useStore.getState().timeRemaining
      
      if (currentTime <= 1) {
        clearInterval(timer)
        if (!hasSubmittedRef.current) {
          hasSubmittedRef.current = true
          submitExam()
          navigate('/results')
        }
        return
      }
      
      updateTimeRemaining(currentTime - 1)
      
      if (currentTime <= 301 && !showTimeWarning) {
        setShowTimeWarning(true)
      }
    }, 1000)

    return () => clearInterval(timer)
  }, [timerEnabled, isExamActive, updateTimeRemaining, submitExam, navigate])

  const currentQuestion = questions[currentQuestionIndex]
  const currentSubject = selectedSubjects[currentSubjectIndex]

  const formatTime = (seconds) => {
    if (!seconds || seconds <= 0) return '00:00'
    const hrs = Math.floor(seconds / 3600)
    const mins = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60
    if (hrs > 0) {
      return `${hrs}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
    }
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestion(currentQuestionIndex - 1)
    }
  }

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestion(currentQuestionIndex + 1)
    }
  }

  const handleAnswer = (option) => {
    answerQuestion(currentQuestionIndex, option)
  }

  const handleSubmit = useCallback(() => {
    if (hasSubmittedRef.current) return
    hasSubmittedRef.current = true
    submitExam()
    navigate('/results')
  }, [submitExam, navigate])

  const getQuestionStatus = (index) => {
    const isAnswered = answers[index] !== undefined
    const isMarked = markedForReview.includes(index)
    const isCurrent = index === currentQuestionIndex

    if (isCurrent) return 'current'
    if (isMarked) return 'marked'
    if (isAnswered) return 'answered'
    return 'unanswered'
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'current':
        return 'bg-blue-600 text-white border-blue-600'
      case 'marked':
        return 'bg-orange-500 text-white border-orange-500'
      case 'answered':
        return 'bg-green-500 text-white border-green-500'
      default:
        return 'bg-white dark:bg-slate-700 text-slate-600 dark:text-slate-300 border-slate-300 dark:border-slate-600'
    }
  }

  const getSubjectQuestions = (subjectId) => {
    return questions.filter(q => q.subjectId === subjectId)
  }

  const answeredCount = Object.keys(answers).length
  const unansweredCount = questions.length - answeredCount

  if (!currentQuestion) return null

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex flex-col">
      <header className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {examMode === 'full' && (
                <div className="hidden sm:flex gap-1 overflow-x-auto pb-1">
                  {selectedSubjects.map((subject, idx) => (
                    <button
                      key={subject.id}
                      onClick={() => setCurrentSubject(idx)}
                      className={`subject-tab whitespace-nowrap ${
                        idx === currentSubjectIndex ? 'subject-tab-active' : 'subject-tab-inactive'
                      }`}
                    >
                      <span className="mr-1">{subject.icon}</span>
                      <span className="hidden md:inline">{subject.name}</span>
                    </button>
                  ))}
                </div>
              )}
              {examMode === 'practice' && (
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{currentSubject?.icon}</span>
                  <span className="font-semibold text-slate-900 dark:text-white">
                    {currentSubject?.name}
                  </span>
                </div>
              )}
            </div>

            <div className="flex items-center gap-3">
              {timerEnabled && timeRemaining > 0 && (
                <div className={`flex items-center gap-2 px-4 py-2 rounded-lg font-mono font-bold text-lg
                  ${timeRemaining <= 300 
                    ? 'bg-red-100 dark:bg-red-900/50 text-red-600 dark:text-red-400 animate-pulse' 
                    : 'bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400'
                  }`}>
                  <Clock className="w-5 h-5" />
                  {formatTime(timeRemaining)}
                </div>
              )}
              
              <button
                onClick={() => setShowNavGrid(true)}
                className="p-2 rounded-lg bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300"
              >
                <Grid className="w-5 h-5" />
              </button>
            </div>
          </div>

          {examMode === 'full' && (
            <div className="flex sm:hidden gap-1 mt-3 overflow-x-auto pb-1">
              {selectedSubjects.map((subject, idx) => (
                <button
                  key={subject.id}
                  onClick={() => setCurrentSubject(idx)}
                  className={`subject-tab whitespace-nowrap text-sm ${
                    idx === currentSubjectIndex ? 'subject-tab-active' : 'subject-tab-inactive'
                  }`}
                >
                  {subject.icon}
                </button>
              ))}
            </div>
          )}
        </div>
      </header>

      <main className="flex-1 max-w-4xl mx-auto w-full px-4 py-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentQuestionIndex}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
            className="space-y-6"
          >
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-slate-500 dark:text-slate-400">
                Question {currentQuestionIndex + 1} of {questions.length}
              </span>
              <button
                onClick={() => toggleMarkForReview(currentQuestionIndex)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors
                  ${markedForReview.includes(currentQuestionIndex)
                    ? 'bg-orange-100 dark:bg-orange-900/50 text-orange-600 dark:text-orange-400'
                    : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-600'
                  }`}
              >
                <Flag className="w-4 h-4" />
                {markedForReview.includes(currentQuestionIndex) ? 'Marked' : 'Mark for Review'}
              </button>
            </div>

            <div className="card p-6 sm:p-8">
              <div 
                className="text-lg sm:text-xl text-slate-900 dark:text-white leading-relaxed mb-6"
                dangerouslySetInnerHTML={{ __html: currentQuestion.question }}
              />

              {currentQuestion.image && (
                <div className="mb-6">
                  <img 
                    src={currentQuestion.image} 
                    alt="Question diagram" 
                    className="max-w-full h-auto rounded-lg mx-auto"
                  />
                </div>
              )}

              <div className="space-y-3">
                {Object.entries(currentQuestion.options).map(([key, value]) => {
                  if (!value) return null
                  const isSelected = answers[currentQuestionIndex] === key
                  
                  return (
                    <button
                      key={key}
                      onClick={() => handleAnswer(key)}
                      className={`w-full p-4 rounded-xl border-2 text-left transition-all duration-200 flex items-start gap-4
                        ${isSelected
                          ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30'
                          : 'border-slate-200 dark:border-slate-700 hover:border-blue-300 dark:hover:border-blue-700 hover:bg-slate-50 dark:hover:bg-slate-800'
                        }`}
                    >
                      <span className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm
                        ${isSelected
                          ? 'bg-blue-500 text-white'
                          : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                        }`}>
                        {key.toUpperCase()}
                      </span>
                      <span 
                        className="text-slate-700 dark:text-slate-200"
                        dangerouslySetInnerHTML={{ __html: value }}
                      />
                    </button>
                  )
                })}
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </main>

      <footer className="bg-white dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700 sticky bottom-0">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between gap-4">
            <button
              onClick={handlePrevious}
              disabled={currentQuestionIndex === 0}
              className="btn-secondary flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-5 h-5" />
              <span className="hidden sm:inline">Previous</span>
            </button>

            <button
              onClick={() => setShowSubmitModal(true)}
              className="btn-success flex items-center gap-2"
            >
              <Send className="w-5 h-5" />
              <span>Submit</span>
            </button>

            <button
              onClick={handleNext}
              disabled={currentQuestionIndex === questions.length - 1}
              className="btn-primary flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span className="hidden sm:inline">Next</span>
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </footer>

      <AnimatePresence>
        {showNavGrid && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center"
            onClick={() => setShowNavGrid(false)}
          >
            <motion.div
              initial={{ y: 100 }}
              animate={{ y: 0 }}
              exit={{ y: 100 }}
              className="bg-white dark:bg-slate-800 w-full sm:w-auto sm:max-w-lg sm:rounded-2xl rounded-t-2xl p-6 max-h-[80vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">Question Navigator</h3>
                <button
                  onClick={() => setShowNavGrid(false)}
                  className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700"
                >
                  <X className="w-5 h-5 text-slate-500" />
                </button>
              </div>

              <div className="flex flex-wrap gap-2 mb-4">
                <div className="flex items-center gap-2 text-xs">
                  <div className="w-4 h-4 rounded bg-green-500"></div>
                  <span className="text-slate-600 dark:text-slate-400">Answered</span>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <div className="w-4 h-4 rounded bg-orange-500"></div>
                  <span className="text-slate-600 dark:text-slate-400">Marked</span>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <div className="w-4 h-4 rounded bg-blue-600"></div>
                  <span className="text-slate-600 dark:text-slate-400">Current</span>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <div className="w-4 h-4 rounded border-2 border-slate-300"></div>
                  <span className="text-slate-600 dark:text-slate-400">Not Answered</span>
                </div>
              </div>

              {examMode === 'full' ? (
                <div className="space-y-4">
                  {selectedSubjects.map((subject) => {
                    const subjectQuestions = getSubjectQuestions(subject.id)
                    const startIndex = questions.findIndex(q => q.subjectId === subject.id)
                    
                    return (
                      <div key={subject.id}>
                        <p className="font-medium text-slate-900 dark:text-white mb-2 flex items-center gap-2">
                          <span>{subject.icon}</span>
                          {subject.name}
                        </p>
                        <div className="grid grid-cols-10 gap-1">
                          {subjectQuestions.map((_, idx) => {
                            const globalIdx = startIndex + idx
                            const status = getQuestionStatus(globalIdx)
                            return (
                              <button
                                key={globalIdx}
                                onClick={() => {
                                  setCurrentQuestion(globalIdx)
                                  setShowNavGrid(false)
                                }}
                                className={`question-nav-btn ${getStatusColor(status)}`}
                              >
                                {idx + 1}
                              </button>
                            )
                          })}
                        </div>
                      </div>
                    )
                  })}
                </div>
              ) : (
                <div className="grid grid-cols-10 gap-1">
                  {questions.map((_, idx) => {
                    const status = getQuestionStatus(idx)
                    return (
                      <button
                        key={idx}
                        onClick={() => {
                          setCurrentQuestion(idx)
                          setShowNavGrid(false)
                        }}
                        className={`question-nav-btn ${getStatusColor(status)}`}
                      >
                        {idx + 1}
                      </button>
                    )
                  })}
                </div>
              )}
            </motion.div>
          </motion.div>
        )}

        {showSubmitModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={() => setShowSubmitModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="bg-white dark:bg-slate-800 rounded-2xl p-6 max-w-md w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-full bg-yellow-100 dark:bg-yellow-900/50 flex items-center justify-center">
                  <AlertTriangle className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">Submit Exam?</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400">This action cannot be undone</p>
                </div>
              </div>

              <div className="space-y-2 mb-6">
                <div className="flex justify-between p-3 rounded-lg bg-slate-50 dark:bg-slate-700/50">
                  <span className="text-slate-600 dark:text-slate-400">Total Questions</span>
                  <span className="font-semibold text-slate-900 dark:text-white">{questions.length}</span>
                </div>
                <div className="flex justify-between p-3 rounded-lg bg-green-50 dark:bg-green-900/20">
                  <span className="text-green-700 dark:text-green-300">Answered</span>
                  <span className="font-semibold text-green-700 dark:text-green-300">{answeredCount}</span>
                </div>
                <div className="flex justify-between p-3 rounded-lg bg-red-50 dark:bg-red-900/20">
                  <span className="text-red-700 dark:text-red-300">Unanswered</span>
                  <span className="font-semibold text-red-700 dark:text-red-300">{unansweredCount}</span>
                </div>
                <div className="flex justify-between p-3 rounded-lg bg-orange-50 dark:bg-orange-900/20">
                  <span className="text-orange-700 dark:text-orange-300">Marked for Review</span>
                  <span className="font-semibold text-orange-700 dark:text-orange-300">{markedForReview.length}</span>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowSubmitModal(false)}
                  className="flex-1 btn-secondary"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmit}
                  className="flex-1 btn-success flex items-center justify-center gap-2"
                >
                  <Check className="w-5 h-5" />
                  Submit
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
