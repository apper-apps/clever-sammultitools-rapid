import { useState, useEffect } from 'react'
import Select from '@/components/atoms/Select'
import { phoneService } from '@/services/api/phoneService'

const ModelSelector = ({ value, onChange, label = "Select Samsung Model", className = '' }) => {
  const [models, setModels] = useState([])
  const [loading, setLoading] = useState(true)
  
  useEffect(() => {
    const loadModels = async () => {
      try {
        const data = await phoneService.getAll()
        setModels(data)
      } catch (error) {
        console.error('Failed to load models:', error)
      } finally {
        setLoading(false)
      }
    }
    
    loadModels()
  }, [])
  
  const modelOptions = [
    { value: '', label: loading ? 'Loading models...' : 'Select a Samsung model' },
    ...models.map(model => ({
      value: model.name,
      label: model.name
    }))
  ]
  
  return (
    <Select
      label={label}
      options={modelOptions}
      value={value}
      onChange={onChange}
      disabled={loading}
      className={className}
    />
  )
}

export default ModelSelector