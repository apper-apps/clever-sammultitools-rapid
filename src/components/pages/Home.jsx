import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import ToolCard from '@/components/molecules/ToolCard'
import SearchBar from '@/components/molecules/SearchBar'
import Loading from '@/components/ui/Loading'
import Empty from '@/components/ui/Empty'
import ApperIcon from '@/components/ApperIcon'

const Home = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [loading, setLoading] = useState(true)
  
  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => setLoading(false), 1000)
    return () => clearTimeout(timer)
  }, [])
  
  const tools = [
    {
      id: 1,
      title: 'Trade-In Value Estimator',
      description: 'Get AI-powered trade-in value estimates for your Samsung device with personalized resale tips.',
      icon: 'DollarSign',
      path: '/trade-in-estimator',
      category: 'trade-in',
      gradient: 'from-green-500 to-emerald-600'
    },
    {
      id: 2,
      title: 'Battery Health Checker',
      description: 'Analyze your Samsung battery health and get replacement recommendations.',
      icon: 'Battery',
      path: '/battery-health-checker',
      category: 'technical',
      gradient: 'from-blue-500 to-cyan-600'
    },
    {
      id: 3,
      title: 'Phone Comparison Tool',
      description: 'Compare Samsung models side-by-side with AI-generated insights and recommendations.',
      icon: 'GitCompare',
      path: '/phone-comparison',
      category: 'comparison',
      gradient: 'from-purple-500 to-violet-600'
    },
    {
      id: 4,
      title: 'Upgrade Advisor',
      description: 'Get personalized upgrade recommendations based on your priorities and usage patterns.',
      icon: 'TrendingUp',
      path: '/upgrade-advisor',
      category: 'trade-in',
      gradient: 'from-orange-500 to-red-600'
    },
    {
      id: 5,
      title: 'Firmware Compatibility Checker',
      description: 'Check firmware compatibility and get update risk assessments for your device.',
      icon: 'Shield',
      path: '/firmware-checker',
      category: 'technical',
      gradient: 'from-indigo-500 to-blue-600'
    },
    {
      id: 6,
      title: 'One UI Customization Generator',
      description: 'Generate custom One UI configurations with Good Lock modules and themes.',
      icon: 'Palette',
      path: '/customization-generator',
      category: 'customization',
      gradient: 'from-pink-500 to-rose-600'
    },
    {
      id: 7,
      title: 'Update Tracker',
      description: 'Track the latest One UI and Android updates for your Samsung device.',
      icon: 'Download',
      path: '/update-tracker',
      category: 'technical',
      gradient: 'from-teal-500 to-green-600'
    }
  ]
  
  const categories = [
    { id: 'all', name: 'All Tools', icon: 'Grid3x3' },
    { id: 'trade-in', name: 'Trade-In', icon: 'DollarSign' },
    { id: 'technical', name: 'Technical', icon: 'Settings' },
    { id: 'comparison', name: 'Comparison', icon: 'GitCompare' },
    { id: 'customization', name: 'Customization', icon: 'Palette' }
  ]
  
  const filteredTools = tools.filter(tool => {
    const matchesSearch = tool.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         tool.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || tool.category === selectedCategory
    return matchesSearch && matchesCategory
  })
  
  if (loading) {
    return <Loading type="skeleton" rows={6} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8" />
  }
  
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12"
      >
        <h1 className="text-4xl md:text-6xl font-bold mb-4">
          <span className="gradient-text">Samsung</span> Multi-Tools
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
          AI-powered tools for Samsung mobile users. Get instant insights, trade-in values, 
          battery health checks, and customization options for your Samsung device.
        </p>
        
        <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <ApperIcon name="CheckCircle" className="w-5 h-5 text-green-500" />
            <span>AI-Powered Analysis</span>
          </div>
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <ApperIcon name="CheckCircle" className="w-5 h-5 text-green-500" />
            <span>Real-time Results</span>
          </div>
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <ApperIcon name="CheckCircle" className="w-5 h-5 text-green-500" />
            <span>Free to Use</span>
          </div>
        </div>
      </motion.div>
      
      {/* Search and Filters */}
      <div className="flex flex-col lg:flex-row gap-6 mb-8">
        <div className="flex-1">
          <SearchBar 
            placeholder="Search tools..." 
            onSearch={setSearchTerm}
          />
        </div>
        
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                selectedCategory === category.id
                  ? 'bg-primary text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-50 hover:text-primary'
              }`}
            >
              <ApperIcon name={category.icon} className="w-4 h-4" />
              <span>{category.name}</span>
            </button>
          ))}
        </div>
      </div>
      
      {/* Tools Grid */}
      {filteredTools.length > 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {filteredTools.map((tool, index) => (
            <motion.div
              key={tool.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <ToolCard {...tool} />
            </motion.div>
          ))}
        </motion.div>
      ) : (
        <Empty
          title="No tools found"
          description="Try adjusting your search or filter criteria to find the tools you need."
          icon="Search"
          actionText="Clear Filters"
          onAction={() => {
            setSearchTerm('')
            setSelectedCategory('all')
          }}
        />
      )}
      
      {/* Feature Highlights */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.5 }}
        className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8"
      >
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-primary to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <ApperIcon name="Zap" className="w-8 h-8 text-white" />
          </div>
          <h3 className="text-lg font-semibold mb-2">Instant Results</h3>
          <p className="text-gray-600">Get AI-powered insights and recommendations in seconds.</p>
        </div>
        
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <ApperIcon name="Shield" className="w-8 h-8 text-white" />
          </div>
          <h3 className="text-lg font-semibold mb-2">Samsung Optimized</h3>
          <p className="text-gray-600">Built specifically for Samsung devices and One UI.</p>
        </div>
        
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-violet-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <ApperIcon name="Users" className="w-8 h-8 text-white" />
          </div>
          <h3 className="text-lg font-semibold mb-2">Community Driven</h3>
          <p className="text-gray-600">Tools built by Samsung users, for Samsung users.</p>
        </div>
      </motion.div>
    </div>
  )
}

export default Home