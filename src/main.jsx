import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import GetStarted from './GetStarted.jsx'
import Lander from './Lander.jsx'
import Leads from './Leads.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/get-started" element={<GetStarted />} />
        <Route path="/lander" element={<Lander />} />
        <Route path="/leads" element={<Leads />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
