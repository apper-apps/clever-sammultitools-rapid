import React, { useCallback, useEffect, useRef, useState } from "react";
import ApperIcon from "@/components/ApperIcon";
import Select from "@/components/atoms/Select";
import Badge from "@/components/atoms/Badge";
import Card from "@/components/atoms/Card";
import Input from "@/components/atoms/Input";
import Button from "@/components/atoms/Button";
import ModelSelector from "@/components/molecules/ModelSelector";
import Error from "@/components/ui/Error";
import Loading from "@/components/ui/Loading";
import phoneModels from "@/services/mockData/phoneModels.json";
import updates from "@/services/mockData/updates.json";
import { customizationService } from "@/services/api/customizationService";

const CustomizationGenerator = () => {
  const [formData, setFormData] = useState({
    model: '',
    oneUIVersion: '',
    features: [],
    style: ''
  });
  const [selectedModel, setSelectedModel] = useState('');
  const [customization, setCustomization] = useState({
    wallpaper: '',
    theme: '',
    icons: ''
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const [loading, setLoading] = useState(false);
  const [generatedContent, setGeneratedContent] = useState(null);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [canvasReady, setCanvasReady] = useState(false);
  const canvasRef = useRef(null);
  const containerRef = useRef(null);

  const oneUIVersions = [
    { value: '', label: 'Select One UI Version' },
    { value: '6.0', label: 'One UI 6.0' },
    { value: '5.1', label: 'One UI 5.1' },
    { value: '5.0', label: 'One UI 5.0' },
    { value: '4.1', label: 'One UI 4.1' }
  ];
  
  const featureOptions = [
    { id: 'good-lock', label: 'Good Lock Modules', icon: 'Lock' },
    { id: 'themes', label: 'Custom Themes', icon: 'Palette' },
    { id: 'icons', label: 'Icon Packs', icon: 'Grid3x3' },
    { id: 'wallpapers', label: 'Dynamic Wallpapers', icon: 'Image' },
    { id: 'sound', label: 'Sound Profiles', icon: 'Volume2' },
    { id: 'edge-panels', label: 'Edge Panels', icon: 'Sidebar' },
    { id: 'always-on', label: 'Always On Display', icon: 'Clock' },
    { id: 'gestures', label: 'Custom Gestures', icon: 'Hand' }
  ];
  
  const styleOptions = [
    { value: '', label: 'Select customization style' },
    { value: 'minimal', label: 'Minimal & Clean' },
    { value: 'colorful', label: 'Vibrant & Colorful' },
    { value: 'dark', label: 'Dark & Elegant' },
    { value: 'gaming', label: 'Gaming Focused' },
    { value: 'productivity', label: 'Productivity Optimized' }
  ];

  // Canvas validation utility
  const validateCanvas = useCallback((canvas) => {
    if (!canvas) return false;
    const rect = canvas.getBoundingClientRect();
    return rect.width > 0 && rect.height > 0;
  }, []);

  // Initialize canvas with proper dimensions
  const initializeCanvas = useCallback(() => {
    if (!canvasRef.current || !containerRef.current) return false;
    
    const canvas = canvasRef.current;
    const container = containerRef.current;
    const containerRect = container.getBoundingClientRect();
    
    // Set minimum dimensions to prevent zero-size canvas
    const minWidth = 300;
    const minHeight = 200;
    
    const width = Math.max(containerRect.width || minWidth, minWidth);
    const height = Math.max(containerRect.height || minHeight, minHeight);
    
    canvas.width = width;
    canvas.height = height;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    
    // Validate canvas dimensions
    if (validateCanvas(canvas)) {
      setCanvasReady(true);
      return true;
    }
    
    setCanvasReady(false);
    return false;
  }, [validateCanvas]);

  // Handle canvas operations safely
  const executeCanvasOperation = useCallback((operation) => {
    if (!canvasReady || !canvasRef.current) {
      console.warn('Canvas not ready for operations');
      return false;
    }
    
    try {
      const canvas = canvasRef.current;
      if (!validateCanvas(canvas)) {
        console.error('Canvas has invalid dimensions');
        return false;
      }
      
      operation(canvas);
      return true;
    } catch (error) {
      console.error('Canvas operation failed:', error);
      setError('Canvas operation failed. Please try again.');
      return false;
    }
  }, [canvasReady, validateCanvas]);

  // Initialize canvas on mount and resize
  useEffect(() => {
    const initCanvas = () => {
      setTimeout(() => {
        initializeCanvas();
      }, 100); // Small delay to ensure DOM is ready
    };

    initCanvas();
    
    const handleResize = () => {
      initCanvas();
    };

    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
      setCanvasReady(false);
    };
  }, [initializeCanvas]);

  // Load external Apper script safely
  useEffect(() => {
    const loadApperScript = async () => {
      try {
        // Ensure canvas is ready before loading external script
        if (!canvasReady) return;

        const script = document.createElement('script');
        script.src = 'https://cdn.apper.io/apper-dev-script/index.umd.js';
        script.async = true;
        
        script.onload = () => {
          console.log('Apper script loaded successfully');
          // Initialize Apper with canvas validation
          if (window.Apper && canvasRef.current) {
            executeCanvasOperation((canvas) => {
              window.Apper.init(canvas);
            });
          }
        };
        
        script.onerror = (error) => {
          console.error('Failed to load Apper script:', error);
          setError('Failed to load customization tools');
        };
        
        document.head.appendChild(script);
        
        return () => {
          document.head.removeChild(script);
        };
      } catch (error) {
        console.error('Error loading Apper script:', error);
        setError('Failed to initialize customization tools');
      }
    };

    loadApperScript();
  }, [canvasReady, executeCanvasOperation]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const toggleFeature = (featureId) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.includes(featureId)
        ? prev.features.filter(id => id !== featureId)
        : [...prev.features, featureId]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.model || !formData.oneUIVersion || formData.features.length === 0 || !formData.style) {
      setError('Please fill in all required fields and select at least one feature');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      const customization = await customizationService.generateConfig(formData);
      setResult(customization);
    } catch (err) {
      setError('Failed to generate customization config. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGenerate = async () => {
    if (!selectedModel || !customization.wallpaper) {
      setError('Please select a model and wallpaper');
      return;
    }

    if (!canvasReady) {
      setError('Canvas not ready. Please wait a moment and try again.');
      return;
    }

    setIsGenerating(true);
    setError(null);

    try {
      // Ensure canvas is still valid before generation
      if (!validateCanvas(canvasRef.current)) {
        throw new Error('Canvas dimensions are invalid');
      }

      // Execute canvas operations safely
      const success = executeCanvasOperation((canvas) => {
        // Simulate customization generation with canvas
        const ctx = canvas.getContext('2d');
        if (!ctx) throw new Error('Could not get canvas context');
        
        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Add background
        ctx.fillStyle = '#f0f0f0';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Add text
        ctx.fillStyle = '#333';
        ctx.font = '16px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('Generating customization...', canvas.width / 2, canvas.height / 2);
      });

      if (!success) {
        throw new Error('Canvas operation failed');
      }

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setGeneratedContent({
        preview: '/api/preview/customization',
        downloadUrl: '/api/download/customization'
      });
    } catch (err) {
      console.error('Generation failed:', err);
      setError(err.message || 'Failed to generate customization');
    } finally {
      setIsGenerating(false);
    }
  };
  
  const handleReset = () => {
    setFormData({
      model: '',
      oneUIVersion: '',
      features: [],
      style: ''
    });
    setResult(null);
    setError('');
  };

  const handleDownload = (configType) => {
    console.log('Downloading config:', configType);
    // Implementation for downloading config files
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Customization Generator
        </h1>
        <p className="text-gray-600">
          Create custom wallpapers and themes for your Samsung device
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Customization Options</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Device Model
              </label>
              <Select
                value={selectedModel}
                onChange={(e) => setSelectedModel(e.target.value)}
                className="w-full"
              >
                <option value="">Select a model</option>
                <option value="galaxy-s24">Galaxy S24</option>
                <option value="galaxy-s23">Galaxy S23</option>
                <option value="galaxy-note">Galaxy Note</option>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Wallpaper Style
              </label>
              <Input
                value={customization.wallpaper}
                onChange={(e) => setCustomization(prev => ({ ...prev, wallpaper: e.target.value }))}
                placeholder="Enter wallpaper preference"
                className="w-full"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Theme
              </label>
              <Input
                value={customization.theme}
                onChange={(e) => setCustomization(prev => ({ ...prev, theme: e.target.value }))}
                placeholder="Enter theme preference"
                className="w-full"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Icons
              </label>
              <Input
                value={customization.icons}
                onChange={(e) => setCustomization(prev => ({ ...prev, icons: e.target.value }))}
                placeholder="Enter icon preference"
                className="w-full"
              />
            </div>

            <Button
              onClick={handleGenerate}
              disabled={isGenerating || !canvasReady}
              className="w-full"
            >
              {isGenerating ? 'Generating...' : 'Generate Customization'}
            </Button>
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Preview</h2>
          
          <div 
            ref={containerRef}
            className="bg-gray-100 rounded-lg p-4 min-h-[300px] flex items-center justify-center relative"
          >
            {/* Canvas for customization generation */}
            <canvas
              ref={canvasRef}
              className="absolute inset-0 w-full h-full rounded-lg"
              style={{ 
                display: canvasReady ? 'block' : 'none',
                minWidth: '300px',
                minHeight: '200px'
              }}
            />
            
            {!canvasReady && (
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
                <p className="text-gray-500">Initializing canvas...</p>
              </div>
            )}
            
            {generatedContent && canvasReady ? (
              <div className="text-center relative z-10">
                <img 
                  src={generatedContent.preview} 
                  alt="Generated customization" 
                  className="max-w-full h-auto rounded-lg shadow-lg"
                  onError={(e) => {
                    console.error('Failed to load preview image');
                    e.target.style.display = 'none';
                  }}
                />
                <div className="mt-4">
                  <Button 
                    onClick={() => window.open(generatedContent.downloadUrl)}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    Download Customization
                  </Button>
                </div>
              </div>
            ) : canvasReady && !generatedContent ? (
              <p className="text-gray-500">
                Select your device model and customization options to generate a preview
              </p>
            ) : null}
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Input Form */}
        <div>
          <Card>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <h2 className="text-xl font-semibold mb-4">Device & Preferences</h2>
                
                <div className="space-y-6">
                  <ModelSelector
                    value={formData.model}
                    onChange={(e) => handleInputChange('model', e.target.value)}
                    label="Samsung Model"
                  />
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      One UI Version
                    </label>
                    <select
                      value={formData.oneUIVersion}
                      onChange={(e) => handleInputChange('oneUIVersion', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      {oneUIVersions.map((version) => (
                        <option key={version.value} value={version.value}>
                          {version.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Features to Include (Select all that apply)
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      {featureOptions.map((feature) => (
                        <button
                          key={feature.id}
                          type="button"
                          onClick={() => toggleFeature(feature.id)}
                          className={`p-3 rounded-lg border text-left transition-colors ${
                            formData.features.includes(feature.id)
                              ? 'border-blue-500 bg-blue-50'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <div className="flex items-center space-x-2">
                            <ApperIcon name={feature.icon} className="w-4 h-4" />
                            <span className="text-sm font-medium">{feature.label}</span>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Customization Style
                    </label>
                    <select
                      value={formData.style}
                      onChange={(e) => handleInputChange('style', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      {styleOptions.map((style) => (
                        <option key={style.value} value={style.value}>
                          {style.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
              
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <p className="text-red-600 text-sm">{error}</p>
                </div>
              )}
              
              <div className="flex space-x-4">
                <Button
                  type="submit"
                  disabled={loading || !formData.model || !formData.oneUIVersion || formData.features.length === 0 || !formData.style}
                  className="flex-1"
                >
                  {loading ? 'Generating...' : 'Generate Configuration'}
                </Button>
                <Button
                  type="button"
                  variant="secondary"
                  onClick={handleReset}
                >
                  Reset
                </Button>
              </div>
            </form>
          </Card>
        </div>
        
        {/* Results */}
        <div>
          {loading ? (
            <Loading type="skeleton" rows={1} />
          ) : result ? (
            <div className="space-y-6">
              {/* Configuration Summary */}
              <Card className="bg-gradient-to-r from-pink-50 to-rose-50 border-pink-200">
                <h3 className="text-lg font-semibold text-pink-900 mb-4">
                  Configuration Generated
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-pink-800">Model:</span>
                    <span className="font-medium text-pink-900">{result.model}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-pink-800">One UI Version:</span>
                    <span className="font-medium text-pink-900">{result.oneUIVersion}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-pink-800">Style:</span>
                    <Badge variant="warning">{result.style}</Badge>
                  </div>
                  <div className="flex justify-between items-start">
                    <span className="text-pink-800">Features:</span>
                    <div className="flex flex-wrap gap-1">
                      {result.features?.map((feature, index) => (
                        <Badge key={index} variant="info" size="sm">
                          {feature}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </Card>
              
              {/* Download Options */}
              <Card>
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  <ApperIcon name="Download" className="w-5 h-5 text-blue-500 mr-2" />
                  Download Configuration Files
                </h3>
                <div className="space-y-3">
                  {result.configs && Object.entries(result.configs).map(([configType, config]) => (
                    <div key={configType} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <ApperIcon name="FileText" className="w-5 h-5 text-gray-500" />
                        <div>
                          <h4 className="font-medium text-gray-900 capitalize">
                            {configType.replace('-', ' ')} Config
                          </h4>
                          <p className="text-sm text-gray-600">
                            {config.description || `Configuration for ${configType}`}
                          </p>
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDownload(configType)}
                        icon="Download"
                      >
                        Download
                      </Button>
                    </div>
                  ))}
                </div>
              </Card>
              
              {/* Installation Guide */}
              <Card>
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  <ApperIcon name="BookOpen" className="w-5 h-5 text-green-500 mr-2" />
                  Installation Guide
                </h3>
                <div className="space-y-3">
                  {result.installationSteps?.map((step, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-white text-xs font-bold">{index + 1}</span>
                      </div>
                      <p className="text-sm text-gray-700">{step}</p>
                    </div>
                  ))}
                </div>
              </Card>
              
              {/* Good Lock Modules */}
              {result.goodLockModules && result.goodLockModules.length > 0 && (
                <Card>
                  <h3 className="text-lg font-semibold mb-4 flex items-center">
                    <ApperIcon name="Lock" className="w-5 h-5 text-purple-500 mr-2" />
                    Required Good Lock Modules
                  </h3>
                  <div className="grid grid-cols-2 gap-3">
                    {result.goodLockModules.map((module, index) => (
                      <div key={index} className="flex items-center space-x-3 p-3 bg-purple-50 rounded-lg">
                        <ApperIcon name="Puzzle" className="w-5 h-5 text-purple-600" />
                        <div>
                          <h4 className="font-medium text-purple-900">{module.name}</h4>
                          <p className="text-sm text-purple-700">{module.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              )}
              
              {/* Tips */}
              <Card>
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  <ApperIcon name="Lightbulb" className="w-5 h-5 text-yellow-500 mr-2" />
                  Customization Tips
                </h3>
                <ul className="space-y-2">
                  {result.tips?.map((tip, index) => (
                    <li key={index} className="flex items-start space-x-2">
                      <ApperIcon name="CheckCircle" className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-gray-700">{tip}</span>
                    </li>
                  ))}
                </ul>
              </Card>
            </div>
          ) : (
            <Card className="text-center py-12">
              <div className="w-16 h-16 bg-gradient-to-r from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                <ApperIcon name="Palette" className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Ready to Customize
              </h3>
              <p className="text-gray-600">
                Select your device and preferences to generate a custom One UI configuration.
              </p>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default CustomizationGenerator;