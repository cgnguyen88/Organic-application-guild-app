import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import { LanguageProvider } from './i18n/LanguageContext.jsx'
import { GLOBAL_CSS } from './styles/global.js'

// Inject global CSS design system
const style = document.createElement('style')
style.textContent = GLOBAL_CSS
document.head.appendChild(style)

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <LanguageProvider>
      <App />
    </LanguageProvider>
  </StrictMode>,
)
