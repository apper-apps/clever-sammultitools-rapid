import { useState } from 'react'
import { motion } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'

const ConditionSelector = ({ value, onChange, label = "Device Condition", className = '' }) => {
  const conditions = [
    {
      value: 'excellent',
      label: 'Excellent',
      description: 'Like new, no visible wear',
      icon: 'Star',
      color: 'text-green-600',
      bgColor: 'bg-green-50 border-green-200'
    },
    {
      value: 'good',
      label: 'Good',
      description: 'Minor wear, fully functional',
      icon: 'CheckCircle',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50 border-blue-200'
    },
    {
      value: 'fair',
      label: 'Fair',
      description: 'Noticeable wear, works properly',
      icon: 'AlertCircle',
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50 border-yellow-200'
    },
    {
      value: 'poor',
      label: 'Poor',
      description: 'Significant wear or damage',
      icon: 'XCircle',
      color: 'text-red-600',
      bgColor: 'bg-red-50 border-red-200'
    }
  ]
  
  return (
    <div className={`space-y-3 ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-secondary mb-3">
          {label}
        </label>
      )}
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {conditions.map((condition) => (
          <motion.div
            key={condition.value}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`relative cursor-pointer rounded-lg border-2 p-4 transition-all duration-200 ${
              value === condition.value 
                ? condition.bgColor 
                : 'bg-white border-gray-200 hover:border-gray-300'
            }`}
            onClick={() => onChange(condition.value)}
          >
            <div className="flex items-start space-x-3">
              <ApperIcon 
                name={condition.icon} 
                className={`w-5 h-5 mt-0.5 ${
                  value === condition.value ? condition.color : 'text-gray-400'
                }`} 
              />
              <div className="flex-1">
                <h4 className={`text-sm font-medium ${
                  value === condition.value ? condition.color : 'text-gray-900'
                }`}>
                  {condition.label}
                </h4>
                <p className="text-xs text-gray-500 mt-1">
                  {condition.description}
                </p>
              </div>
            </div>
            
            {value === condition.value && (
              <div className="absolute top-2 right-2">
                <ApperIcon name="Check" className={`w-4 h-4 ${condition.color}`} />
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  )
}

export default ConditionSelector