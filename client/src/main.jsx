import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { CMSProvider } from './context/ContentContext.jsx'

// AOS Animation Library
import AOS from 'aos'
import 'aos/dist/aos.css'

// Initialize AOS
AOS.init({
  duration: 800,
  easing: 'ease-out-cubic',
  once: true,
  offset: 50,
})

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <CMSProvider>
      <App />
    </CMSProvider>
  </StrictMode>,
)
