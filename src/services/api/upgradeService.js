import { phoneService } from './phoneService'

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

const upgradeOptions = [
  {
    model: 'Galaxy S24 Ultra',
    price: '$1,299',
    releaseDate: '2024',
    strengths: ['Best camera system', 'S Pen included', 'Premium build'],
    score: 95
  },
  {
    model: 'Galaxy S24 Plus',
    price: '$999',
    releaseDate: '2024',
    strengths: ['Large display', 'Great performance', 'Good value'],
    score: 88
  },
  {
    model: 'Galaxy S24',
    price: '$799',
    releaseDate: '2024',
    strengths: ['Compact size', 'Latest features', 'Affordable'],
    score: 85
  },
  {
    model: 'Galaxy Z Fold 5',
    price: '$1,799',
    releaseDate: '2023',
    strengths: ['Foldable display', 'Multitasking', 'Unique form factor'],
    score: 82
  },
  {
    model: 'Galaxy Z Flip 5',
    price: '$999',
    releaseDate: '2023',
    strengths: ['Compact foldable', 'Stylish design', 'Improved hinge'],
    score: 78
  }
]

const calculateScores = (currentModel, priorities, budget) => {
  const budgetRanges = {
    'under-500': { min: 0, max: 500 },
    '500-800': { min: 500, max: 800 },
    '800-1200': { min: 800, max: 1200 },
    'over-1200': { min: 1200, max: 9999 },
    'no-limit': { min: 0, max: 9999 }
  }
  
  const range = budgetRanges[budget]
  
  return upgradeOptions
    .filter(option => option.model !== currentModel)
    .map(option => {
      const price = parseInt(option.price.replace(/[^\d]/g, ''))
      let score = option.score
      
      // Adjust score based on priorities
      if (priorities.includes('camera') && option.model.includes('Ultra')) {
        score += 5
      }
      if (priorities.includes('price') && price < 800) {
        score += 8
      }
      if (priorities.includes('performance') && option.releaseDate === '2024') {
        score += 3
      }
      if (priorities.includes('battery') && option.model.includes('Plus')) {
        score += 4
      }
      
      // Budget compatibility
      if (price < range.min || price > range.max) {
        score -= 15
      }
      
      return {
        ...option,
        score: Math.min(Math.max(score, 0), 100)
      }
    })
    .sort((a, b) => b.score - a.score)
}

const generateTips = (currentModel, priorities, budget) => {
  const tips = []
  
  if (priorities.includes('camera')) {
    tips.push('Consider the Ultra models for the best camera experience')
  }
  
  if (priorities.includes('price')) {
    tips.push('Look for trade-in deals to reduce upgrade costs')
  }
  
  if (budget === 'immediate') {
    tips.push('Check for current promotions and discounts')
  }
  
  tips.push('Wait for seasonal sales like Black Friday for better deals')
  tips.push('Consider certified pre-owned devices for savings')
  tips.push('Compare carrier deals vs unlocked pricing')
  
  return tips.slice(0, 4)
}

export const upgradeService = {
  async getAdvice(formData) {
    await delay(500)
    
    const { currentModel, priorities, budget, timeframe } = formData
    const scoredOptions = calculateScores(currentModel, priorities, budget)
    
    const topRecommendation = scoredOptions[0]
    const alternatives = scoredOptions.slice(1, 4)
    
    const tips = generateTips(currentModel, priorities, budget)
    
    return {
      Id: Date.now(),
      currentModel,
      priorities: priorities.map(p => p.charAt(0).toUpperCase() + p.slice(1)),
      budget: budget.replace('-', ' - $').replace('under', 'Under $').replace('over', 'Over $'),
      timeframe: timeframe.replace('-', ' '),
      topRecommendation: {
        ...topRecommendation,
        reason: `Best match for your ${priorities.join(', ')} priorities`
      },
      alternatives: alternatives.map(alt => ({
        ...alt,
        reason: `Strong alternative with ${alt.strengths.join(', ')}`
      })),
      tips,
      timestamp: new Date().toISOString()
    }
  }
}