import { useState } from 'react'
import { motion } from 'framer-motion'
import { toast } from 'react-toastify'
import ModelSelector from '@/components/molecules/ModelSelector'
import Button from '@/components/atoms/Button'
import Card from '@/components/atoms/Card'
import Badge from '@/components/atoms/Badge'
import Loading from '@/components/ui/Loading'
import ApperIcon from '@/components/ApperIcon'
import { upgradeService } from '@/services/api/upgradeService'

const UpgradeAdvisor = () => {
  const [formData, setFormData] = useState({
    currentModel: '',
    priorities: [],
    budget: '',
    timeframe: ''
  })
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  
  const priorityOptions = [
    { id: 'camera', label: 'Camera Quality', icon: 'Camera' },
    { id: 'performance', label: 'Performance', icon: 'Zap' },
    { id: 'battery', label: 'Battery Life', icon: 'Battery' },
    { id: 'display', label: 'Display Quality', icon: 'Monitor' },
    { id: 'storage', label: 'Storage Space', icon: 'HardDrive' },
    { id: 'price', label: 'Price/Value', icon: 'DollarSign' }
  ]
  
  const budgetOptions = [
    { value: '', label: 'Select budget range' },
    { value: 'under-500', label: 'Under $500' },
    { value: '500-800', label: '$500 - $800' },
    { value: '800-1200', label: '$800 - $1,200' },
    { value: 'over-1200', label: 'Over $1,200' },
    { value: 'no-limit', label: 'No Budget Limit' }
  ]
  
  const timeframeOptions = [
    { value: '', label: 'Select timeframe' },
    { value: 'immediate', label: 'Immediate (Now)' },
    { value: '3-months', label: 'Within 3 months' },
    { value: '6-months', label: 'Within 6 months' },
    { value: '1-year', label: 'Within 1 year' }
  ]
  
  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
    setError('')
  }
  
  const handlePriorityToggle = (priorityId) => {
    setFormData(prev => ({
      ...prev,
      priorities: prev.priorities.includes(priorityId)
        ? prev.priorities.filter(p => p !== priorityId)
        : [...prev.priorities, priorityId]
    }))
  }
  
  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!formData.currentModel || formData.priorities.length === 0 || !formData.budget || !formData.timeframe) {
      setError('Please fill in all required fields and select at least one priority')
      return
    }
    
    setLoading(true)
    setError('')
    
    try {
      const advice = await upgradeService.getAdvice(formData)
      setResult(advice)
      toast.success('Upgrade advice generated!')
    } catch (err) {
      setError('Failed to generate upgrade advice. Please try again.')
      toast.error('Analysis failed')
    } finally {
      setLoading(false)
    }
  }
  
  const handleReset = () => {
    setFormData({
      currentModel: '',
      priorities: [],
      budget: '',
      timeframe: ''
    })
    setResult(null)
    setError('')
  }
  
  const getScoreColor = (score) => {
    if (score >= 90) return 'success'
    if (score >= 70) return 'info'
    if (score >= 50) return 'warning'
    return 'default'
  }
  
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-600 rounded-lg flex items-center justify-center">
            <ApperIcon name="TrendingUp" className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Upgrade Advisor</h1>
            <p className="text-gray-600">Get personalized Samsung upgrade recommendations based on your priorities</p>
          </div>
        </div>
      </motion.div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Input Form */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <h2 className="text-xl font-semibold mb-4">Current Device & Preferences</h2>
                
                <div className="space-y-6">
                  <ModelSelector
                    value={formData.currentModel}
                    onChange={(e) => handleInputChange('currentModel', e.target.value)}
                    label="Current Samsung Model"
                  />
                  
                  <div>
                    <label className="block text-sm font-medium text-secondary mb-3">
                      What's most important to you? (Select all that apply)
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      {priorityOptions.map((priority) => (
                        <button
                          key={priority.id}
                          type="button"
                          onClick={() => handlePriorityToggle(priority.id)}
                          className={`flex items-center space-x-2 p-3 rounded-lg border-2 transition-all duration-200 ${
                            formData.priorities.includes(priority.id)
                              ? 'border-primary bg-primary/10 text-primary'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <ApperIcon name={priority.icon} className="w-4 h-4" />
                          <span className="text-sm font-medium">{priority.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-secondary mb-2">
                      Budget Range
                    </label>
                    <select
                      value={formData.budget}
                      onChange={(e) => handleInputChange('budget', e.target.value)}
                      className="form-select"
                    >
                      {budgetOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-secondary mb-2">
                      Upgrade Timeframe
                    </label>
                    <select
                      value={formData.timeframe}
                      onChange={(e) => handleInputChange('timeframe', e.target.value)}
                      className="form-select"
                    >
                      {timeframeOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
              
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <p className="text-red-600 text-sm">{error}</p>
                </div>
              )}
              
              <div className="flex space-x-4">
                <Button
                  type="submit"
                  loading={loading}
                  disabled={!formData.currentModel || formData.priorities.length === 0 || !formData.budget || !formData.timeframe}
                  className="flex-1"
                >
                  Get Upgrade Advice
                </Button>
                <Button
                  type="button"
                  variant="secondary"
                  onClick={handleReset}
                >
                  Reset
                </Button>
              </div>
            </form>
          </Card>
        </motion.div>
        
        {/* Results */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          {loading ? (
            <Loading type="skeleton" rows={1} />
          ) : result ? (
            <div className="space-y-6">
              {/* Top Recommendation */}
              <Card className="bg-gradient-to-r from-orange-50 to-red-50 border-orange-200">
                <div className="flex items-start space-x-4">
                  <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-red-600 rounded-lg flex items-center justify-center flex-shrink-0">
                    <ApperIcon name="Award" className="w-8 h-8 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <h3 className="text-lg font-semibold text-orange-900">
                        {result.topRecommendation.model}
                      </h3>
                      <Badge variant="warning">
                        {result.topRecommendation.score}% Match
                      </Badge>
                    </div>
                    <p className="text-orange-800 text-sm mb-3">
                      {result.topRecommendation.reason}
                    </p>
                    <div className="flex items-center space-x-4 text-sm">
                      <span className="text-orange-700">
                        Price: {result.topRecommendation.price}
                      </span>
                      <span className="text-orange-700">
                        Release: {result.topRecommendation.releaseDate}
                      </span>
                    </div>
                  </div>
                </div>
              </Card>
              
              {/* Other Recommendations */}
              <Card>
                <h3 className="text-lg font-semibold mb-4">Other Recommendations</h3>
                <div className="space-y-4">
                  {result.alternatives.map((alt, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <h4 className="font-medium text-gray-900">{alt.model}</h4>
                          <Badge variant={getScoreColor(alt.score)} size="sm">
                            {alt.score}%
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600">{alt.reason}</p>
                      </div>
                      <span className="text-sm font-medium text-gray-700 ml-4">
                        {alt.price}
                      </span>
                    </div>
                  ))}
                </div>
              </Card>
              
              {/* Analysis Details */}
              <Card>
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  <ApperIcon name="BarChart3" className="w-5 h-5 text-blue-500 mr-2" />
                  Analysis Details
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Current Model:</span>
                    <span className="font-medium">{result.currentModel}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Priorities:</span>
                    <div className="flex flex-wrap gap-1">
                      {result.priorities.map((priority, index) => (
                        <Badge key={index} variant="info" size="sm">
                          {priority}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Budget:</span>
                    <span className="font-medium">{result.budget}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Timeframe:</span>
                    <span className="font-medium">{result.timeframe}</span>
                  </div>
                </div>
              </Card>
              
              {/* Additional Tips */}
              <Card>
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  <ApperIcon name="Lightbulb" className="w-5 h-5 text-yellow-500 mr-2" />
                  Upgrade Tips
                </h3>
                <ul className="space-y-2">
                  {result.tips.map((tip, index) => (
                    <li key={index} className="flex items-start space-x-2">
                      <ApperIcon name="CheckCircle" className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-gray-700">{tip}</span>
                    </li>
                  ))}
                </ul>
              </Card>
            </div>
          ) : (
            <Card className="text-center py-12">
              <div className="w-16 h-16 bg-gradient-to-r from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                <ApperIcon name="TrendingUp" className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Ready to Advise
              </h3>
              <p className="text-gray-600">
                Tell us about your current device and preferences to get personalized upgrade recommendations.
              </p>
            </Card>
          )}
        </motion.div>
      </div>
    </div>
  )
}

export default UpgradeAdvisor