const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

const calculateHealthScore = (phoneAge, usagePattern, chargingHabits, heatExposure) => {
  let score = 100
  
  // Age factor
  const ageMonths = parseInt(phoneAge)
  score -= Math.min(ageMonths * 2, 40)
  
  // Usage pattern factor
  const usageMultipliers = {
    light: 0.5,
    moderate: 1.0,
    heavy: 1.5,
    gaming: 2.0
  }
  score -= (usageMultipliers[usagePattern] || 1.0) * 10
  
  // Charging habits factor
  const chargingPenalties = {
    overnight: 5,
    frequent: 3,
    depleted: 8,
    wireless: 7
  }
  score -= chargingPenalties[chargingHabits] || 5
  
  // Heat exposure factor
  const heatPenalties = {
    low: 2,
    moderate: 5,
    high: 12
  }
  score -= heatPenalties[heatExposure] || 5
  
  return Math.max(Math.min(Math.round(score), 100), 20)
}

const getHealthStatus = (score) => {
  if (score >= 80) return 'Excellent'
  if (score >= 60) return 'Good'
  if (score >= 40) return 'Fair'
  return 'Poor'
}

const generateRecommendations = (score, phoneAge, usagePattern, chargingHabits, heatExposure) => {
  const recommendations = []
  
  if (score < 60) {
    recommendations.push('Consider replacing your battery at an authorized Samsung service center')
  }
  
  if (chargingHabits === 'overnight') {
    recommendations.push('Avoid overnight charging to extend battery lifespan')
  }
  
  if (chargingHabits === 'depleted') {
    recommendations.push('Try to keep battery level between 20-80% for optimal health')
  }
  
  if (heatExposure === 'high') {
    recommendations.push('Reduce gaming sessions and avoid direct sunlight exposure')
  }
  
  if (usagePattern === 'gaming') {
    recommendations.push('Enable battery saving mode during intensive gaming sessions')
  }
  
  recommendations.push('Use adaptive battery settings in device care')
  recommendations.push('Enable battery protection in Samsung Members app')
  recommendations.push('Consider using original Samsung charger for optimal charging')
  
  return recommendations.slice(0, 4)
}

export const batteryService = {
  async checkHealth(formData) {
    await delay(500)
    
    const { model, phoneAge, usagePattern, chargingHabits, heatExposure } = formData
    const healthScore = calculateHealthScore(phoneAge, usagePattern, chargingHabits, heatExposure)
    const status = getHealthStatus(healthScore)
    const recommendations = generateRecommendations(healthScore, phoneAge, usagePattern, chargingHabits, heatExposure)
    
    return {
      Id: Date.now(),
      model,
      phoneAge: parseInt(phoneAge),
      usagePattern,
      chargingHabits,
      heatExposure,
      healthScore,
      status,
      recommendations,
      timestamp: new Date().toISOString()
    }
  }
}