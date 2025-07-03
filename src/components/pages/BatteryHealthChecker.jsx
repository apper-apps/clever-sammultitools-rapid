import React, { useState } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import ApperIcon from "@/components/ApperIcon";
import Select from "@/components/atoms/Select";
import Badge from "@/components/atoms/Badge";
import Card from "@/components/atoms/Card";
import Input from "@/components/atoms/Input";
import Button from "@/components/atoms/Button";
import ModelSelector from "@/components/molecules/ModelSelector";
import ResultCard from "@/components/molecules/ResultCard";
import Loading from "@/components/ui/Loading";
import { batteryService } from "@/services/api/batteryService";

const BatteryHealthChecker = () => {
  const [formData, setFormData] = useState({
    model: '',
    phoneAge: '',
    usagePattern: '',
    chargingHabits: '',
    heatExposure: ''
  })
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  
  const usagePatternOptions = [
    { value: '', label: 'Select usage pattern' },
    { value: 'light', label: 'Light (1-3 hours/day)' },
    { value: 'moderate', label: 'Moderate (3-6 hours/day)' },
    { value: 'heavy', label: 'Heavy (6+ hours/day)' },
    { value: 'gaming', label: 'Gaming/Intensive' }
  ]
  
  const chargingHabitsOptions = [
    { value: '', label: 'Select charging habits' },
    { value: 'overnight', label: 'Overnight charging' },
    { value: 'frequent', label: 'Frequent top-ups' },
    { value: 'depleted', label: 'Charge when depleted' },
    { value: 'wireless', label: 'Mainly wireless charging' }
  ]
  
  const heatExposureOptions = [
    { value: '', label: 'Select heat exposure level' },
    { value: 'low', label: 'Low (Cool environments)' },
    { value: 'moderate', label: 'Moderate (Normal use)' },
    { value: 'high', label: 'High (Gaming, hot climates)' }
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
    
    if (!formData.model || !formData.phoneAge || !formData.usagePattern || !formData.chargingHabits || !formData.heatExposure) {
      setError('Please fill in all required fields')
      return
    }
    
    setLoading(true)
    setError('')
    
    try {
      const healthData = await batteryService.checkHealth(formData)
      setResult(healthData)
      toast.success('Battery health analyzed successfully!')
    } catch (err) {
      setError('Failed to analyze battery health. Please try again.')
      toast.error('Analysis failed')
    } finally {
      setLoading(false)
    }
  }
  
  const handleReset = () => {
    setFormData({
      model: '',
      phoneAge: '',
      usagePattern: '',
      chargingHabits: '',
      heatExposure: ''
    })
    setResult(null)
    setError('')
  }
  
  const getHealthColor = (score) => {
    if (score >= 80) return 'success'
    if (score >= 60) return 'warning'
    return 'error'
  }
  
  const getHealthIcon = (score) => {
    if (score >= 80) return 'Battery'
    if (score >= 60) return 'AlertTriangle'
    return 'BatteryLow'
  }
  
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-lg flex items-center justify-center">
            <ApperIcon name="Battery" className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Battery Health Checker</h1>
            <p className="text-gray-600">AI-powered battery health analysis and replacement recommendations</p>
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
                <h2 className="text-xl font-semibold mb-4">Device & Usage Information</h2>
                
                <div className="space-y-4">
                  <ModelSelector
                    value={formData.model}
                    onChange={(e) => handleInputChange('model', e.target.value)}
                    label="Samsung Model"
                  />
                  
                  <Input
                    label="Phone Age (months)"
                    type="number"
                    min="0"
                    max="120"
                    value={formData.phoneAge}
                    onChange={(e) => handleInputChange('phoneAge', e.target.value)}
                    placeholder="e.g., 24"
                  />
                  
                  <Select
                    label="Usage Pattern"
                    options={usagePatternOptions}
                    value={formData.usagePattern}
                    onChange={(e) => handleInputChange('usagePattern', e.target.value)}
                  />
                  
                  <Select
                    label="Charging Habits"
                    options={chargingHabitsOptions}
                    value={formData.chargingHabits}
                    onChange={(e) => handleInputChange('chargingHabits', e.target.value)}
                  />
                  
                  <Select
                    label="Heat Exposure"
                    options={heatExposureOptions}
                    value={formData.heatExposure}
                    onChange={(e) => handleInputChange('heatExposure', e.target.value)}
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
                  disabled={!formData.model || !formData.phoneAge || !formData.usagePattern || !formData.chargingHabits || !formData.heatExposure}
                  className="flex-1"
                >
                  Analyze Battery Health
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
                title="Battery Health Score"
                value={`${result.healthScore}%`}
                icon={getHealthIcon(result.healthScore)}
                variant={getHealthColor(result.healthScore)}
              >
                <div className="mt-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-600">Health Status:</span>
                    <Badge variant={getHealthColor(result.healthScore)}>
                      {result.status}
                    </Badge>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full transition-all duration-500 ${
                        result.healthScore >= 80 ? 'bg-gradient-to-r from-green-500 to-emerald-500' :
                        result.healthScore >= 60 ? 'bg-gradient-to-r from-yellow-500 to-orange-500' :
                        'bg-gradient-to-r from-red-500 to-red-600'
                      }`}
                      style={{ width: `${result.healthScore}%` }}
                    />
                  </div>
                </div>
              </ResultCard>
              
              {result.recommendations && result.recommendations.length > 0 && (
                <Card>
                  <h3 className="text-lg font-semibold mb-4 flex items-center">
                    <ApperIcon name="Lightbulb" className="w-5 h-5 text-yellow-500 mr-2" />
                    Recommendations
                  </h3>
                  <ul className="space-y-3">
                    {result.recommendations.map((rec, index) => (
                      <li key={index} className="flex items-start space-x-3">
                        <ApperIcon name="CheckCircle" className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-gray-700">{rec}</span>
                      </li>
                    ))}
                  </ul>
                </Card>
              )}
              
              <Card>
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  <ApperIcon name="Info" className="w-5 h-5 text-blue-500 mr-2" />
                  Analysis Details
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Phone Age:</span>
                    <span className="font-medium">{result.phoneAge} months</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Usage Pattern:</span>
                    <span className="font-medium capitalize">{result.usagePattern}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Charging Habits:</span>
                    <span className="font-medium capitalize">{result.chargingHabits}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Heat Exposure:</span>
                    <span className="font-medium capitalize">{result.heatExposure}</span>
                  </div>
                </div>
              </Card>
              
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-blue-800 text-sm">
                  <strong>Note:</strong> This analysis is based on usage patterns and age. 
                  For accurate battery health, use Samsung Members app or visit a Samsung service center.
</p>
              </div>
            </div>
          ) : (
            <Card>
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <ApperIcon name="Battery" className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Ready to Analyze</h3>
                <p className="text-gray-600">
                  Provide your device information to get an AI-powered battery health analysis.
                </p>
              </div>
            </Card>
          )}
        </motion.div>
      </div>
    </div>
  )
}

export default BatteryHealthChecker