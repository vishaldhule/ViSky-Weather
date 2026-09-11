// Suppress harmless development HMR websocket notices in containerized environment
if (typeof window !== 'undefined') {
  const isViteNotice = (val: any) => {
    if (!val) return false;
    const str = typeof val === 'string' ? val : (val.message || val.stack || String(val));
    return str.includes('[vite]') || str.includes('websocket');
  };
  const origErr = console.error;
  const origWarn = console.warn;
  console.error = (...args: any[]) => {
    if (args.some(isViteNotice)) return;
    origErr.apply(console, args);
  };
  console.warn = (...args: any[]) => {
    if (args.some(isViteNotice)) return;
    origWarn.apply(console, args);
  };
  window.addEventListener('error', (e) => {
    if (isViteNotice(e.message) || isViteNotice(e.error)) {
      e.preventDefault();
      e.stopImmediatePropagation();
    }
  }, true);
  window.addEventListener('unhandledrejection', (e) => {
    if (isViteNotice(e.reason)) {
      e.preventDefault();
      e.stopImmediatePropagation();
    }
  }, true);
}

import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
