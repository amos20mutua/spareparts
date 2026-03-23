import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './index.css';
import { ToastProvider } from './components/ui/ToastProvider';
import { AuthProvider } from './hooks/useAuth';
import { SiteContentProvider } from './hooks/useSiteContent';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <ToastProvider>
        <AuthProvider>
          <SiteContentProvider>
            <App />
          </SiteContentProvider>
        </AuthProvider>
      </ToastProvider>
    </BrowserRouter>
  </React.StrictMode>,
);
