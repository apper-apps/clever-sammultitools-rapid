import AppIcon from '@/components/atoms/AppIcon';

const Input = ({
  label,
  error,
  helper,
  icon,
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
{icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <AppIcon name={icon} className="h-5 w-5 text-gray-400" />
          </div>
        )}
        <input
          className={`form-input ${icon ? 'pl-10' : ''} ${
            error ? 'border-error focus:border-error focus:ring-error/20' : ''
          }`}
          {...props}
        />
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

export default Input