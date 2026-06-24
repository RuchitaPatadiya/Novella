import { useState } from 'react'
import { BrowserRouter } from 'react-router-dom'
import Navbar from './components/common/Navbar'
import Footer from './components/common/Footer'
import Home from './pages/Home/Home'

function App() {

  return (
    <div>
      <Navbar />
      <Home />
      <Footer />
    </div>
  
  )
}

export default App
