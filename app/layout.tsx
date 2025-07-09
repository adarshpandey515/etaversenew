import type { Metadata } from 'next'
import './globals.css'
// In app/layout.tsx or wherever your layout root is:
import { Toaster } from "@/components/ui/sonner" // or wherever your toast component is

export const metadata: Metadata = {
  title: 'Restaurant App',
  description: 'Created with Chefs',
  generator: 'Adarsh',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
      <Toaster></Toaster>
    </html>
  )
}
