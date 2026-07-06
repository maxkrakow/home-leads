import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import GetStarted from './GetStarted.jsx'
import Lander from './Lander.jsx'
import Leads from './Leads.jsx'
import PortalRoute from './clientPortal/PortalRoute.jsx'
import AdminRoute from './clientPortal/AdminRoute.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/get-started" element={<GetStarted />} />
        <Route path="/lander" element={<Lander />} />
        <Route path="/leads" element={<Leads />} />
        {/* Client portal — magic-link sign-in, then the tabbed dashboard. */}
        <Route path="/portal" element={<PortalRoute />} />
        {/* Admin panel — same magic-link auth, gated by ADMIN_EMAILS in firebase.js. */}
        <Route path="/portal-admin" element={<AdminRoute />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
