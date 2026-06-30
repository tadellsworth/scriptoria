import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './theme/tokens.css';
import './theme/global.css';
import { StoreProvider } from './state/store';
import { NavProvider } from './state/nav';
import { App } from './App';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <StoreProvider>
      <NavProvider>
        <App />
      </NavProvider>
    </StoreProvider>
  </StrictMode>,
);
