import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import Layout from '@/components/organisms/Layout'
import Home from '@/components/pages/Home'
import TradeInEstimator from '@/components/pages/TradeInEstimator'
import BatteryHealthChecker from '@/components/pages/BatteryHealthChecker'
import PhoneComparison from '@/components/pages/PhoneComparison'
import UpgradeAdvisor from '@/components/pages/UpgradeAdvisor'
import FirmwareChecker from '@/components/pages/FirmwareChecker'
import CustomizationGenerator from '@/components/pages/CustomizationGenerator'
import UpdateTracker from '@/components/pages/UpdateTracker'

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/trade-in-estimator" element={<TradeInEstimator />} />
          <Route path="/battery-health-checker" element={<BatteryHealthChecker />} />
          <Route path="/phone-comparison" element={<PhoneComparison />} />
          <Route path="/upgrade-advisor" element={<UpgradeAdvisor />} />
          <Route path="/firmware-checker" element={<FirmwareChecker />} />
          <Route path="/customization-generator" element={<CustomizationGenerator />} />
          <Route path="/update-tracker" element={<UpdateTracker />} />
        </Routes>
      </Layout>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        style={{ zIndex: 9999 }}
      />
    </Router>
  )
}

export default App