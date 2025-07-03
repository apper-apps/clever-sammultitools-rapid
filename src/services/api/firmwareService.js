const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

const cscRegions = {
  'XAA': 'USA (Unlocked)',
  'DBT': 'Germany',
  'BTU': 'United Kingdom',
  'CPW': 'United Kingdom (Carphone Warehouse)',
  'TMB': 'USA (T-Mobile)',
  'VZW': 'USA (Verizon)',
  'ATT': 'USA (AT&T)',
  'SPR': 'USA (Sprint)',
  'KOO': 'South Korea',
  'TGY': 'Hong Kong'
}

const generateFirmwareData = (model, csc, currentFirmware) => {
  const region = cscRegions[csc] || 'Unknown Region'
  const isUSA = csc === 'XAA' || ['TMB', 'VZW', 'ATT', 'SPR'].includes(csc)
  
  // Generate firmware version based on model
  const firmwarePrefix = model.includes('S24') ? 'S928' : 
                        model.includes('S23') ? 'S918' : 
                        model.includes('A54') ? 'A546' : 'G998'
  
  const latestFirmware = `${firmwarePrefix}BXXU4CXL2`
  const androidVersion = model.includes('S24') ? '14' : 
                         model.includes('S23') ? '14' : '13'
  const oneUIVersion = model.includes('S24') ? '6.1' : 
                       model.includes('S23') ? '6.0' : '5.1'
  
  // Risk assessment
  let riskLevel = 'low'
  let riskDescription = 'Standard update with minimal risk'
  
  if (isUSA && csc !== 'XAA') {
    riskLevel = 'medium'
    riskDescription = 'Carrier-locked device may have delayed updates'
  }
  
  if (currentFirmware && currentFirmware.includes('AXA')) {
    riskLevel = 'high'
    riskDescription = 'Downgrading firmware may not be possible'
  }
  
  const warnings = []
  
  if (riskLevel === 'high') {
    warnings.push('This update may prevent downgrading to previous firmware')
  }
  
  if (csc === 'VZW' || csc === 'TMB') {
    warnings.push('Carrier updates may be delayed by 1-2 weeks')
  }
  
  warnings.push('Always backup your data before updating')
  warnings.push('Ensure stable internet connection during update')
  
  return {
    model,
    csc,
    region,
    latestFirmware,
    androidVersion,
    oneUIVersion,
    releaseDate: '2024-01-15',
    riskLevel,
    riskDescription,
    bootloaderLocked: !isUSA || csc !== 'XAA',
    warnings
  }
}

export const firmwareService = {
  async checkCompatibility(formData) {
    await delay(400)
    
    const { model, csc, currentFirmware } = formData
    const firmwareData = generateFirmwareData(model, csc, currentFirmware)
    
    return {
      Id: Date.now(),
      ...firmwareData,
      timestamp: new Date().toISOString()
    }
  }
}