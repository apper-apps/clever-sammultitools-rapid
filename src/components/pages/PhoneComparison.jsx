import { useState } from 'react'
import { motion } from 'framer-motion'
import { toast } from 'react-toastify'
import ModelSelector from '@/components/molecules/ModelSelector'
import Button from '@/components/atoms/Button'
import Card from '@/components/atoms/Card'
import Badge from '@/components/atoms/Badge'
import Loading from '@/components/ui/Loading'
import ApperIcon from '@/components/ApperIcon'
import { comparisonService } from '@/services/api/comparisonService'

const PhoneComparison = () => {
  const [formData, setFormData] = useState({
    model1: '',
    model2: ''
  })
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  
  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
    setError('')
  }
  
  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!formData.model1 || !formData.model2) {
      setError('Please select both phone models')
      return
    }
    
    if (formData.model1 === formData.model2) {
      setError('Please select different phone models')
      return
    }
    
    setLoading(true)
    setError('')
    
    try {
      const comparison = await comparisonService.compare(formData.model1, formData.model2)
      setResult(comparison)
      toast.success('Phone comparison completed!')
    } catch (err) {
      setError('Failed to compare phones. Please try again.')
      toast.error('Comparison failed')
    } finally {
      setLoading(false)
    }
  }
  
  const handleReset = () => {
    setFormData({ model1: '', model2: '' })
    setResult(null)
    setError('')
  }
  
  const handleSwap = () => {
    setFormData(prev => ({
      model1: prev.model2,
      model2: prev.model1
    }))
  }
  
  const getComparisonIcon = (winner) => {
    if (winner === 'tie') return 'Equal'
    if (winner === 'model1') return 'ArrowLeft'
    return 'ArrowRight'
  }
  
  const getComparisonColor = (winner) => {
    if (winner === 'tie') return 'text-gray-500'
    if (winner === 'model1') return 'text-blue-600'
    return 'text-green-600'
  }
  
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-violet-600 rounded-lg flex items-center justify-center">
            <ApperIcon name="GitCompare" className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Phone Comparison Tool</h1>
            <p className="text-gray-600">Compare Samsung models side-by-side with AI-generated insights</p>
          </div>
        </div>
      </motion.div>
      
      {/* Selection Form */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mb-8"
      >
        <Card>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <ModelSelector
                  value={formData.model1}
                  onChange={(e) => handleInputChange('model1', e.target.value)}
                  label="First Phone"
                />
              </div>
              
              <div className="flex items-center justify-center lg:justify-start">
                <Button
                  type="button"
                  variant="ghost"
                  icon="ArrowLeftRight"
                  onClick={handleSwap}
                  disabled={!formData.model1 || !formData.model2}
                  className="lg:mt-7"
                >
                  Swap
                </Button>
              </div>
              
              <div className="lg:col-start-2">
                <ModelSelector
                  value={formData.model2}
                  onChange={(e) => handleInputChange('model2', e.target.value)}
                  label="Second Phone"
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
                disabled={!formData.model1 || !formData.model2}
                className="flex-1"
              >
                Compare Phones
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
      {loading ? (
        <Loading type="skeleton" rows={3} />
      ) : result ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="space-y-8"
        >
          {/* Header Comparison */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <ApperIcon name="Smartphone" className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-blue-600 mb-2">{result.model1.name}</h3>
              <p className="text-sm text-gray-600">{result.model1.releaseYear}</p>
            </Card>
            
            <Card className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                <ApperIcon name="Versus" className="w-8 h-8 text-gray-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-600 mb-2">VS</h3>
              <p className="text-sm text-gray-500">AI Comparison</p>
            </Card>
            
            <Card className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <ApperIcon name="Smartphone" className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-green-600 mb-2">{result.model2.name}</h3>
              <p className="text-sm text-gray-600">{result.model2.releaseYear}</p>
            </Card>
          </div>
          
          {/* Detailed Comparison */}
          <Card>
            <h3 className="text-xl font-semibold mb-6 flex items-center">
              <ApperIcon name="BarChart3" className="w-5 h-5 text-blue-500 mr-2" />
              Detailed Comparison
            </h3>
            
            <div className="space-y-6">
              {result.categories.map((category, index) => (
                <div key={index} className="border-b border-gray-200 pb-6 last:border-b-0">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-lg font-medium text-gray-900">{category.name}</h4>
                    <Badge variant={category.winner === 'tie' ? 'default' : 'primary'}>
                      {category.winner === 'tie' ? 'Tie' : 
                       category.winner === 'model1' ? result.model1.name : result.model2.name}
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                      <span className="text-sm font-medium text-blue-900">{result.model1.name}</span>
                      <span className="text-sm text-blue-700">{category.model1Value}</span>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                      <span className="text-sm font-medium text-green-900">{result.model2.name}</span>
                      <span className="text-sm text-green-700">{category.model2Value}</span>
                    </div>
                  </div>
                  
                  {category.notes && (
                    <p className="text-sm text-gray-600 mt-2">{category.notes}</p>
                  )}
                </div>
              ))}
            </div>
          </Card>
          
          {/* AI Summary */}
          <Card>
            <h3 className="text-xl font-semibold mb-4 flex items-center">
              <ApperIcon name="Brain" className="w-5 h-5 text-purple-500 mr-2" />
              AI Summary & Recommendations
            </h3>
            
            <div className="space-y-4">
              <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg p-4">
                <h4 className="font-semibold text-purple-900 mb-2">Overall Winner</h4>
                <p className="text-purple-800">{result.summary.winner}</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-blue-50 rounded-lg p-4">
                  <h4 className="font-semibold text-blue-900 mb-2">{result.model1.name} Strengths</h4>
                  <ul className="text-sm text-blue-800 space-y-1">
                    {result.summary.model1Strengths.map((strength, index) => (
                      <li key={index} className="flex items-start">
                        <ApperIcon name="Plus" className="w-3 h-3 text-blue-600 mt-0.5 mr-2 flex-shrink-0" />
                        {strength}
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div className="bg-green-50 rounded-lg p-4">
                  <h4 className="font-semibold text-green-900 mb-2">{result.model2.name} Strengths</h4>
                  <ul className="text-sm text-green-800 space-y-1">
                    {result.summary.model2Strengths.map((strength, index) => (
                      <li key={index} className="flex items-start">
                        <ApperIcon name="Plus" className="w-3 h-3 text-green-600 mt-0.5 mr-2 flex-shrink-0" />
                        {strength}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 mb-2">Recommendation</h4>
                <p className="text-gray-800">{result.summary.recommendation}</p>
              </div>
            </div>
          </Card>
        </motion.div>
      ) : (
        <Card className="text-center py-12">
          <div className="w-16 h-16 bg-gradient-to-r from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
            <ApperIcon name="GitCompare" className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Ready to Compare
          </h3>
          <p className="text-gray-600">
            Select two Samsung models to get an AI-powered comparison with detailed insights.
          </p>
        </Card>
      )}
    </div>
  )
}

export default PhoneComparison