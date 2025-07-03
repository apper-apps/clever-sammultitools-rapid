import ApperIcon from '@/components/ApperIcon'

const Select = ({
  label,
  error,
  helper,
  options = [],
  className = '',
  ...props
}) => {
  return (
    <div className={`space-y-2 ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-secondary mb-2">
          {label}
        </label>
      )}
      <div className="relative">
        <select
          className={`form-select appearance-none pr-10 ${
            error ? 'border-error focus:border-error focus:ring-error/20' : ''
          }`}
          {...props}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
          <ApperIcon name="ChevronDown" className="h-5 w-5 text-gray-400" />
        </div>
      </div>
      {error && (
        <p className="text-sm text-error mt-1">{error}</p>
      )}
      {helper && !error && (
        <p className="text-sm text-gray-500 mt-1">{helper}</p>
      )}
    </div>
  )
}

export default Select