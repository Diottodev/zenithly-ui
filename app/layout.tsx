
import { AppProviders } from '$/components/app-providers'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'


const fontSans = Geist({
  variable: '--font-sans',
  subsets: ['latin'],
  display: 'swap',
})

const fontMono = Geist_Mono({
  variable: '--font-mono',
  subsets: ['latin'],
  display: 'swap',
})


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      className="dark scheme-only-dark"
      lang="pt-BR"
      suppressHydrationWarning
    >
      <body
        className={`${fontSans.variable} ${fontMono.variable} bg-sidebar font-sans antialiased`}
      >
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  )
}
