import Header from '@/components/organisms/Header'
import Footer from '@/components/organisms/Footer'

const Layout = ({ children }) => {
  const handleSearch = (searchTerm) => {
    // Search functionality - could integrate with routing or state management
    console.log('Search:', searchTerm)
  }
  
  return (
    <div className="min-h-screen bg-background">
      <Header onSearch={handleSearch} />
      <main className="flex-1">
        {children}
      </main>
      <Footer />
    </div>
  )
}

export default Layout