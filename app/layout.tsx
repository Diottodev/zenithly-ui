import { Toaster } from '$/components/ui/sonner'
// import { AuthProvider } from "$/providers/auth-provider";
import { ThemeProvider } from '$/providers/theme-provider'
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
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          disableTransitionOnChange
          enableSystem
        >
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}
