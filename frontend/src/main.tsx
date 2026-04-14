// Suppress benign ResizeObserver errors that flood the console
const _hideResizeObserverError = () => {
  window.addEventListener('error', (e) => {
    if (
      e.message === 'ResizeObserver loop limit exceeded' ||
      e.message === 'ResizeObserver loop completed with undelivered notifications.' ||
      e.message === 'Script error.'
    ) {
      e.stopImmediatePropagation();
      e.preventDefault();
    }
  });

  window.addEventListener('unhandledrejection', (e) => {
    if (
      e.reason && 
      (e.reason.message === 'ResizeObserver loop limit exceeded' ||
       e.reason.message === 'ResizeObserver loop completed with undelivered notifications.')
    ) {
      e.stopImmediatePropagation();
      e.preventDefault();
    }
  });

  const _consoleError = console.error;
  console.error = (...args) => {
    if (
      typeof args[0] === 'string' &&
      (args[0].includes('ResizeObserver loop limit exceeded') ||
       args[0].includes('ResizeObserver loop completed with undelivered notifications.'))
    ) {
      return;
    }
    _consoleError(...args);
  };
};

_hideResizeObserverError();

import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import posthog from 'posthog-js';

// Register GSAP plugins
gsap.registerPlugin(useGSAP);

// Initialize PostHog analytics
if (import.meta.env.VITE_POSTHOG_KEY) {
  posthog.init(import.meta.env.VITE_POSTHOG_KEY, {
    api_host: import.meta.env.VITE_POSTHOG_HOST || 'https://app.posthog.com',
    loaded: (posthog) => {
      if (import.meta.env.DEV) posthog.debug();
    }
  });
}

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ReactFlowProvider } from '@xyflow/react'
import { AuthProvider } from './context/AuthContext'
import 'blue-ether/tokens.css'
import './index.css'
import App from './App'

const container = document.getElementById('root');
if (container) {
  createRoot(container).render(
    <StrictMode>
      <AuthProvider>
        <ReactFlowProvider>
          <App />
        </ReactFlowProvider>
      </AuthProvider>
    </StrictMode>,
  )
}
