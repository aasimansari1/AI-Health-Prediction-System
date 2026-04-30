import { Route, Routes } from 'react-router-dom'
import Navbar from './components/Navbar.jsx'
import Footer from './components/Footer.jsx'
import Home from './pages/Home.jsx'
import Symptoms from './pages/Symptoms.jsx'
import Result from './pages/Result.jsx'
import DiseaseDetails from './pages/DiseaseDetails.jsx'
import About from './pages/About.jsx'
import DiseaseList from './pages/DiseaseList.jsx'

export default function App() {
  return (
    <div className="min-h-full flex flex-col">
      <Navbar />
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-8">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/symptoms" element={<Symptoms />} />
          <Route path="/result" element={<Result />} />
          <Route path="/diseases" element={<DiseaseList />} />
          <Route path="/diseases/:name" element={<DiseaseDetails />} />
          <Route path="/about" element={<About />} />
          <Route path="*" element={<Home />} />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}
