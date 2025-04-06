import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import App from './App.tsx';

// biome-ignore lint/style/noNonNullAssertion: root element
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
