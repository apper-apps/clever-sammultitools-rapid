import { motion } from 'framer-motion'

const Card = ({ 
  children, 
  className = '',
  hover = true,
  padding = true,
  ...props 
}) => {
  const baseClasses = `card ${padding ? 'p-6' : ''} ${className}`
  
  if (hover) {
    return (
      <motion.div
        whileHover={{ scale: 1.02, y: -2 }}
        className={baseClasses}
        {...props}
      >
        {children}
      </motion.div>
    )
  }
  
  return (
    <div className={baseClasses} {...props}>
      {children}
    </div>
  )
}

export default Card