import { motion } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'
import Button from '@/components/atoms/Button'
import Card from '@/components/atoms/Card'

const Error = ({ 
  message = 'Something went wrong',
  description = 'Please try again or contact support if the problem persists.',
  onRetry,
  showRetry = true,
  className = '' 
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex items-center justify-center p-8 ${className}`}
    >
      <Card className="text-center max-w-md">
        <div className="w-16 h-16 bg-gradient-to-r from-error to-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <ApperIcon name="AlertTriangle" className="w-8 h-8 text-white" />
        </div>
        
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          {message}
        </h3>
        
        <p className="text-gray-600 mb-6">
          {description}
        </p>
        
        {showRetry && onRetry && (
          <div className="flex justify-center space-x-3">
            <Button
              onClick={onRetry}
              variant="primary"
              icon="RefreshCw"
            >
              Try Again
            </Button>
            <Button
              onClick={() => window.location.reload()}
              variant="secondary"
            >
              Refresh Page
            </Button>
          </div>
        )}
      </Card>
    </motion.div>
  )
}

export default Error