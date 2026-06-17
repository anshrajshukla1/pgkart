import React from 'react'
import ReactDOM from 'react-dom/client'
import { Provider } from 'react-redux'
import { HelmetProvider } from 'react-helmet-async'
import { Toaster } from 'react-hot-toast'
import App from './App.jsx'
import store from './store/reducers/store.js'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      <HelmetProvider>
        <App />
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              fontFamily: 'var(--font-body)',
              borderRadius: 'var(--radius-medium)',
              fontSize: 'var(--font-size-sm)',
              background: 'var(--color-white)',
              color: 'var(--color-midnight)',
              border: '1.5px solid var(--color-secondary)',
              boxShadow: 'var(--shadow-floating)',
            },
            success: { iconTheme: { primary: '#2E7D32', secondary: 'white' } },
            error: { iconTheme: { primary: '#C62828', secondary: 'white' } },
          }}
        />
      </HelmetProvider>
    </Provider>
  </React.StrictMode>
)
