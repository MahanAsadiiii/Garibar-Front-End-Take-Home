import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ConfigProvider } from 'antd'
import enUS from 'antd/locale/en_US'
import './index.css'
import App from './App.tsx'

// Shared React Query client for server-state caching and mutations
const queryClient = new QueryClient()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {/* Provides React Query context to the whole app */}
    <QueryClientProvider client={queryClient}>
      {/* Ant Design theme/locale (English UI, no RTL) */}
      <ConfigProvider locale={enUS}>
        <App />
      </ConfigProvider>
    </QueryClientProvider>
  </StrictMode>,
)
