import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { toast } from 'react-toastify'
import ModelSelector from '@/components/molecules/ModelSelector'
import ConditionSelector from '@/components/molecules/ConditionSelector'
import ResultCard from '@/components/molecules/ResultCard'
import Button from '@/components/atoms/Button'
import Select from '@/components/atoms/Select'
import Card from '@/components/atoms/Card'
import Loading from '@/components/ui/Loading'
import Error from '@/components/ui/Error'
import ApperIcon from '@/components/ApperIcon'
import { tradeInService } from '@/services/api/tradeInService'

const TradeInEstimator = () => {
  const [formData, setFormData] = useState({
    model: '',
    condition: '',
    storage: ''
  })
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  
  const storageOptions = [
    { value: '', label: 'Select storage capacity' },
    { value: '64GB', label: '64GB' },
    { value: '128GB', label: '128GB' },
    { value: '256GB', label: '256GB' },
    { value: '512GB', label: '512GB' },
    { value: '1TB', label: '1TB' }
  ]
  
  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
    setError('')
  }
  
  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!formData.model || !formData.condition || !formData.storage) {
      setError('Please fill in all required fields')
      return
    }
    
    setLoading(true)
    setError('')
    
    try {
      const estimate = await tradeInService.getEstimate(formData)
      setResult(estimate)
      toast.success('Trade-in value estimated successfully!')
    } catch (err) {
      setError('Failed to calculate trade-in value. Please try again.')
      toast.error('Calculation failed')
    } finally {
      setLoading(false)
    }
  }
  
  const handleReset = () => {
    setFormData({ model: '', condition: '', storage: '' })
    setResult(null)
    setError('')
  }
  
  const conditionMultipliers = {
    excellent: 1.0,
    good: 0.8,
    fair: 0.6,
    poor: 0.4
  }
  
  const getConditionColor = (condition) => {
    const colors = {
      excellent: 'text-green-600',
      good: 'text-blue-600',
      fair: 'text-yellow-600',
      poor: 'text-red-600'
    }
    return colors[condition] || 'text-gray-600'
  }
  
  if (error && !result) {
    return (
      <Error
        message="Trade-In Calculation Failed"
        description={error}
        onRetry={() => setError('')}
      />
    )
  }
  
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
            <ApperIcon name="DollarSign" className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Trade-In Value Estimator</h1>
            <p className="text-gray-600">Get AI-powered trade-in estimates for your Samsung device</p>
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
                <h2 className="text-xl font-semibold mb-4">Device Information</h2>
                
                <div className="space-y-4">
                  <ModelSelector
                    value={formData.model}
                    onChange={(e) => handleInputChange('model', e.target.value)}
                    label="Samsung Model"
                  />
                  
                  <Select
                    label="Storage Capacity"
                    options={storageOptions}
                    value={formData.storage}
                    onChange={(e) => handleInputChange('storage', e.target.value)}
                  />
                  
                  <ConditionSelector
                    value={formData.condition}
                    onChange={(value) => handleInputChange('condition', value)}
                    label="Device Condition"
                  />
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
                  disabled={!formData.model || !formData.condition || !formData.storage}
                  className="flex-1"
                >
                  Calculate Trade-In Value
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
              <ResultCard
                title="Estimated Trade-In Value"
                value={`$${result.estimatedValue}`}
                subtitle="USD"
                icon="DollarSign"
                variant="success"
              >
                <div className="mt-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Model:</span>
                    <span className="font-medium">{result.model}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Storage:</span>
                    <span className="font-medium">{result.storage}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Condition:</span>
                    <span className={`font-medium capitalize ${getConditionColor(result.condition)}`}>
                      {result.condition}
                    </span>
                  </div>
                </div>
              </ResultCard>
              
              {result.tips && result.tips.length > 0 && (
                <Card>
                  <h3 className="text-lg font-semibold mb-4 flex items-center">
                    <ApperIcon name="Lightbulb" className="w-5 h-5 text-yellow-500 mr-2" />
                    Resale Tips
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
              )}
              
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-blue-800 text-sm">
                  <strong>Note:</strong> This estimate is based on current market conditions and device specifications. 
                  Actual trade-in values may vary depending on the retailer and specific device condition.
                </p>
              </div>
            </div>
          ) : (
            <Card className="text-center py-12">
              <div className="w-16 h-16 bg-gradient-to-r from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                <ApperIcon name="Calculator" className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Ready to Calculate
              </h3>
              <p className="text-gray-600">
                Fill in your device information to get an AI-powered trade-in estimate.
              </p>
            </Card>
          )}
        </motion.div>
      </div>
    </div>
  )
}

export default TradeInEstimator