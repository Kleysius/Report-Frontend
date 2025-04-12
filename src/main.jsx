import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import 'flowbite';
import './index.css'
import App from './App.jsx'

// Vérifie si le mode sombre est activé dans localStorage
const isDarkMode = localStorage.getItem('darkMode') === 'true';
// Applique le mode sombre si nécessaire
if (isDarkMode) {
  document.documentElement.classList.add('dark');
} else {
  document.documentElement.classList.remove('dark');
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)