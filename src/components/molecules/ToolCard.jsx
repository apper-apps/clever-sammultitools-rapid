import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import ApperIcon from '@/components/ApperIcon'
import Card from '@/components/atoms/Card'

const ToolCard = ({ 
  title, 
  description, 
  icon, 
  path, 
  category,
  gradient = 'from-primary to-blue-600',
  className = '' 
}) => {
  return (
    <Link to={path} className={`block ${className}`}>
      <Card className="group cursor-pointer h-full">
        <div className="flex flex-col h-full">
          <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${gradient} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-200`}>
            <ApperIcon name={icon} className="w-6 h-6 text-white" />
          </div>
          
          <div className="flex-1">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-semibold text-secondary group-hover:text-primary transition-colors duration-200">
                {title}
              </h3>
              <ApperIcon name="ArrowRight" className="w-4 h-4 text-gray-400 group-hover:text-primary group-hover:translate-x-1 transition-all duration-200" />
            </div>
            
            <p className="text-gray-600 text-sm mb-3 leading-relaxed">
              {description}
            </p>
            
            {category && (
              <span className="inline-flex items-center px-2 py-1 text-xs font-medium bg-gradient-to-r from-primary/10 to-blue-600/10 text-primary rounded-full">
                {category}
              </span>
            )}
          </div>
        </div>
      </Card>
    </Link>
  )
}

export default ToolCard