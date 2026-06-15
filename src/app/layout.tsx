import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { QueryProvider } from '@/providers/query-provider'
import './globals.css'

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: 'SafeHelm Dashboard - Mining Safety Monitoring',
  description: 'Real-time monitoring dashboard for smart safety helmets in mining operations.',
  generator: 'v0.app',
  icons: {
    icon: '/the_logo.png',
    apple: '/the_logo.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html suppressHydrationWarning={true} lang="en" className="scroll-smooth bg-background text-foreground">
      <body suppressHydrationWarning={true} className="font-sans antialiased">
        <QueryProvider>
          {children}
        </QueryProvider>
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
