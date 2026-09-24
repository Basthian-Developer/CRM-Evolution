import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '@config/query/queryClient';
import { BrowserRouter, HashRouter } from 'react-router';
import './index.css';
import AppRouter from '@router/AppRouter';

// GitHub Pages usa hash; los demás entornos usan rutas del navegador.
const usaHashRouter = import.meta.env.VITE_ROUTER === 'hash';

// Monta la aplicación con una única caché de consultas.
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {/* Datos compartidos entre páginas y vistas. */}
    <QueryClientProvider client={queryClient}>
      {/* Navegación de la aplicación. */}
      {usaHashRouter ? (
        <HashRouter>
          <AppRouter />
        </HashRouter>
      ) : (
        <BrowserRouter>
          <AppRouter />
        </BrowserRouter>
      )}
    </QueryClientProvider>
  </StrictMode>,
);
