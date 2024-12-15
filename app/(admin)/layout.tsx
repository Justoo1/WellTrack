import Header from '@/components/admin/Header'
import { Sidebar } from '@/components/admin/Sidebar'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Employee Welfare Dashboard',
  description: 'Admin dashboard for managing employee welfare contributions and events',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex h-full lg:h-screen bg-zinc-950/80">
        <Sidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        {children}
        </div>
    </div>
  )
}

