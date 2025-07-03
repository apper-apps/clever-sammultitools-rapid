import { Link } from 'react-router-dom'
import ApperIcon from '@/components/ApperIcon'

const Footer = () => {
  const toolCategories = [
    {
      title: 'Trade-In Tools',
      links: [
        { name: 'Trade-In Estimator', path: '/trade-in-estimator' },
        { name: 'Phone Comparison', path: '/phone-comparison' },
        { name: 'Upgrade Advisor', path: '/upgrade-advisor' }
      ]
    },
    {
      title: 'Technical Tools',
      links: [
        { name: 'Battery Health Checker', path: '/battery-health-checker' },
        { name: 'Firmware Checker', path: '/firmware-checker' },
        { name: 'Update Tracker', path: '/update-tracker' }
      ]
    },
    {
      title: 'Customization',
      links: [
        { name: 'One UI Generator', path: '/customization-generator' },
        { name: 'Theme Builder', path: '/customization-generator' },
        { name: 'Good Lock Setup', path: '/customization-generator' }
      ]
    }
  ]
  
  return (
    <footer className="bg-white border-t border-gray-200 mt-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-primary to-blue-600 rounded-lg flex items-center justify-center">
                <ApperIcon name="Smartphone" className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold gradient-text">SamMultiTools</span>
            </div>
            <p className="text-gray-600 text-sm">
              AI-powered tools for Samsung mobile users. Get instant insights, trade-in values, and optimization tips.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-primary transition-colors">
                <ApperIcon name="Github" className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-primary transition-colors">
                <ApperIcon name="Twitter" className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-primary transition-colors">
                <ApperIcon name="Mail" className="w-5 h-5" />
              </a>
            </div>
          </div>
          
          {/* Tool Categories */}
          {toolCategories.map((category) => (
            <div key={category.title} className="space-y-4">
              <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">
                {category.title}
              </h3>
              <ul className="space-y-2">
                {category.links.map((link) => (
                  <li key={link.name}>
                    <Link
                      to={link.path}
                      className="text-sm text-gray-600 hover:text-primary transition-colors"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        
        <div className="mt-8 pt-8 border-t border-gray-200 flex flex-col sm:flex-row justify-between items-center">
          <p className="text-sm text-gray-600">
            © 2024 SamMultiTools. All rights reserved.
          </p>
          <div className="flex space-x-6 mt-4 sm:mt-0">
            <a href="#" className="text-sm text-gray-600 hover:text-primary transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="text-sm text-gray-600 hover:text-primary transition-colors">
              Terms of Service
            </a>
            <a href="#" className="text-sm text-gray-600 hover:text-primary transition-colors">
              Contact
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer