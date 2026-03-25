import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import DashboardPage from './DashboardPage.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
    <DashboardPage />
  </StrictMode>,
)
