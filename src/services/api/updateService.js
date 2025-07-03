import { updates } from '@/services/mockData/updates'

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

export const updateService = {
  async getAll() {
    await delay(300)
    return [...updates].sort((a, b) => new Date(b.releaseDate) - new Date(a.releaseDate))
  },
  
  async getById(id) {
    await delay(200)
    const update = updates.find(u => u.Id === parseInt(id))
    if (!update) throw new Error('Update not found')
    return { ...update }
  },
  
  async getByModel(model) {
    await delay(200)
    return updates.filter(u => u.model === model)
  }
}