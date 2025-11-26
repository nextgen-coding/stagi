'use client'

import { ThemeProvider } from '@/components/theme-provider'
import { ReactQueryProvider } from '@/lib/react-query'

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <ReactQueryProvider>
        {children}
      </ReactQueryProvider>
    </ThemeProvider>
  )
}
