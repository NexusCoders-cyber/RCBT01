import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const JAMB_SUBJECTS = [
  { id: 'english', name: 'English Language', icon: '📝', color: 'blue' },
  { id: 'mathematics', name: 'Mathematics', icon: '🔢', color: 'purple' },
  { id: 'physics', name: 'Physics', icon: '⚡', color: 'yellow' },
  { id: 'chemistry', name: 'Chemistry', icon: '🧪', color: 'green' },
  { id: 'biology', name: 'Biology', icon: '🧬', color: 'pink' },
  { id: 'literature', name: 'Literature in English', icon: '📖', color: 'orange' },
  { id: 'government', name: 'Government', icon: '🏛️', color: 'red' },
  { id: 'commerce', name: 'Commerce', icon: '💼', color: 'teal' },
  { id: 'accounting', name: 'Accounting', icon: '📊', color: 'indigo' },
  { id: 'economics', name: 'Economics', icon: '📈', color: 'cyan' },
  { id: 'crk', name: 'Christian Religious Studies', icon: '✝️', color: 'amber' },
  { id: 'irk', name: 'Islamic Religious Studies', icon: '☪️', color: 'emerald' },
  { id: 'geography', name: 'Geography', icon: '🌍', color: 'lime' },
  { id: 'agric', name: 'Agricultural Science', icon: '🌾', color: 'green' },
  { id: 'history', name: 'History', icon: '📜', color: 'brown' },
]

const YEARS = Array.from({ length: 25 }, (_, i) => 2024 - i)

const useStore = create(
  persist(
    (set, get) => ({
      theme: 'light',
      fontSize: 'medium',
      timerEnabled: true,
      soundEnabled: true,
      vibrationEnabled: true,
      
      subjects: JAMB_SUBJECTS,
      years: YEARS,
      
      currentExam: null,
      examMode: null,
      selectedSubjects: [],
      questions: [],
      currentQuestionIndex: 0,
      currentSubjectIndex: 0,
      answers: {},
      markedForReview: [],
      timeRemaining: 0,
      examStartTime: null,
      examEndTime: null,
      isExamActive: false,
      isExamSubmitted: false,
      
      practiceHistory: [],
      examHistory: [],
      
      setTheme: (theme) => set({ theme }),
      setFontSize: (fontSize) => set({ fontSize }),
      setTimerEnabled: (timerEnabled) => set({ timerEnabled }),
      setSoundEnabled: (soundEnabled) => set({ soundEnabled }),
      setVibrationEnabled: (vibrationEnabled) => set({ vibrationEnabled }),
      
      startPracticeMode: (subject, year, questions, duration) => {
        set({
          examMode: 'practice',
          selectedSubjects: [subject],
          questions: questions.map((q, i) => ({ ...q, globalIndex: i, subjectId: subject.id })),
          currentQuestionIndex: 0,
          currentSubjectIndex: 0,
          answers: {},
          markedForReview: [],
          timeRemaining: duration * 60,
          examStartTime: Date.now(),
          isExamActive: true,
          isExamSubmitted: false,
        })
      },
      
      startFullExamMode: (subjects, questionsMap, duration) => {
        const allQuestions = []
        let globalIndex = 0
        
        subjects.forEach((subject, subjectIdx) => {
          const subjectQuestions = questionsMap[subject.id] || []
          subjectQuestions.forEach((q) => {
            allQuestions.push({
              ...q,
              globalIndex: globalIndex++,
              subjectId: subject.id,
              subjectIndex: subjectIdx,
            })
          })
        })
        
        set({
          examMode: 'full',
          selectedSubjects: subjects,
          questions: allQuestions,
          currentQuestionIndex: 0,
          currentSubjectIndex: 0,
          answers: {},
          markedForReview: [],
          timeRemaining: duration * 60,
          examStartTime: Date.now(),
          isExamActive: true,
          isExamSubmitted: false,
        })
      },
      
      setCurrentQuestion: (index) => {
        const questions = get().questions
        if (index >= 0 && index < questions.length) {
          const question = questions[index]
          set({
            currentQuestionIndex: index,
            currentSubjectIndex: question.subjectIndex || 0,
          })
        }
      },
      
      setCurrentSubject: (subjectIndex) => {
        const questions = get().questions
        const selectedSubjects = get().selectedSubjects
        
        if (subjectIndex >= 0 && subjectIndex < selectedSubjects.length) {
          const subject = selectedSubjects[subjectIndex]
          const firstQuestionOfSubject = questions.findIndex(q => q.subjectId === subject.id)
          
          if (firstQuestionOfSubject !== -1) {
            set({
              currentSubjectIndex: subjectIndex,
              currentQuestionIndex: firstQuestionOfSubject,
            })
          }
        }
      },
      
      answerQuestion: (questionIndex, answer) => {
        set((state) => ({
          answers: { ...state.answers, [questionIndex]: answer },
        }))
      },
      
      toggleMarkForReview: (questionIndex) => {
        set((state) => {
          const marked = state.markedForReview.includes(questionIndex)
          return {
            markedForReview: marked
              ? state.markedForReview.filter((i) => i !== questionIndex)
              : [...state.markedForReview, questionIndex],
          }
        })
      },
      
      updateTimeRemaining: (time) => set({ timeRemaining: time }),
      
      submitExam: () => {
        const state = get()
        const result = calculateResult(state)
        
        const examRecord = {
          id: Date.now(),
          mode: state.examMode,
          subjects: state.selectedSubjects.map(s => s.name),
          date: new Date().toISOString(),
          duration: Math.floor((Date.now() - state.examStartTime) / 1000),
          ...result,
        }
        
        set((state) => ({
          isExamActive: false,
          isExamSubmitted: true,
          examEndTime: Date.now(),
          currentExam: examRecord,
          [state.examMode === 'practice' ? 'practiceHistory' : 'examHistory']: [
            examRecord,
            ...(state.examMode === 'practice' ? state.practiceHistory : state.examHistory).slice(0, 49),
          ],
        }))
        
        return examRecord
      },
      
      resetExam: () => {
        set({
          currentExam: null,
          examMode: null,
          selectedSubjects: [],
          questions: [],
          currentQuestionIndex: 0,
          currentSubjectIndex: 0,
          answers: {},
          markedForReview: [],
          timeRemaining: 0,
          examStartTime: null,
          examEndTime: null,
          isExamActive: false,
          isExamSubmitted: false,
        })
      },
      
      clearAllData: () => {
        set({
          practiceHistory: [],
          examHistory: [],
          currentExam: null,
          examMode: null,
          selectedSubjects: [],
          questions: [],
          currentQuestionIndex: 0,
          currentSubjectIndex: 0,
          answers: {},
          markedForReview: [],
          timeRemaining: 0,
          examStartTime: null,
          examEndTime: null,
          isExamActive: false,
          isExamSubmitted: false,
        })
      },
    }),
    {
      name: 'jamb-cbt-storage',
      partialize: (state) => ({
        theme: state.theme,
        fontSize: state.fontSize,
        timerEnabled: state.timerEnabled,
        soundEnabled: state.soundEnabled,
        vibrationEnabled: state.vibrationEnabled,
        practiceHistory: state.practiceHistory,
        examHistory: state.examHistory,
      }),
    }
  )
)

function calculateResult(state) {
  const { questions, answers, selectedSubjects } = state
  
  let totalCorrect = 0
  let totalWrong = 0
  let totalUnanswered = 0
  
  const subjectResults = {}
  
  selectedSubjects.forEach((subject) => {
    subjectResults[subject.id] = {
      name: subject.name,
      total: 0,
      correct: 0,
      wrong: 0,
      unanswered: 0,
      score: 0,
    }
  })
  
  questions.forEach((question, index) => {
    const userAnswer = answers[index]
    const subjectId = question.subjectId
    
    subjectResults[subjectId].total++
    
    if (userAnswer === undefined || userAnswer === null) {
      totalUnanswered++
      subjectResults[subjectId].unanswered++
    } else if (userAnswer === question.answer) {
      totalCorrect++
      subjectResults[subjectId].correct++
    } else {
      totalWrong++
      subjectResults[subjectId].wrong++
    }
  })
  
  Object.keys(subjectResults).forEach((subjectId) => {
    const result = subjectResults[subjectId]
    result.score = result.total > 0 ? Math.round((result.correct / result.total) * 100) : 0
  })
  
  const totalQuestions = questions.length
  const overallScore = totalQuestions > 0 ? Math.round((totalCorrect / totalQuestions) * 100) : 0
  
  return {
    totalQuestions,
    totalCorrect,
    totalWrong,
    totalUnanswered,
    overallScore,
    subjectResults,
  }
}

export default useStore
