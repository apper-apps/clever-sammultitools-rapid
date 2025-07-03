import { useState } from 'react'
import { motion } from 'framer-motion'
import { toast } from 'react-toastify'
import ModelSelector from '@/components/molecules/ModelSelector'
import ResultCard from '@/components/molecules/ResultCard'
import Button from '@/components/atoms/Button'
import Input from '@/components/atoms/Input'
import Card from '@/components/atoms/Card'
import Badge from '@/components/atoms/Badge'
import Loading from '@/components/ui/Loading'
import ApperIcon from '@/components/ApperIcon'
import { firmwareService } from '@/services/api/firmwareService'

const FirmwareChecker = () => {
  const [formData, setFormData] = useState({
    model: '',
    csc: '',
    currentFirmware: ''
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
    
    if (!formData.model || !formData.csc) {
      setError('Please fill in all required fields')
      return
    }
    
    setLoading(true)
    setError('')
    
    try {
      const firmwareData = await firmwareService.checkCompatibility(formData)
      setResult(firmwareData)
      toast.success('Firmware compatibility checked!')
    } catch (err) {
      setError('Failed to check firmware compatibility. Please try again.')
      toast.error('Check failed')
    } finally {
      setLoading(false)
    }
  }
  
  const handleReset = () => {
    setFormData({
      model: '',
      csc: '',
      currentFirmware: ''
    })
    setResult(null)
    setError('')
  }
  
  const getRiskColor = (risk) => {
    switch (risk) {
      case 'low': return 'success'
      case 'medium': return 'warning'
      case 'high': return 'error'
      default: return 'default'
    }
  }
  
  const getRiskIcon = (risk) => {
    switch (risk) {
      case 'low': return 'CheckCircle'
      case 'medium': return 'AlertTriangle'
      case 'high': return 'XCircle'
      default: return 'Info'
    }
  }
  
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-blue-600 rounded-lg flex items-center justify-center">
            <ApperIcon name="Shield" className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Firmware Compatibility Checker</h1>
            <p className="text-gray-600">Check firmware compatibility and get update risk assessments</p>
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
                  
                  <Input
                    label="CSC Code"
                    value={formData.csc}
                    onChange={(e) => handleInputChange('csc', e.target.value)}
                    placeholder="e.g., XAA, DBT, BTU"
                    helper="Your device's CSC (Country Specific Code)"
                  />
                  
                  <Input
                    label="Current Firmware (Optional)"
                    value={formData.currentFirmware}
                    onChange={(e) => handleInputChange('currentFirmware', e.target.value)}
                    placeholder="e.g., A546EXXU3AXA1"
                    helper="Current firmware version for detailed analysis"
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
                  disabled={!formData.model || !formData.csc}
                  className="flex-1"
                >
                  Check Compatibility
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
              {/* Latest Firmware */}
              <ResultCard
                title="Latest Compatible Firmware"
                value={result.latestFirmware}
                icon="Download"
                variant="info"
              >
                <div className="mt-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Android Version:</span>
                    <span className="font-medium">{result.androidVersion}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">One UI Version:</span>
                    <span className="font-medium">{result.oneUIVersion}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Release Date:</span>
                    <span className="font-medium">{result.releaseDate}</span>
                  </div>
                </div>
              </ResultCard>
              
              {/* Update Risk */}
              <ResultCard
                title="Update Risk Assessment"
                value={result.riskLevel.toUpperCase()}
                icon={getRiskIcon(result.riskLevel)}
                variant={getRiskColor(result.riskLevel)}
              >
                <div className="mt-4">
                  <p className="text-sm text-gray-700 mb-3">{result.riskDescription}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Risk Level:</span>
                    <Badge variant={getRiskColor(result.riskLevel)}>
                      {result.riskLevel} Risk
                    </Badge>
                  </div>
                </div>
              </ResultCard>
              
              {/* Compatibility Details */}
              <Card>
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  <ApperIcon name="Info" className="w-5 h-5 text-blue-500 mr-2" />
                  Compatibility Details
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Model:</span>
                    <span className="font-medium">{result.model}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">CSC:</span>
                    <span className="font-medium">{result.csc}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Region:</span>
                    <span className="font-medium">{result.region}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Bootloader:</span>
                    <Badge variant={result.bootloaderLocked ? 'error' : 'success'}>
                      {result.bootloaderLocked ? 'Locked' : 'Unlocked'}
                    </Badge>
                  </div>
                </div>
              </Card>
              
              {/* Warnings & Recommendations */}
              {result.warnings && result.warnings.length > 0 && (
                <Card>
                  <h3 className="text-lg font-semibold mb-4 flex items-center">
                    <ApperIcon name="AlertTriangle" className="w-5 h-5 text-yellow-500 mr-2" />
                    Warnings & Recommendations
                  </h3>
                  <ul className="space-y-2">
                    {result.warnings.map((warning, index) => (
                      <li key={index} className="flex items-start space-x-2">
                        <ApperIcon name="AlertCircle" className="w-4 h-4 text-yellow-500 mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-gray-700">{warning}</span>
                      </li>
                    ))}
                  </ul>
                </Card>
              )}
              
              {/* Update Instructions */}
              <Card>
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  <ApperIcon name="Download" className="w-5 h-5 text-green-500 mr-2" />
                  Update Instructions
                </h3>
                <div className="space-y-3">
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-white text-xs font-bold">1</span>
                    </div>
                    <p className="text-sm text-gray-700">Back up your device data before updating</p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-white text-xs font-bold">2</span>
                    </div>
                    <p className="text-sm text-gray-700">Go to Settings > Software update > Download and install</p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-white text-xs font-bold">3</span>
                    </div>
                    <p className="text-sm text-gray-700">Ensure stable Wi-Fi connection and sufficient battery (>50%)</p>
                  </div>
                </div>
              </Card>
            </div>
          ) : (
            <Card className="text-center py-12">
              <div className="w-16 h-16 bg-gradient-to-r from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                <ApperIcon name="Shield" className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Ready to Check
              </h3>
              <p className="text-gray-600">
                Enter your device information to check firmware compatibility and update risks.
              </p>
            </Card>
          )}
        </motion.div>
      </div>
    </div>
  )
}

export default FirmwareChecker