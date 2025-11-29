import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'
import { Toaster } from 'sonner';
import TanstackQueryProvider from '@/components/provider/query.provider';

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: 'D3 Workspace',
  description: 'Muti-tentat Workspace',
  icons: {

  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans antialiased`}>
        <TanstackQueryProvider>
          {children}
          <Analytics />
          <Toaster />
        </TanstackQueryProvider>
      </body>
    </html>
  )
}
