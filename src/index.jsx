import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'

// Importações globais de CSS, se existirem
// Ajuste conforme necessário para seu projeto
import 'bootstrap/dist/css/bootstrap.min.css'

// Polyfill para process.env (se necessário)
window.process = {
  env: {
    NODE_ENV: import.meta.env.MODE
  }
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
