import { useState } from 'react'
import { motion } from 'framer-motion'
import { toast } from 'react-toastify'
import ModelSelector from '@/components/molecules/ModelSelector'
import Button from '@/components/atoms/Button'
import Card from '@/components/atoms/Card'
import Badge from '@/components/atoms/Badge'
import Loading from '@/components/ui/Loading'
import ApperIcon from '@/components/ApperIcon'
import { customizationService } from '@/services/api/customizationService'

const CustomizationGenerator = () => {
  const [formData, setFormData] = useState({
    model: '',
    oneUIVersion: '',
    features: [],
    style: ''
  })
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  
  const oneUIVersions = [
    { value: '', label: 'Select One UI version' },
    { value: '6.1', label: 'One UI 6.1' },
    { value: '6.0', label: 'One UI 6.0' },
    { value: '5.1', label: 'One UI 5.1' },
    { value: '5.0', label: 'One UI 5.0' },
    { value: '4.1', label: 'One UI 4.1' }
  ]
  
  const featureOptions = [
    { id: 'good-lock', label: 'Good Lock Modules', icon: 'Lock' },
    { id: 'themes', label: 'Custom Themes', icon: 'Palette' },
    { id: 'icons', label: 'Icon Packs', icon: 'Grid3x3' },
    { id: 'wallpapers', label: 'Dynamic Wallpapers', icon: 'Image' },
    { id: 'sound', label: 'Sound Profiles', icon: 'Volume2' },
    { id: 'edge-panels', label: 'Edge Panels', icon: 'Sidebar' },
    { id: 'always-on', label: 'Always On Display', icon: 'Clock' },
    { id: 'gestures', label: 'Custom Gestures', icon: 'Hand' }
  ]
  
  const styleOptions = [
    { value: '', label: 'Select customization style' },
    { value: 'minimal', label: 'Minimal & Clean' },
    { value: 'colorful', label: 'Vibrant & Colorful' },
    { value: 'dark', label: 'Dark & Elegant' },
    { value: 'gaming', label: 'Gaming Focused' },
    { value: 'productivity', label: 'Productivity Optimized' }
  ]
  
  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
    setError('')
  }
  
  const handleFeatureToggle = (featureId) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.includes(featureId)
        ? prev.features.filter(f => f !== featureId)
        : [...prev.features, featureId]
    }))
  }
  
  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!formData.model || !formData.oneUIVersion || formData.features.length === 0 || !formData.style) {
      setError('Please fill in all required fields and select at least one feature')
      return
    }
    
    setLoading(true)
    setError('')
    
    try {
      const customization = await customizationService.generateConfig(formData)
      setResult(customization)
      toast.success('Customization config generated!')
    } catch (err) {
      setError('Failed to generate customization config. Please try again.')
      toast.error('Generation failed')
    } finally {
      setLoading(false)
    }
  }
  
  const handleReset = () => {
    setFormData({
      model: '',
      oneUIVersion: '',
      features: [],
      style: ''
    })
    setResult(null)
    setError('')
  }
  
  const handleDownload = (configType) => {
    if (!result) return
    
    const config = result.configs[configType]
    const blob = new Blob([JSON.stringify(config, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${configType}-config.json`
    a.click()
    URL.revokeObjectURL(url)
    toast.success(`${configType} config downloaded!`)
  }
  
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-12 h-12 bg-gradient-to-r from-pink-500 to-rose-600 rounded-lg flex items-center justify-center">
            <ApperIcon name="Palette" className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">One UI Customization Generator</h1>
            <p className="text-gray-600">Generate custom One UI configurations with Good Lock modules and themes</p>
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
                <h2 className="text-xl font-semibold mb-4">Device & Preferences</h2>
                
                <div className="space-y-6">
                  <ModelSelector
                    value={formData.model}
                    onChange={(e) => handleInputChange('model', e.target.value)}
                    label="Samsung Model"
                  />
                  
                  <div>
                    <label className="block text-sm font-medium text-secondary mb-2">
                      One UI Version
                    </label>
                    <select
                      value={formData.oneUIVersion}
                      onChange={(e) => handleInputChange('oneUIVersion', e.target.value)}
                      className="form-select"
                    >
                      {oneUIVersions.map((version) => (
                        <option key={version.value} value={version.value}>
                          {version.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-secondary mb-3">
                      Features to Include (Select all that apply)
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      {featureOptions.map((feature) => (
                        <button
                          key={feature.id}
                          type="button"
                          onClick={() => handleFeatureToggle(feature.id)}
                          className={`flex items-center space-x-2 p-3 rounded-lg border-2 transition-all duration-200 ${
                            formData.features.includes(feature.id)
                              ? 'border-primary bg-primary/10 text-primary'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <ApperIcon name={feature.icon} className="w-4 h-4" />
                          <span className="text-sm font-medium">{feature.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-secondary mb-2">
                      Customization Style
                    </label>
                    <select
                      value={formData.style}
                      onChange={(e) => handleInputChange('style', e.target.value)}
                      className="form-select"
                    >
                      {styleOptions.map((style) => (
                        <option key={style.value} value={style.value}>
                          {style.label}
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
                  disabled={!formData.model || !formData.oneUIVersion || formData.features.length === 0 || !formData.style}
                  className="flex-1"
                >
                  Generate Configuration
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
              {/* Configuration Summary */}
              <Card className="bg-gradient-to-r from-pink-50 to-rose-50 border-pink-200">
                <h3 className="text-lg font-semibold text-pink-900 mb-4">
                  Configuration Generated
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-pink-800">Model:</span>
                    <span className="font-medium text-pink-900">{result.model}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-pink-800">One UI Version:</span>
                    <span className="font-medium text-pink-900">{result.oneUIVersion}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-pink-800">Style:</span>
                    <Badge variant="warning">{result.style}</Badge>
                  </div>
                  <div className="flex justify-between items-start">
                    <span className="text-pink-800">Features:</span>
                    <div className="flex flex-wrap gap-1">
                      {result.features.map((feature, index) => (
                        <Badge key={index} variant="info" size="sm">
                          {feature}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </Card>
              
              {/* Download Options */}
              <Card>
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  <ApperIcon name="Download" className="w-5 h-5 text-blue-500 mr-2" />
                  Download Configuration Files
                </h3>
                <div className="space-y-3">
                  {Object.entries(result.configs).map(([configType, config]) => (
                    <div key={configType} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <ApperIcon name="FileText" className="w-5 h-5 text-gray-500" />
                        <div>
                          <h4 className="font-medium text-gray-900 capitalize">
                            {configType.replace('-', ' ')} Config
                          </h4>
                          <p className="text-sm text-gray-600">
                            {config.description || `Configuration for ${configType}`}
                          </p>
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDownload(configType)}
                        icon="Download"
                      >
                        Download
                      </Button>
                    </div>
                  ))}
                </div>
              </Card>
              
              {/* Installation Guide */}
              <Card>
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  <ApperIcon name="BookOpen" className="w-5 h-5 text-green-500 mr-2" />
                  Installation Guide
                </h3>
                <div className="space-y-3">
                  {result.installationSteps.map((step, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-white text-xs font-bold">{index + 1}</span>
                      </div>
                      <p className="text-sm text-gray-700">{step}</p>
                    </div>
                  ))}
                </div>
              </Card>
              
              {/* Good Lock Modules */}
              {result.goodLockModules && result.goodLockModules.length > 0 && (
                <Card>
                  <h3 className="text-lg font-semibold mb-4 flex items-center">
                    <ApperIcon name="Lock" className="w-5 h-5 text-purple-500 mr-2" />
                    Required Good Lock Modules
                  </h3>
                  <div className="grid grid-cols-2 gap-3">
                    {result.goodLockModules.map((module, index) => (
                      <div key={index} className="flex items-center space-x-3 p-3 bg-purple-50 rounded-lg">
                        <ApperIcon name="Puzzle" className="w-5 h-5 text-purple-600" />
                        <div>
                          <h4 className="font-medium text-purple-900">{module.name}</h4>
                          <p className="text-sm text-purple-700">{module.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              )}
              
              {/* Tips */}
              <Card>
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  <ApperIcon name="Lightbulb" className="w-5 h-5 text-yellow-500 mr-2" />
                  Customization Tips
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
                <ApperIcon name="Palette" className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Ready to Customize
              </h3>
              <p className="text-gray-600">
                Select your device and preferences to generate a custom One UI configuration.
              </p>
            </Card>
          )}
        </motion.div>
      </div>
    </div>
  )
}

export default CustomizationGenerator