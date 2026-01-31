import { type Metadata } from 'next'
import { ClerkProvider } from '@clerk/nextjs'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'
import Header from '@/components/Header'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'ChefBot Arena',
  description: 'The Esports of Cooking - Gamified AI Recipe Battles',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen bg-kitchen-900 text-foreground selection:bg-saffron-500 selection:text-black`}>
          <Header />
          <main className="pt-20 pb-10 px-4">
            {children}
          </main>
        </body>
      </html>
    </ClerkProvider>
  )
}
