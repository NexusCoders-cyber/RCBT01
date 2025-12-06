import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { 
  Play, Clock, BookOpen, BarChart2, ChevronRight, 
  Target, Award, TrendingUp, Zap 
} from 'lucide-react'
import useStore from '../store/useStore'

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
}

export default function Dashboard() {
  const { subjects, practiceHistory, examHistory } = useStore()

  const recentExams = [...practiceHistory, ...examHistory]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 3)

  const totalPractice = practiceHistory.length
  const totalExams = examHistory.length
  const averageScore = recentExams.length > 0
    ? Math.round(recentExams.reduce((sum, e) => sum + e.overallScore, 0) / recentExams.length)
    : 0

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-24 md:pb-8">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-8"
      >
        <motion.div variants={itemVariants} className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-2">
            Welcome to <span className="text-gradient">JAMB CBT</span>
          </h1>
          <p className="text-slate-600 dark:text-slate-400 text-lg">
            Master your UTME preparation with our modern practice platform
          </p>
        </motion.div>

        <motion.div variants={itemVariants} className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="card p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center">
                <Target className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900 dark:text-white">{totalPractice}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">Practice Sessions</p>
              </div>
            </div>
          </div>
          <div className="card p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-green-100 dark:bg-green-900/50 flex items-center justify-center">
                <Award className="w-5 h-5 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900 dark:text-white">{totalExams}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">Full Exams</p>
              </div>
            </div>
          </div>
          <div className="card p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-purple-100 dark:bg-purple-900/50 flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900 dark:text-white">{averageScore}%</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">Avg Score</p>
              </div>
            </div>
          </div>
          <div className="card p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-orange-100 dark:bg-orange-900/50 flex items-center justify-center">
                <Zap className="w-5 h-5 text-orange-600 dark:text-orange-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900 dark:text-white">{subjects.length}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">Subjects</p>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div variants={itemVariants} className="grid sm:grid-cols-2 gap-4">
          <Link to="/practice" className="group">
            <div className="card-hover p-6 h-full">
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/30 group-hover:scale-110 transition-transform">
                  <BookOpen className="w-7 h-7 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-1">Start Practice</h3>
                  <p className="text-slate-600 dark:text-slate-400 text-sm mb-3">
                    Practice individual subjects with customizable settings
                  </p>
                  <div className="flex items-center text-blue-600 dark:text-blue-400 font-medium text-sm">
                    Begin Practice
                    <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>
            </div>
          </Link>

          <Link to="/exam-setup" className="group">
            <div className="card-hover p-6 h-full border-2 border-green-200 dark:border-green-800">
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center shadow-lg shadow-green-500/30 group-hover:scale-110 transition-transform">
                  <Play className="w-7 h-7 text-white" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white">Full Exam Mode</h3>
                    <span className="px-2 py-0.5 text-xs font-bold bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-300 rounded-full">
                      JAMB STYLE
                    </span>
                  </div>
                  <p className="text-slate-600 dark:text-slate-400 text-sm mb-3">
                    4 subjects, 180 questions, official JAMB format
                  </p>
                  <div className="flex items-center text-green-600 dark:text-green-400 font-medium text-sm">
                    Start Full Exam
                    <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>
            </div>
          </Link>
        </motion.div>

        {recentExams.length > 0 && (
          <motion.div variants={itemVariants}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">Recent Activity</h2>
              <Link to="/analytics" className="text-blue-600 dark:text-blue-400 text-sm font-medium hover:underline">
                View All
              </Link>
            </div>
            <div className="space-y-3">
              {recentExams.map((exam) => (
                <div key={exam.id} className="card p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center
                        ${exam.mode === 'full' 
                          ? 'bg-green-100 dark:bg-green-900/50' 
                          : 'bg-blue-100 dark:bg-blue-900/50'
                        }`}>
                        {exam.mode === 'full' 
                          ? <Award className="w-5 h-5 text-green-600 dark:text-green-400" />
                          : <BookOpen className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                        }
                      </div>
                      <div>
                        <p className="font-medium text-slate-900 dark:text-white">
                          {exam.mode === 'full' ? 'Full Exam' : exam.subjects[0]}
                        </p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          {new Date(exam.date).toLocaleDateString()} • {Math.round(exam.duration / 60)} mins
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`text-lg font-bold ${
                        exam.overallScore >= 70 ? 'text-green-600 dark:text-green-400' :
                        exam.overallScore >= 50 ? 'text-yellow-600 dark:text-yellow-400' :
                        'text-red-600 dark:text-red-400'
                      }`}>
                        {exam.overallScore}%
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        {exam.totalCorrect}/{exam.totalQuestions}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        <motion.div variants={itemVariants}>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">JAMB Subjects</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {subjects.map((subject) => (
              <Link
                key={subject.id}
                to={`/practice?subject=${subject.id}`}
                className="group"
              >
                <div className="card-hover p-4 text-center">
                  <div className="text-3xl mb-2 group-hover:scale-110 transition-transform">
                    {subject.icon}
                  </div>
                  <p className="font-medium text-slate-900 dark:text-white text-sm leading-tight">
                    {subject.name}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </motion.div>

        <motion.div variants={itemVariants} className="grid sm:grid-cols-2 gap-4">
          <Link to="/analytics" className="group">
            <div className="card-hover p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-purple-100 dark:bg-purple-900/50 flex items-center justify-center">
                  <BarChart2 className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 dark:text-white">Performance Analytics</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400">View detailed performance insights</p>
                </div>
              </div>
            </div>
          </Link>

          {recentExams.length > 0 && (
            <Link to="/review" className="group">
              <div className="card-hover p-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-orange-100 dark:bg-orange-900/50 flex items-center justify-center">
                    <Clock className="w-6 h-6 text-orange-600 dark:text-orange-400" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 dark:text-white">Continue Previous</h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400">Review your last exam</p>
                  </div>
                </div>
              </div>
            </Link>
          )}
        </motion.div>
      </motion.div>
    </div>
  )
}
