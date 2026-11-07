import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
// Fontes guardadas dentro do app (não dependem de internet externa na hora da demo)
import '@fontsource-variable/nunito'
import '@fontsource-variable/inter'
import '@fontsource-variable/source-serif-4'
import '@fontsource-variable/outfit'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
