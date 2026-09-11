import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Safeguard against third-party extension injection collisions (e.g. TronLink)
try {
  let _tronVal = undefined;
  Object.defineProperty(window, 'tron', {
    get() { return _tronVal; },
    set(v) { _tronVal = v; },
    configurable: true,
    enumerable: true,
  });
} catch (_) {}

const rootElement = document.getElementById('root');
if (rootElement) {
  createRoot(rootElement).render(
    <StrictMode>
      <App />
    </StrictMode>,
  );
}

