import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { 
  Play, Clock, BookOpen, BarChart2, ChevronRight, 
  Target, Award, TrendingUp, Zap, Star, Trophy
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
  hidden: { opacity: 0, y: 30 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: {
      type: 'spring',
      stiffness: 100
    }
  },
}

const floatingVariants = {
  animate: {
    y: [0, -15, 0],
    transition: {
      duration: 3,
      repeat: Infinity,
      ease: "easeInOut"
    }
  }
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

  const getScoreEmoji = (score) => {
    if (score >= 80) return '🏆'
    if (score >= 70) return '🌟'
    if (score >= 50) return '👍'
    return '📚'
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-24 md:pb-8">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-8"
      >
        <motion.div variants={itemVariants} className="text-center mb-12 relative">
          <motion.div
            variants={floatingVariants}
            animate="animate"
            className="absolute top-0 left-1/4 w-20 h-20 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full blur-3xl opacity-50"
          />
          <motion.div
            variants={floatingVariants}
            animate="animate"
            className="absolute top-10 right-1/4 w-32 h-32 bg-gradient-to-br from-blue-400 to-cyan-400 rounded-full blur-3xl opacity-50"
            style={{ animationDelay: '1s' }}
          />
          
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', delay: 0.2 }}
            className="inline-block mb-4"
          >
            <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center shadow-2xl mx-auto rotate-6 hover:rotate-0 transition-transform">
              <Trophy className="w-12 h-12 text-white" />
            </div>
          </motion.div>
          
          <h1 className="text-4xl sm:text-5xl font-extrabold text-white mb-3">
            Welcome to <span className="text-gradient bg-gradient-to-r from-yellow-300 via-pink-300 to-purple-300 bg-clip-text text-transparent">JAMB CBT</span>
          </h1>
          <p className="text-white/90 text-lg sm:text-xl font-medium max-w-2xl mx-auto">
            Master your UTME preparation with our advanced practice platform
          </p>
        </motion.div>

        <motion.div variants={itemVariants}>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { icon: Target, label: 'Practice Sessions', value: totalPractice, color: 'from-blue-500 to-cyan-500' },
              { icon: Award, label: 'Full Exams', value: totalExams, color: 'from-green-500 to-emerald-500' },
              { icon: TrendingUp, label: 'Avg Score', value: `${averageScore}%`, color: 'from-purple-500 to-pink-500' },
              { icon: Zap, label: 'Subjects', value: subjects.length, color: 'from-orange-500 to-red-500' }
            ].map((stat, idx) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.1 }}
                whileHover={{ scale: 1.05, y: -5 }}
                className="card p-5 hover:shadow-2xl transition-all cursor-pointer"
              >
                <div className="flex flex-col items-center gap-2">
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${stat.color} flex items-center justify-center shadow-lg`}>
                    <stat.icon className="w-7 h-7 text-white" />
                  </div>
                  <p className="text-3xl font-bold text-slate-900 dark:text-white">{stat.value}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 text-center font-medium">{stat.label}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.div variants={itemVariants} className="grid sm:grid-cols-2 gap-6">
          <Link to="/practice" className="group">
            <div className="card-hover p-8 h-full relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-400 to-cyan-400 rounded-full blur-3xl opacity-20 group-hover:opacity-30 transition-opacity" />
              
              <div className="relative">
                <div className="flex items-start gap-5 mb-4">
                  <motion.div
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.5 }}
                    className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center shadow-xl"
                  >
                    <BookOpen className="w-8 h-8 text-white" />
                  </motion.div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Start Practice</h3>
                    <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                      Practice individual subjects with customizable settings and track your progress
                    </p>
                  </div>
                </div>
                <div className="flex items-center text-blue-600 dark:text-blue-400 font-semibold group-hover:gap-3 gap-2 transition-all">
                  Begin Practice
                  <ChevronRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
                </div>
              </div>
            </div>
          </Link>

          <Link to="/exam-setup" className="group">
            <div className="card-hover p-8 h-full relative overflow-hidden border-2 border-green-200 dark:border-green-800">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-green-400 to-emerald-400 rounded-full blur-3xl opacity-20 group-hover:opacity-30 transition-opacity" />
              
              <div className="relative">
                <div className="flex items-start gap-5 mb-4">
                  <motion.div
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.5 }}
                    className="w-16 h-16 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center shadow-xl"
                  >
                    <Play className="w-8 h-8 text-white" />
                  </motion.div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-2xl font-bold text-slate-900 dark:text-white">Full Exam Mode</h3>
                      <motion.span
                        animate={{ scale: [1, 1.1, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="px-3 py-1 text-xs font-bold bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-full shadow-lg"
                      >
                        JAMB STYLE
                      </motion.span>
                    </div>
                    <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                      4 subjects, 180 questions, official JAMB format with realistic exam experience
                    </p>
                  </div>
                </div>
                <div className="flex items-center text-green-600 dark:text-green-400 font-semibold group-hover:gap-3 gap-2 transition-all">
                  Start Full Exam
                  <ChevronRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
                </div>
              </div>
            </div>
          </Link>
        </motion.div>

        {recentExams.length > 0 && (
          <motion.div variants={itemVariants}>
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                <Clock className="w-6 h-6" />
                Recent Activity
              </h2>
              <Link to="/analytics" className="text-white/90 hover:text-white text-sm font-semibold hover:underline flex items-center gap-1">
                View All
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="space-y-4">
              {recentExams.map((exam, idx) => (
                <motion.div
                  key={exam.id}
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  whileHover={{ x: 10 }}
                  className="card p-5 hover:shadow-2xl transition-all cursor-pointer"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg
                        ${exam.mode === 'full' 
                          ? 'bg-gradient-to-br from-green-500 to-emerald-600' 
                          : 'bg-gradient-to-br from-blue-500 to-cyan-600'
                        }`}>
                        {exam.mode === 'full' 
                          ? <Award className="w-7 h-7 text-white" />
                          : <BookOpen className="w-7 h-7 text-white" />
                        }
                      </div>
                      <div>
                        <p className="font-bold text-slate-900 dark:text-white text-lg">
                          {exam.mode === 'full' ? 'Full Exam' : exam.subjects[0]}
                        </p>
                        <p className="text-sm text-slate-500 dark:text-slate-400 flex items-center gap-3">
                          <span>{new Date(exam.date).toLocaleDateString()}</span>
                          <span>•</span>
                          <span>{Math.round(exam.duration / 60)} mins</span>
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">{getScoreEmoji(exam.overallScore)}</span>
                        <p className={`text-3xl font-bold ${
                          exam.overallScore >= 70 ? 'text-green-600 dark:text-green-400' :
                          exam.overallScore >= 50 ? 'text-yellow-600 dark:text-yellow-400' :
                          'text-red-600 dark:text-red-400'
                        }`}>
                          {exam.overallScore}%
                        </p>
                      </div>
                      <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">
                        {exam.totalCorrect}/{exam.totalQuestions} correct
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        <motion.div variants={itemVariants}>
          <h2 className="text-2xl font-bold text-white mb-5 flex items-center gap-2">
            <Star className="w-6 h-6" />
            JAMB Subjects
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {subjects.map((subject, idx) => (
              <Link
                key={subject.id}
                to={`/practice?subject=${subject.id}`}
                className="group"
              >
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: idx * 0.05 }}
                  whileHover={{ scale: 1.1, y: -8 }}
                  className="card-hover p-6 text-center relative overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-400/10 to-pink-400/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="relative">
                    <motion.div
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.5 }}
                      className="text-5xl mb-3"
                    >
                      {subject.icon}
                    </motion.div>
                    <p className="font-bold text-slate-900 dark:text-white text-sm leading-tight">
                      {subject.name}
                    </p>
                  </div>
                </motion.div>
              </Link>
            ))}
          </div>
        </motion.div>

        <motion.div variants={itemVariants} className="grid sm:grid-cols-2 gap-6">
          <Link to="/analytics" className="group">
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="card-hover p-6 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/30 dark:to-pink-900/30"
            >
              <div className="flex items-center gap-5">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center shadow-xl">
                  <BarChart2 className="w-8 h-8 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-slate-900 dark:text-white text-lg mb-1">Performance Analytics</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400">View detailed insights and progress</p>
                </div>
                <ChevronRight className="w-6 h-6 text-slate-400 group-hover:text-purple-600 group-hover:translate-x-2 transition-all" />
              </div>
            </motion.div>
          </Link>

          {recentExams.length > 0 && (
            <Link to="/review" className="group">
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="card-hover p-6 bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-900/30 dark:to-red-900/30"
              >
                <div className="flex items-center gap-5">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center shadow-xl">
                    <Clock className="w-8 h-8 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-slate-900 dark:text-white text-lg mb-1">Review Answers</h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400">Check your last exam performance</p>
                  </div>
                  <ChevronRight className="w-6 h-6 text-slate-400 group-hover:text-orange-600 group-hover:translate-x-2 transition-all" />
                </div>
              </motion.div>
            </Link>
          )}
        </motion.div>
      </motion.div>
    </div>
  )
}
