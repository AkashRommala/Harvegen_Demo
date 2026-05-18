import Navbar from '../components/Navbar'
import BottomNav from '../components/BottomNav'
import Footer from '../components/Footer'
import BackToTop from '../components/BackToTop'
import { UserProvider } from '../context/UserContext'
import { ThemeProvider } from '../components/ThemeProvider'
import ThemeController from '../components/ThemeController'
import '../styles/globals.css'

export const metadata = {
  title: 'Embedded Projects Hub - Learn Embedded Systems',
  description: 'Open-source embedded systems learning: microcontrollers, IoT, RTOS — free, practical, and engineer-made.',
}

export const viewport = {
  width: '1280',
  initialScale: 1,
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" data-scroll-behavior="smooth" suppressHydrationWarning>
      <body className="font-sans antialiased bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-200 min-h-screen flex flex-col" suppressHydrationWarning>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
          <UserProvider>
            <ThemeController />
            <Navbar />
            <main id="main-scroll-container" className="flex-1 min-h-0 relative">
              {children}
              <Footer />
            </main>
            <BottomNav />
            <BackToTop />
          </UserProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
