import { motion } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'
import Card from '@/components/atoms/Card'
import Badge from '@/components/atoms/Badge'

const ResultCard = ({ 
  title, 
  value, 
  subtitle, 
  icon, 
  variant = 'default',
  children,
  className = '' 
}) => {
  const variants = {
    default: 'from-gray-50 to-gray-100',
    success: 'from-green-50 to-green-100',
    warning: 'from-yellow-50 to-yellow-100',
    error: 'from-red-50 to-red-100',
    info: 'from-blue-50 to-blue-100'
  }
  
  const iconColors = {
    default: 'text-gray-600',
    success: 'text-green-600',
    warning: 'text-yellow-600',
    error: 'text-red-600',
    info: 'text-blue-600'
  }
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={className}
    >
      <Card className={`bg-gradient-to-br ${variants[variant]} border-0`}>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-2">
              {icon && (
                <ApperIcon name={icon} className={`w-5 h-5 ${iconColors[variant]}`} />
              )}
              <h3 className="text-sm font-medium text-gray-700">{title}</h3>
            </div>
            
            {value && (
              <div className="mb-2">
                <span className="text-2xl font-bold gradient-text">{value}</span>
                {subtitle && (
                  <span className="text-sm text-gray-600 ml-2">{subtitle}</span>
                )}
              </div>
            )}
            
            {children}
          </div>
        </div>
      </Card>
    </motion.div>
  )
}

export default ResultCard