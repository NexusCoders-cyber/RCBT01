import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { 
  ArrowLeft, TrendingUp, Award, Target, Clock,
  BarChart2, Calendar, BookOpen, Zap, Star
} from 'lucide-react'
import { 
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Area, AreaChart,
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis
} from 'recharts'
import useStore from '../store/useStore'

const COLORS = ['#667eea', '#764ba2', '#f093fb', '#4facfe', '#00f2fe', '#43e97b', '#fa709a', '#fee140']
const GRADE_COLORS = {
  excellent: '#10b981',
  good: '#3b82f6',
  average: '#f59e0b',
  poor: '#ef4444'
}

export default function Analytics() {
  const { practiceHistory, examHistory, subjects } = useStore()

  const allHistory = useMemo(() => {
    return [...practiceHistory, ...examHistory]
      .sort((a, b) => new Date(a.date) - new Date(b.date))
  }, [practiceHistory, examHistory])

  const stats = useMemo(() => {
    if (allHistory.length === 0) {
      return {
        totalSessions: 0,
        averageScore: 0,
        bestScore: 0,
        totalTime: 0,
        totalQuestions: 0,
        improvement: 0,
        consistency: 0,
        grade: 'N/A'
      }
    }

    const scores = allHistory.map(h => h.overallScore)
    const totalTime = allHistory.reduce((sum, h) => sum + (h.duration || 0), 0)
    const totalQuestions = allHistory.reduce((sum, h) => sum + (h.totalQuestions || 0), 0)
    
    const recentScores = scores.slice(-5)
    const oldScores = scores.slice(0, Math.max(1, Math.floor(scores.length / 2)))
    const recentAvg = recentScores.reduce((a, b) => a + b, 0) / recentScores.length
    const oldAvg = oldScores.reduce((a, b) => a + b, 0) / oldScores.length
    const improvement = recentAvg - oldAvg

    const avgScore = Math.round(scores.reduce((a, b) => a + b, 0) / scores.length)
    const variance = scores.reduce((sum, score) => sum + Math.pow(score - avgScore, 2), 0) / scores.length
    const consistency = Math.max(0, 100 - Math.sqrt(variance))

    let grade = 'Poor'
    if (avgScore >= 80) grade = 'Excellent'
    else if (avgScore >= 70) grade = 'Good'
    else if (avgScore >= 50) grade = 'Average'

    return {
      totalSessions: allHistory.length,
      averageScore: avgScore,
      bestScore: Math.max(...scores),
      totalTime: Math.round(totalTime / 60),
      totalQuestions,
      improvement: Math.round(improvement),
      consistency: Math.round(consistency),
      grade
    }
  }, [allHistory])

  const progressData = useMemo(() => {
    return allHistory.slice(-15).map((h, idx) => ({
      name: `#${idx + 1}`,
      score: h.overallScore,
      date: new Date(h.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      avgScore: stats.averageScore
    }))
  }, [allHistory, stats.averageScore])

  const subjectPerformance = useMemo(() => {
    const subjectScores = {}
    
    allHistory.forEach(h => {
      if (h.subjectResults) {
        Object.entries(h.subjectResults).forEach(([id, data]) => {
          if (!subjectScores[id]) {
            subjectScores[id] = { 
              name: data.name, 
              scores: [], 
              total: 0, 
              correct: 0,
              attempts: 0 
            }
          }
          subjectScores[id].scores.push(data.score)
          subjectScores[id].total += data.total
          subjectScores[id].correct += data.correct
          subjectScores[id].attempts += 1
        })
      }
    })

    return Object.entries(subjectScores)
      .map(([id, data]) => ({
        id,
        name: data.name.length > 15 ? data.name.substring(0, 15) + '...' : data.name,
        fullName: data.name,
        score: Math.round(data.scores.reduce((a, b) => a + b, 0) / data.scores.length),
        attempts: data.attempts,
        accuracy: data.total > 0 ? Math.round((data.correct / data.total) * 100) : 0,
      }))
      .sort((a, b) => b.score - a.score)
  }, [allHistory])

  const radarData = useMemo(() => {
    const top6Subjects = subjectPerformance.slice(0, 6)
    return top6Subjects.map(s => ({
      subject: s.name,
      score: s.score,
      fullMark: 100
    }))
  }, [subjectPerformance])

  const scoreDistribution = useMemo(() => {
    const ranges = [
      { name: '0-25', min: 0, max: 25, count: 0, color: '#ef4444' },
      { name: '26-50', min: 26, max: 50, count: 0, color: '#f59e0b' },
      { name: '51-70', min: 51, max: 70, count: 0, color: '#3b82f6' },
      { name: '71-100', min: 71, max: 100, count: 0, color: '#10b981' }
    ]

    allHistory.forEach(h => {
      const range = ranges.find(r => h.overallScore >= r.min && h.overallScore <= r.max)
      if (range) range.count++
    })

    return ranges.filter(r => r.count > 0)
  }, [allHistory])

  const weeklyProgress = useMemo(() => {
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date()
      date.setDate(date.getDate() - (6 - i))
      return {
        date: date.toLocaleDateString('en-US', { weekday: 'short' }),
        sessions: 0,
        avgScore: 0,
        scores: []
      }
    })

    allHistory.forEach(h => {
      const historyDate = new Date(h.date)
      const daysDiff = Math.floor((Date.now() - historyDate) / (1000 * 60 * 60 * 24))
      if (daysDiff < 7) {
        const dayIndex = 6 - daysDiff
        if (dayIndex >= 0 && dayIndex < 7) {
          last7Days[dayIndex].sessions++
          last7Days[dayIndex].scores.push(h.overallScore)
        }
      }
    })

    return last7Days.map(day => ({
      ...day,
      avgScore: day.scores.length > 0 
        ? Math.round(day.scores.reduce((a, b) => a + b, 0) / day.scores.length)
        : 0
    }))
  }, [allHistory])

  if (allHistory.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-24 md:pb-8">
        <div className="flex items-center gap-4 mb-8">
          <Link
            to="/"
            className="p-2 rounded-lg hover:bg-white/10 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-white" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-white">Performance Analytics</h1>
            <p className="text-white/70">Track your progress over time</p>
          </div>
        </div>

        <div className="card p-12 text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring' }}
            className="w-20 h-20 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center mx-auto mb-4"
          >
            <BarChart2 className="w-10 h-10 text-white" />
          </motion.div>
          <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">No Data Yet</h3>
          <p className="text-slate-600 dark:text-slate-400 mb-6">
            Complete some practice sessions or exams to see your analytics
          </p>
          <Link to="/practice" className="btn-primary inline-flex items-center gap-2">
            <BookOpen className="w-5 h-5" />
            Start Practicing
          </Link>
        </div>
      </div>
    )
  }

  const getGradeColor = (grade) => {
    switch(grade.toLowerCase()) {
      case 'excellent': return 'from-green-500 to-emerald-600'
      case 'good': return 'from-blue-500 to-indigo-600'
      case 'average': return 'from-yellow-500 to-orange-600'
      default: return 'from-red-500 to-rose-600'
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-24 md:pb-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        <div className="flex items-center gap-4">
          <Link
            to="/"
            className="p-2 rounded-lg hover:bg-white/10 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-white" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-white">Performance Analytics</h1>
            <p className="text-white/70">Track your progress and insights</p>
          </div>
        </div>

        <div className="card p-6 bg-gradient-to-br from-purple-600 to-pink-600 text-white border-0">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-3xl font-bold mb-2">Overall Performance</h2>
              <p className="text-white/80">Your learning journey at a glance</p>
            </div>
            <div className="text-right">
              <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r ${getGradeColor(stats.grade)} shadow-lg`}>
                <Star className="w-5 h-5" />
                <span className="font-bold text-lg">{stats.grade}</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center">
                  <Target className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-3xl font-bold">{stats.totalSessions}</p>
                  <p className="text-sm text-white/70">Sessions</p>
                </div>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center">
                  <TrendingUp className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-3xl font-bold">{stats.averageScore}%</p>
                  <p className="text-sm text-white/70">Average</p>
                </div>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center">
                  <Award className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-3xl font-bold">{stats.bestScore}%</p>
                  <p className="text-sm text-white/70">Best Score</p>
                </div>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center">
                  <Zap className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-3xl font-bold">{stats.consistency}%</p>
                  <p className="text-sm text-white/70">Consistency</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          <div className="card p-6">
            <h3 className="font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-purple-600" />
              Score Progression
            </h3>
            <ResponsiveContainer width="100%" height={280}>
              <AreaChart data={progressData}>
                <defs>
                  <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#667eea" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#764ba2" stopOpacity={0.1}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                <XAxis 
                  dataKey="date" 
                  tick={{ fontSize: 11, fill: '#64748b' }}
                  stroke="#94a3b8"
                />
                <YAxis 
                  domain={[0, 100]} 
                  tick={{ fontSize: 11, fill: '#64748b' }}
                  stroke="#94a3b8"
                />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    border: 'none',
                    borderRadius: '12px',
                    boxShadow: '0 10px 30px rgba(0,0,0,0.1)'
                  }}
                />
                <Area 
                  type="monotone" 
                  dataKey="score" 
                  stroke="#667eea"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#colorScore)"
                />
                <Line 
                  type="monotone" 
                  dataKey="avgScore" 
                  stroke="#f093fb"
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  dot={false}
                />
              </AreaChart>
            </ResponsiveContainer>
            <div className="flex items-center justify-center gap-4 mt-4 text-xs">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-gradient-to-r from-purple-600 to-pink-600"></div>
                <span className="text-slate-600 dark:text-slate-400">Your Score</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-0.5 bg-pink-400" style={{borderTop: '2px dashed'}}></div>
                <span className="text-slate-600 dark:text-slate-400">Average</span>
              </div>
            </div>
          </div>

          <div className="card p-6">
            <h3 className="font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-purple-600" />
              Weekly Activity
            </h3>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={weeklyProgress}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                <XAxis 
                  dataKey="date" 
                  tick={{ fontSize: 11, fill: '#64748b' }}
                  stroke="#94a3b8"
                />
                <YAxis 
                  yAxisId="left"
                  tick={{ fontSize: 11, fill: '#64748b' }}
                  stroke="#94a3b8"
                />
                <YAxis 
                  yAxisId="right"
                  orientation="right"
                  tick={{ fontSize: 11, fill: '#64748b' }}
                  stroke="#94a3b8"
                />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    border: 'none',
                    borderRadius: '12px',
                    boxShadow: '0 10px 30px rgba(0,0,0,0.1)'
                  }}
                />
                <Bar 
                  yAxisId="left"
                  dataKey="sessions" 
                  fill="url(#colorSessions)" 
                  radius={[8, 8, 0, 0]}
                  name="Sessions"
                />
                <Bar 
                  yAxisId="right"
                  dataKey="avgScore" 
                  fill="url(#colorAvg)" 
                  radius={[8, 8, 0, 0]}
                  name="Avg Score"
                />
                <defs>
                  <linearGradient id="colorSessions" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#667eea" stopOpacity={1}/>
                    <stop offset="95%" stopColor="#764ba2" stopOpacity={0.8}/>
                  </linearGradient>
                  <linearGradient id="colorAvg" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f093fb" stopOpacity={1}/>
                    <stop offset="95%" stopColor="#f5576c" stopOpacity={0.8}/>
                  </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {radarData.length > 0 && (
          <div className="grid lg:grid-cols-2 gap-6">
            <div className="card p-6">
              <h3 className="font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                <BarChart2 className="w-5 h-5 text-purple-600" />
                Subject Strengths
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <RadarChart data={radarData}>
                  <PolarGrid stroke="#cbd5e1" />
                  <PolarAngleAxis 
                    dataKey="subject" 
                    tick={{ fontSize: 11, fill: '#64748b' }}
                  />
                  <PolarRadiusAxis 
                    angle={90} 
                    domain={[0, 100]}
                    tick={{ fontSize: 11, fill: '#64748b' }}
                  />
                  <Radar 
                    name="Score" 
                    dataKey="score" 
                    stroke="#667eea" 
                    fill="#667eea" 
                    fillOpacity={0.6}
                    strokeWidth={2}
                  />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: 'rgba(255, 255, 255, 0.95)',
                      border: 'none',
                      borderRadius: '12px',
                      boxShadow: '0 10px 30px rgba(0,0,0,0.1)'
                    }}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>

            <div className="card p-6">
              <h3 className="font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                <Target className="w-5 h-5 text-purple-600" />
                Score Distribution
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={scoreDistribution}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={100}
                    innerRadius={60}
                    paddingAngle={5}
                    dataKey="count"
                  >
                    {scoreDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: 'rgba(255, 255, 255, 0.95)',
                      border: 'none',
                      borderRadius: '12px',
                      boxShadow: '0 10px 30px rgba(0,0,0,0.1)'
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {subjectPerformance.length > 0 && (
          <div className="card p-6">
            <h3 className="font-semibold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-purple-600" />
              Subject Performance Details
            </h3>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {subjectPerformance.map((subject, idx) => (
                <motion.div
                  key={subject.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="p-4 rounded-2xl bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border border-purple-100 dark:border-purple-800"
                >
                  <div className="flex items-start justify-between mb-3">
                    <h4 className="font-semibold text-slate-900 dark:text-white">{subject.fullName}</h4>
                    <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                      subject.score >= 70 ? 'bg-green-500' :
                      subject.score >= 50 ? 'bg-yellow-500' : 'bg-red-500'
                    } text-white`}>
                      {subject.score}%
                    </span>
                  </div>
                  <div className="h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden mb-3">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${subject.score}%` }}
                      transition={{ duration: 1, delay: idx * 0.1 }}
                      className={`h-full rounded-full bg-gradient-to-r ${
                        subject.score >= 70 ? 'from-green-500 to-emerald-600' :
                        subject.score >= 50 ? 'from-yellow-500 to-orange-600' :
                        'from-red-500 to-rose-600'
                      }`}
                    />
                  </div>
                  <div className="flex justify-between text-sm text-slate-600 dark:text-slate-400">
                    <span>{subject.attempts} attempts</span>
                    <span>{subject.accuracy}% accuracy</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        <div className="card p-6">
          <h3 className="font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
            <Clock className="w-5 h-5 text-purple-600" />
            Recent Sessions
          </h3>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {allHistory.slice().reverse().slice(0, 10).map((session, idx) => (
              <motion.div
                key={session.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="p-4 rounded-2xl bg-gradient-to-r from-slate-50 to-purple-50 dark:from-slate-800 dark:to-purple-900/20 flex items-center justify-between hover:shadow-lg transition-all"
              >
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                    session.mode === 'full' 
                      ? 'bg-gradient-to-br from-green-500 to-emerald-600' 
                      : 'bg-gradient-to-br from-purple-500 to-pink-600'
                  } shadow-lg`}>
                    {session.mode === 'full' 
                      ? <Award className="w-6 h-6 text-white" />
                      : <BookOpen className="w-6 h-6 text-white" />
                    }
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900 dark:text-white">
                      {session.mode === 'full' ? 'Full Exam' : session.subjects?.[0] || 'Practice'}
                    </p>
                    <p className="text-sm text-slate-500 dark:text-slate-400 flex items-center gap-3">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {new Date(session.date).toLocaleDateString()}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {Math.round(session.duration / 60)}m
                      </span>
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`text-2xl font-bold ${
                    session.overallScore >= 70 ? 'text-green-600 dark:text-green-400' :
                    session.overallScore >= 50 ? 'text-yellow-600 dark:text-yellow-400' :
                    'text-red-600 dark:text-red-400'
                  }`}>
                    {session.overallScore}%
                  </p>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    {session.totalCorrect}/{session.totalQuestions}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  )
}
