import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { AuthProvider } from './contexts/AuthProvider';
import PreprodProtection from './components/organisms/PreprodProtection';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AuthProvider>
      <PreprodProtection>
        <App />
      </PreprodProtection>
    </AuthProvider>
  </React.StrictMode>
);
