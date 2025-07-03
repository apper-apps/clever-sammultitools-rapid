import { phoneService } from './phoneService'

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

const baseValues = {
  'Galaxy S24 Ultra': 850,
  'Galaxy S24 Plus': 650,
  'Galaxy S24': 550,
  'Galaxy S23 Ultra': 750,
  'Galaxy S23 Plus': 550,
  'Galaxy S23': 450,
  'Galaxy Note 20 Ultra': 500,
  'Galaxy Note 20': 400,
  'Galaxy A54': 250,
  'Galaxy A34': 180,
  'Galaxy Z Fold 5': 900,
  'Galaxy Z Flip 5': 450
}

const conditionMultipliers = {
  excellent: 1.0,
  good: 0.8,
  fair: 0.6,
  poor: 0.4
}

const storageMultipliers = {
  '64GB': 0.9,
  '128GB': 1.0,
  '256GB': 1.1,
  '512GB': 1.2,
  '1TB': 1.3
}

const generateTips = (model, condition, storage, value) => {
  const tips = []
  
  if (condition === 'excellent') {
    tips.push('Your device is in excellent condition - consider selling privately for higher value')
  } else if (condition === 'poor') {
    tips.push('Consider getting a screen protector and case for your next device')
  }
  
  if (storage === '1TB' || storage === '512GB') {
    tips.push('High storage capacity adds significant value to your trade-in')
  }
  
  tips.push('Clean your device thoroughly before trade-in inspection')
  tips.push('Include original charger and accessories when possible')
  tips.push('Check multiple retailers for the best trade-in offers')
  tips.push('Consider timing your trade-in with new phone launches for better deals')
  
  return tips.slice(0, 4)
}

export const tradeInService = {
  async getEstimate(formData) {
    await delay(400)
    
    const { model, condition, storage } = formData
    const baseValue = baseValues[model] || 300
    const conditionMultiplier = conditionMultipliers[condition] || 0.8
    const storageMultiplier = storageMultipliers[storage] || 1.0
    
    const estimatedValue = Math.round(baseValue * conditionMultiplier * storageMultiplier)
    const tips = generateTips(model, condition, storage, estimatedValue)
    
    return {
      Id: Date.now(),
      model,
      condition,
      storage,
      estimatedValue,
      tips,
      timestamp: new Date().toISOString()
    }
  }
}