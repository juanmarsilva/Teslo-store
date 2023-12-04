import type { AppProps } from 'next/app';
import { SessionProvider } from "next-auth/react"
import { SWRConfig } from 'swr';

import { CssBaseline, ThemeProvider } from '@mui/material'

import { lightTheme } from '../themes';
import { UIProvider, CartProvider, AuthProvider } from '../context';

import { PayPalScriptProvider } from "@paypal/react-paypal-js";

import '../styles/globals.css';

export default function App({ Component, pageProps }: AppProps) {

    return (
        <SessionProvider>
            <PayPalScriptProvider options={{ clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || '' }}>
                <SWRConfig 
                    value={{
                        fetcher: (resource, init) => fetch(resource, init).then(res => res.json())
                    }}
                >
                    <AuthProvider>
                        <CartProvider>
                            <UIProvider>
                                <ThemeProvider theme={ lightTheme } >
                                    <CssBaseline />
                                    <Component {...pageProps} />    
                                </ThemeProvider>
                            </UIProvider>
                        </CartProvider>
                    </AuthProvider>
                </SWRConfig>
            </PayPalScriptProvider>
        </SessionProvider>
    )
    
}
