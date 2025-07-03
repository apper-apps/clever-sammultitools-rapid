const Badge = ({ 
  children, 
  variant = 'default',
  size = 'md',
  className = '' 
}) => {
  const variants = {
    default: 'bg-gray-100 text-gray-800',
    primary: 'bg-gradient-to-r from-primary/10 to-blue-600/10 text-primary',
    success: 'bg-gradient-to-r from-success/10 to-green-600/10 text-success',
    warning: 'bg-gradient-to-r from-warning/10 to-orange-600/10 text-warning',
    error: 'bg-gradient-to-r from-error/10 to-red-600/10 text-error',
    info: 'bg-gradient-to-r from-info/10 to-blue-500/10 text-info'
  }
  
  const sizes = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1 text-sm',
    lg: 'px-4 py-2 text-base'
  }
  
  return (
    <span className={`inline-flex items-center rounded-full font-medium ${variants[variant]} ${sizes[size]} ${className}`}>
      {children}
    </span>
  )
}

export default Badge