import { motion } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'
import Button from '@/components/atoms/Button'
import Card from '@/components/atoms/Card'

const Empty = ({ 
  title = 'No results found',
  description = 'Try adjusting your search criteria or explore our available tools.',
  icon = 'Search',
  actionText = 'Browse Tools',
  onAction,
  showAction = true,
  className = '' 
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex items-center justify-center p-8 ${className}`}
    >
      <Card className="text-center max-w-md">
        <div className="w-16 h-16 bg-gradient-to-r from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
          <ApperIcon name={icon} className="w-8 h-8 text-gray-400" />
        </div>
        
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          {title}
        </h3>
        
        <p className="text-gray-600 mb-6">
          {description}
        </p>
        
        {showAction && (
          <Button
            onClick={onAction || (() => window.location.href = '/')}
            variant="primary"
            icon="ArrowRight"
          >
            {actionText}
          </Button>
        )}
      </Card>
    </motion.div>
  )
}

export default Empty