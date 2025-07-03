const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

const goodLockModules = {
  'good-lock': [
    { name: 'MultiStar', description: 'Multi-window enhancements' },
    { name: 'Sound Assistant', description: 'Audio customization' },
    { name: 'Task Changer', description: 'Recent apps customization' }
  ],
  'themes': [
    { name: 'Theme Park', description: 'Create custom themes' },
    { name: 'Icon Pack Studio', description: 'Design custom icons' }
  ],
  'edge-panels': [
    { name: 'Edge Touch', description: 'Edge sensitivity control' },
    { name: 'Edge Lighting+', description: 'Enhanced edge lighting' }
  ],
  'always-on': [
    { name: 'ClockFace', description: 'Always On Display customization' }
  ]
}

const generateConfigs = (model, oneUIVersion, features, style) => {
  const configs = {}
  
  if (features.includes('good-lock')) {
    configs['good-lock'] = {
      description: 'Good Lock module configuration',
      modules: goodLockModules['good-lock'],
      settings: {
        multiWindow: style === 'productivity',
        soundEnhancement: style === 'gaming',
        taskChanger: true
      }
    }
  }
  
  if (features.includes('themes')) {
    configs['themes'] = {
      description: 'Theme and visual customization',
      primaryColor: style === 'minimal' ? '#000000' : 
                   style === 'colorful' ? '#FF6B6B' : 
                   style === 'dark' ? '#1A1A1A' : '#007ACC',
      accentColor: style === 'gaming' ? '#00FF00' : '#007ACC',
      wallpaperStyle: style,
      iconPack: style === 'minimal' ? 'Clean' : 'Dynamic'
    }
  }
  
  if (features.includes('wallpapers')) {
    configs['wallpapers'] = {
      description: 'Dynamic wallpaper settings',
      type: 'dynamic',
      category: style === 'minimal' ? 'abstract' : 
               style === 'gaming' ? 'neon' : 'nature',
      autoChange: true,
      interval: '1 hour'
    }
  }
  
  if (features.includes('sound')) {
    configs['sound'] = {
      description: 'Audio profile configuration',
      profiles: [
        { name: 'Gaming', enhanced: style === 'gaming' },
        { name: 'Music', dolbyAtmos: true },
        { name: 'Calls', noiseCancellation: true }
      ]
    }
  }
  
  return configs
}

const generateInstallationSteps = (features) => {
  const steps = [
    'Download Galaxy Store app if not already installed',
    'Search for "Good Lock" in Galaxy Store and install',
    'Open Good Lock and install required modules'
  ]
  
  if (features.includes('themes')) {
    steps.push('Apply custom theme through Settings > Themes')
  }
  
  if (features.includes('wallpapers')) {
    steps.push('Set dynamic wallpapers through Settings > Wallpapers')
  }
  
  steps.push('Restart your device to apply all changes')
  
  return steps
}

const generateTips = (style, features) => {
  const tips = []
  
  if (style === 'minimal') {
    tips.push('Use fewer widgets and apps on home screen for cleaner look')
  }
  
  if (style === 'gaming') {
    tips.push('Enable Game Mode for better performance during gaming')
  }
  
  if (features.includes('edge-panels')) {
    tips.push('Customize edge panels for quick access to frequently used apps')
  }
  
  tips.push('Backup your current settings before applying new configurations')
  tips.push('Test configurations gradually to find what works best for you')
  tips.push('Join Samsung Members community for more customization tips')
  
  return tips.slice(0, 4)
}

export const customizationService = {
  async generateConfig(formData) {
    await delay(500)
    
    const { model, oneUIVersion, features, style } = formData
    const configs = generateConfigs(model, oneUIVersion, features, style)
    const installationSteps = generateInstallationSteps(features)
    const tips = generateTips(style, features)
    
    // Get relevant Good Lock modules
    const relevantModules = []
    features.forEach(feature => {
      if (goodLockModules[feature]) {
        relevantModules.push(...goodLockModules[feature])
      }
    })
    
    return {
      Id: Date.now(),
      model,
      oneUIVersion,
      features: features.map(f => f.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())),
      style: style.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase()),
      configs,
      goodLockModules: relevantModules,
      installationSteps,
      tips,
      timestamp: new Date().toISOString()
    }
  }
}