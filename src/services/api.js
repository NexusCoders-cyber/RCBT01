import axios from 'axios'

const API_URL = 'https://questions.aloc.com.ng/api/v2'
const ACCESS_TOKEN = 'QB-1e5c5f1553ccd8cd9e11'

const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
    'AccessToken': ACCESS_TOKEN,
  },
  timeout: 30000,
})

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.message)
    return Promise.reject(error)
  }
)

const questionCache = new Map()

const getCacheKey = (subject, count, year, type) => {
  return `${subject}-${count}-${year || 'all'}-${type || 'utme'}`
}

export const alocAPI = {
  async getQuestion(subject, year = null) {
    try {
      let url = `/q/1?subject=${subject}&type=utme`
      if (year) {
        url += `&year=${year}`
      }
      const response = await apiClient.get(url)
      return response.data
    } catch (error) {
      throw new Error(`Failed to fetch question: ${error.message}`)
    }
  },

  async getMultipleQuestions(subject, count = 40, year = null) {
    const cacheKey = getCacheKey(subject, count, year, 'utme')
    
    if (questionCache.has(cacheKey)) {
      const cached = questionCache.get(cacheKey)
      if (Date.now() - cached.timestamp < 5 * 60 * 1000) {
        return cached.data
      }
    }
    
    try {
      let url = `/q/${count}?subject=${subject}&type=utme`
      if (year) {
        url += `&year=${year}`
      }
      
      const response = await apiClient.get(url)
      const questions = response.data.data || response.data || []
      
      const formattedQuestions = Array.isArray(questions) 
        ? questions.map((q, index) => formatQuestion(q, index, subject))
        : [formatQuestion(questions, 0, subject)]
      
      questionCache.set(cacheKey, {
        data: formattedQuestions,
        timestamp: Date.now(),
      })
      
      return formattedQuestions
    } catch (error) {
      throw new Error(`Failed to fetch questions: ${error.message}`)
    }
  },

  async getBulkQuestions(subject, count = 40) {
    try {
      const url = `/m/${count}?subject=${subject}&type=utme`
      const response = await apiClient.get(url)
      let questions = response.data.data || response.data || []
      
      if (!Array.isArray(questions)) {
        questions = [questions]
      }
      
      const formattedQuestions = questions
        .slice(0, count)
        .map((q, index) => formatQuestion(q, index, subject))
      
      return formattedQuestions
    } catch (error) {
      throw new Error(`Failed to fetch bulk questions: ${error.message}`)
    }
  },

  clearCache() {
    questionCache.clear()
  },
}

function formatQuestion(question, index, subject) {
  if (!question) return null
  
  const options = {}
  if (question.option) {
    options.a = question.option.a || ''
    options.b = question.option.b || ''
    options.c = question.option.c || ''
    options.d = question.option.d || ''
    if (question.option.e) {
      options.e = question.option.e
    }
  }
  
  return {
    id: question.id || index,
    index: index,
    question: question.question || '',
    options: options,
    answer: question.answer?.toLowerCase() || '',
    section: question.section || '',
    image: question.image || null,
    solution: question.solution || question.explanation || '',
    examtype: question.examtype || 'utme',
    examyear: question.examyear || '',
    subject: subject,
  }
}

export async function loadQuestionsForExam(subjects) {
  const questionsMap = {}
  
  const promises = subjects.map(async (subject) => {
    const isEnglish = subject.id === 'english'
    const count = isEnglish ? 60 : 40
    
    try {
      let questions = await alocAPI.getMultipleQuestions(subject.id, count)
      
      if (questions.length < count) {
        try {
          const additionalQuestions = await alocAPI.getBulkQuestions(subject.id, count - questions.length)
          questions = [...questions, ...additionalQuestions]
        } catch (e) {
          console.warn(`Could not fetch additional questions for ${subject.name}`)
        }
      }
      
      questionsMap[subject.id] = questions.slice(0, count)
    } catch (error) {
      console.error(`Error loading questions for ${subject.name}:`, error)
      questionsMap[subject.id] = []
    }
  })
  
  await Promise.all(promises)
  return questionsMap
}

export async function loadPracticeQuestions(subject, count = 40, year = null) {
  try {
    let questions = await alocAPI.getMultipleQuestions(subject.id, count, year)
    
    if (questions.length < count) {
      try {
        const bulkQuestions = await alocAPI.getBulkQuestions(subject.id, count)
        const existingIds = new Set(questions.map(q => q.id))
        
        bulkQuestions.forEach(q => {
          if (!existingIds.has(q.id) && questions.length < count) {
            questions.push(q)
          }
        })
      } catch (e) {
        console.warn('Could not fetch additional practice questions')
      }
    }
    
    return questions.slice(0, count)
  } catch (error) {
    console.error(`Error loading practice questions:`, error)
    throw error
  }
}

export default alocAPI
