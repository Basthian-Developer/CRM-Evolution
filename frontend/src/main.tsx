import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClient } from '@config/query/queryClient'
import { BrowserRouter, HashRouter } from 'react-router'
import './index.css'
import AppRouter from '@router/AppRouter'

const Router =
  import.meta.env.VITE_ROUTER === 'hash'
    ? HashRouter
    : BrowserRouter

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <Router>
        <AppRouter />
      </Router>
    </QueryClientProvider>
  </StrictMode>,
)
