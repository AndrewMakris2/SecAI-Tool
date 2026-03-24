import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './styles/globals.css';

// NOTE: BrowserRouter and ToastProvider both live inside App.tsx.
// Do NOT add another BrowserRouter here — it causes "nested Router" errors.
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
