import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import { AuthProvider } from './lib/AuthContext.tsx';
import { TranslationProvider } from './lib/i18n.tsx';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <TranslationProvider>
      <AuthProvider>
        <App />
      </AuthProvider>
    </TranslationProvider>
  </StrictMode>,
);
