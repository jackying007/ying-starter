import {
  useState,
  // useEffect,
  type PropsWithChildren
} from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from 'sonner'
import { Navbar } from '@/layouts/navbar'
import { Footer } from '@/layouts/footer'
// import { initVconsole } from '@/init-vconsole'
import { useAuth } from './use-auth'
import { useVisitor } from './use-visitor'
import { RouteLoading } from './route-loading'

export const AppProvider = ({ children }: PropsWithChildren) => {
  useAuth()
  useVisitor()

  // useEffect(() => {
  //   initVconsole()
  // }, [])

  const [queryClient] = useState(() => new QueryClient())
  return (
    <QueryClientProvider client={queryClient}>
      <main className="min-h-screen flex flex-col bg-accent" vaul-drawer-wrapper="">
        <RouteLoading />
        <Toaster position="top-center" richColors />
        <Navbar />
        <div className="flex-1 flex flex-col">{children}</div>
        <Footer />
      </main>
    </QueryClientProvider>
  )
}
