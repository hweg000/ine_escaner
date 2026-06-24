import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import IneVerification from './IneVerification.jsx';

// Punto de entrada standalone (para desarrollo sin el shell)
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <div style={{ minHeight: '100vh', background: '#f3f4f6', padding: 32, display: 'flex', justifyContent: 'center' }}>
      <IneVerification />
    </div>
  </StrictMode>,
);
