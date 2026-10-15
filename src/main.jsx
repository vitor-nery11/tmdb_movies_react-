import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { client } from './appwrite.js'
import './index.css'
import App from './App.jsx'

client.ping()
  .then(() => console.info('Appwrite connection successful'))
  .catch((error) => console.error('Appwrite connection failed:', error))

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
