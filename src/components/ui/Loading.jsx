import { motion } from 'framer-motion'

const Loading = ({ 
  type = 'skeleton', 
  rows = 3, 
  className = '',
  text = 'Loading...'
}) => {
  if (type === 'spinner') {
    return (
      <div className={`flex items-center justify-center p-8 ${className}`}>
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">{text}</p>
        </div>
      </div>
    )
  }
  
  if (type === 'skeleton') {
    return (
      <div className={`space-y-4 ${className}`}>
        {[...Array(rows)].map((_, i) => (
          <div key={i} className="bg-white rounded-lg p-6 shadow-card">
            <div className="animate-pulse">
              <div className="flex items-center space-x-4 mb-4">
                <div className="w-12 h-12 bg-gray-200 rounded-lg shimmer"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded shimmer"></div>
                  <div className="h-3 bg-gray-200 rounded w-2/3 shimmer"></div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="h-3 bg-gray-200 rounded shimmer"></div>
                <div className="h-3 bg-gray-200 rounded w-5/6 shimmer"></div>
                <div className="h-3 bg-gray-200 rounded w-4/6 shimmer"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    )
  }
  
  return (
    <div className={`flex items-center justify-center p-8 ${className}`}>
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full"
      />
    </div>
  )
}

export default Loading