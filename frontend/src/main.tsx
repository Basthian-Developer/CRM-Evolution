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

const useRouter = import.meta.env.VITE_ROUTER;

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      {useRouter === 'hash' ? (
        <HashRouter>
          <AppRouter />
        </HashRouter>
      ) : (
        <BrowserRouter>
          <AppRouter />
        </BrowserRouter>
      )
      }
    </QueryClientProvider>
  </StrictMode>,
)
