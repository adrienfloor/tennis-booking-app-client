import '../styles/globals.css'
import type { AppProps } from 'next/app'
import NextNProgress from 'nextjs-progressbar'

import Layout from '../components/Layout'
import AuthContextProvider from '../contexts/AuthContext'
import UsersContextProvider from '../contexts/UsersContext'
import BookingContextProvider from '../contexts/BookingContext'
import ToastContextProvider from '../contexts/ToastContext'

if (process.env.NEXT_PUBLIC_ENV === 'production') {
  console.log = console.warn = console.error = () => { }
}

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <AuthContextProvider>
      <UsersContextProvider>
        <ToastContextProvider>
          <BookingContextProvider>
            <Layout>
              <NextNProgress options={{ showSpinner: false }} />
              <Component {...pageProps} />
            </Layout>
          </BookingContextProvider>
        </ToastContextProvider>
      </UsersContextProvider>
    </AuthContextProvider>
  )
}

export default MyApp
