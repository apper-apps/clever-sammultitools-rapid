import { phoneService } from './phoneService'

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

const generateComparison = (model1Data, model2Data) => {
  const categories = [
    {
      name: 'Display',
      model1Value: model1Data.specs.display,
      model2Value: model2Data.specs.display,
      winner: model1Data.specs.displayScore > model2Data.specs.displayScore ? 'model1' : 
              model1Data.specs.displayScore < model2Data.specs.displayScore ? 'model2' : 'tie',
      notes: 'Based on size, resolution, and refresh rate'
    },
    {
      name: 'Camera',
      model1Value: model1Data.specs.camera,
      model2Value: model2Data.specs.camera,
      winner: model1Data.specs.cameraScore > model2Data.specs.cameraScore ? 'model1' : 
              model1Data.specs.cameraScore < model2Data.specs.cameraScore ? 'model2' : 'tie',
      notes: 'Main camera megapixels and features'
    },
    {
      name: 'Performance',
      model1Value: model1Data.specs.processor,
      model2Value: model2Data.specs.processor,
      winner: model1Data.releaseYear > model2Data.releaseYear ? 'model1' : 
              model1Data.releaseYear < model2Data.releaseYear ? 'model2' : 'tie',
      notes: 'Processor performance and generation'
    },
    {
      name: 'Battery',
      model1Value: model1Data.specs.battery,
      model2Value: model2Data.specs.battery,
      winner: parseInt(model1Data.specs.battery) > parseInt(model2Data.specs.battery) ? 'model1' : 
              parseInt(model1Data.specs.battery) < parseInt(model2Data.specs.battery) ? 'model2' : 'tie',
      notes: 'Battery capacity and charging speed'
    },
    {
      name: 'Storage',
      model1Value: model1Data.specs.storage,
      model2Value: model2Data.specs.storage,
      winner: model1Data.specs.storageScore > model2Data.specs.storageScore ? 'model1' : 
              model1Data.specs.storageScore < model2Data.specs.storageScore ? 'model2' : 'tie',
      notes: 'Base storage and expandability'
    }
  ]
  
  // Calculate overall winner
  const model1Wins = categories.filter(cat => cat.winner === 'model1').length
  const model2Wins = categories.filter(cat => cat.winner === 'model2').length
  
  let overallWinner, recommendation
  
  if (model1Wins > model2Wins) {
    overallWinner = `${model1Data.name} wins with ${model1Wins} categories`
    recommendation = `The ${model1Data.name} offers better overall value with superior performance in key areas.`
  } else if (model2Wins > model1Wins) {
    overallWinner = `${model2Data.name} wins with ${model2Wins} categories`
    recommendation = `The ${model2Data.name} provides better features and performance for most users.`
  } else {
    overallWinner = 'It\'s a tie! Both phones excel in different areas'
    recommendation = 'Choose based on your specific priorities - both phones offer excellent value.'
  }
  
  return {
    categories,
    summary: {
      winner: overallWinner,
      model1Strengths: [
        model1Data.specs.display,
        model1Data.specs.camera,
        `${model1Data.releaseYear} release`
      ],
      model2Strengths: [
        model2Data.specs.display,
        model2Data.specs.camera,
        `${model2Data.releaseYear} release`
      ],
      recommendation
    }
  }
}

export const comparisonService = {
  async compare(model1Name, model2Name) {
    await delay(400)
    
    const model1Data = await phoneService.getByName(model1Name)
    const model2Data = await phoneService.getByName(model2Name)
    
    const comparison = generateComparison(model1Data, model2Data)
    
    return {
      Id: Date.now(),
      model1: {
        name: model1Data.name,
        releaseYear: model1Data.releaseYear
      },
      model2: {
        name: model2Data.name,
        releaseYear: model2Data.releaseYear
      },
      ...comparison,
      timestamp: new Date().toISOString()
    }
  }
}