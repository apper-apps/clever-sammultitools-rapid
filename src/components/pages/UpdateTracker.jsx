import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { toast } from 'react-toastify'
import ModelSelector from '@/components/molecules/ModelSelector'
import SearchBar from '@/components/molecules/SearchBar'
import Button from '@/components/atoms/Button'
import Card from '@/components/atoms/Card'
import Badge from '@/components/atoms/Badge'
import Loading from '@/components/ui/Loading'
import Error from '@/components/ui/Error'
import Empty from '@/components/ui/Empty'
import ApperIcon from '@/components/ApperIcon'
import { updateService } from '@/services/api/updateService'

const UpdateTracker = () => {
  const [updates, setUpdates] = useState([])
  const [filteredUpdates, setFilteredUpdates] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedModel, setSelectedModel] = useState('')
  const [selectedType, setSelectedType] = useState('all')
  
  const updateTypes = [
    { value: 'all', label: 'All Updates' },
    { value: 'major', label: 'Major Updates' },
    { value: 'security', label: 'Security Updates' },
    { value: 'feature', label: 'Feature Updates' }
  ]
  
  useEffect(() => {
    loadUpdates()
  }, [])
  
  useEffect(() => {
    filterUpdates()
  }, [updates, searchTerm, selectedModel, selectedType])
  
  const loadUpdates = async () => {
    try {
      setLoading(true)
      setError('')
      const data = await updateService.getAll()
      setUpdates(data)
    } catch (err) {
      setError('Failed to load updates. Please try again.')
      toast.error('Failed to load updates')
    } finally {
      setLoading(false)
    }
  }
  
  const filterUpdates = () => {
    let filtered = updates
    
    if (searchTerm) {
      filtered = filtered.filter(update => 
        update.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
        update.version.toLowerCase().includes(searchTerm.toLowerCase()) ||
        update.description.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }
    
    if (selectedModel) {
      filtered = filtered.filter(update => update.model === selectedModel)
    }
    
    if (selectedType !== 'all') {
      filtered = filtered.filter(update => update.type === selectedType)
    }
    
    setFilteredUpdates(filtered)
  }
  
  const handleRefresh = () => {
    loadUpdates()
    toast.success('Updates refreshed!')
  }
  
  const getUpdateTypeColor = (type) => {
    switch (type) {
      case 'major': return 'success'
      case 'security': return 'error'
      case 'feature': return 'info'
      default: return 'default'
    }
  }
  
  const getUpdateIcon = (type) => {
    switch (type) {
      case 'major': return 'Smartphone'
      case 'security': return 'Shield'
      case 'feature': return 'Star'
      default: return 'Download'
    }
  }
  
  const getStatusColor = (status) => {
    switch (status) {
      case 'available': return 'success'
      case 'rolling': return 'warning'
      case 'paused': return 'error'
      default: return 'default'
    }
  }
  
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }
  
  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Loading type="skeleton" rows={5} />
      </div>
    )
  }
  
  if (error) {
    return (
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Error
          message="Failed to Load Updates"
          description={error}
          onRetry={loadUpdates}
        />
      </div>
    )
  }
  
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-r from-teal-500 to-green-600 rounded-lg flex items-center justify-center">
              <ApperIcon name="Download" className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">One UI / Android Update Tracker</h1>
              <p className="text-gray-600">Track the latest Samsung One UI and Android updates</p>
            </div>
          </div>
          <Button
            onClick={handleRefresh}
            variant="outline"
            icon="RefreshCw"
          >
            Refresh
          </Button>
        </div>
      </motion.div>
      
      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mb-8"
      >
        <Card>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <SearchBar
                placeholder="Search updates..."
                onSearch={setSearchTerm}
              />
            </div>
            
            <div>
              <ModelSelector
                value={selectedModel}
                onChange={(e) => setSelectedModel(e.target.value)}
                label=""
              />
            </div>
            
            <div>
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="form-select"
              >
                {updateTypes.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </Card>
      </motion.div>
      
      {/* Updates List */}
      {filteredUpdates.length > 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="space-y-4"
        >
          {filteredUpdates.map((update, index) => (
            <motion.div
              key={update.Id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="hover:shadow-lg transition-shadow duration-200">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4 flex-1">
                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center bg-gradient-to-r ${
                      update.type === 'major' ? 'from-green-500 to-green-600' :
                      update.type === 'security' ? 'from-red-500 to-red-600' :
                      'from-blue-500 to-blue-600'
                    }`}>
                      <ApperIcon name={getUpdateIcon(update.type)} className="w-6 h-6 text-white" />
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {update.model}
                        </h3>
                        <Badge variant={getUpdateTypeColor(update.type)}>
                          {update.type}
                        </Badge>
                        <Badge variant={getStatusColor(update.status)}>
                          {update.status}
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3">
                        <div>
                          <span className="text-sm text-gray-600">Version:</span>
                          <p className="font-medium">{update.version}</p>
                        </div>
                        <div>
                          <span className="text-sm text-gray-600">Android:</span>
                          <p className="font-medium">{update.androidVersion}</p>
                        </div>
                        <div>
                          <span className="text-sm text-gray-600">Release Date:</span>
                          <p className="font-medium">{formatDate(update.releaseDate)}</p>
                        </div>
                        <div>
                          <span className="text-sm text-gray-600">Size:</span>
                          <p className="font-medium">{update.size}</p>
                        </div>
                      </div>
                      
                      <p className="text-gray-700 mb-3">{update.description}</p>
                      
                      {update.features && update.features.length > 0 && (
                        <div className="mb-3">
                          <span className="text-sm text-gray-600 mb-2 block">Key Features:</span>
                          <div className="flex flex-wrap gap-1">
                            {update.features.map((feature, featureIndex) => (
                              <Badge key={featureIndex} variant="info" size="sm">
                                {feature}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      {update.regions && update.regions.length > 0 && (
                        <div>
                          <span className="text-sm text-gray-600 mb-2 block">Available Regions:</span>
                          <div className="flex flex-wrap gap-1">
                            {update.regions.map((region, regionIndex) => (
                              <Badge key={regionIndex} variant="default" size="sm">
                                {region}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    {update.changelogUrl && (
                      <Button
                        variant="outline"
                        size="sm"
                        icon="FileText"
                        onClick={() => window.open(update.changelogUrl, '_blank')}
                      >
                        Changelog
                      </Button>
                    )}
                    <Button
                      variant="primary"
                      size="sm"
                      icon="Download"
                      onClick={() => toast.info('Check your device settings for the update')}
                    >
                      Check Update
                    </Button>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      ) : (
        <Empty
          title="No Updates Found"
          description="No updates match your current search criteria. Try adjusting your filters."
          icon="Download"
          actionText="Clear Filters"
          onAction={() => {
            setSearchTerm('')
            setSelectedModel('')
            setSelectedType('all')
          }}
        />
      )}
      
      {/* Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="mt-12 grid grid-cols-1 md:grid-cols-4 gap-6"
      >
        <Card className="text-center">
          <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center mx-auto mb-3">
            <ApperIcon name="Download" className="w-6 h-6 text-white" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-1">
            {updates.length}
          </h3>
          <p className="text-gray-600">Total Updates</p>
        </Card>
        
        <Card className="text-center">
          <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-lg flex items-center justify-center mx-auto mb-3">
            <ApperIcon name="Smartphone" className="w-6 h-6 text-white" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-1">
            {updates.filter(u => u.type === 'major').length}
          </h3>
          <p className="text-gray-600">Major Updates</p>
        </Card>
        
        <Card className="text-center">
          <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-red-600 rounded-lg flex items-center justify-center mx-auto mb-3">
            <ApperIcon name="Shield" className="w-6 h-6 text-white" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-1">
            {updates.filter(u => u.type === 'security').length}
          </h3>
          <p className="text-gray-600">Security Updates</p>
        </Card>
        
        <Card className="text-center">
          <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg flex items-center justify-center mx-auto mb-3">
            <ApperIcon name="Star" className="w-6 h-6 text-white" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-1">
            {updates.filter(u => u.type === 'feature').length}
          </h3>
          <p className="text-gray-600">Feature Updates</p>
        </Card>
      </motion.div>
    </div>
  )
}

export default UpdateTracker