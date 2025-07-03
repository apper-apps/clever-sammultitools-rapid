import { phoneModels } from '@/services/mockData/phoneModels'

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

export const phoneService = {
  async getAll() {
    await delay(300)
    return [...phoneModels]
  },
  
  async getById(id) {
    await delay(200)
    const model = phoneModels.find(m => m.Id === parseInt(id))
    if (!model) throw new Error('Phone model not found')
    return { ...model }
  },
  
  async getByName(name) {
    await delay(200)
    const model = phoneModels.find(m => m.name === name)
    if (!model) throw new Error('Phone model not found')
    return { ...model }
  }
}