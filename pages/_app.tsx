import type { AppProps } from 'next/app';
import { SWRConfig } from 'swr';
import { CssBaseline, ThemeProvider } from '@mui/material'
import { lightTheme } from '../themes';
import { UIProvider, CartProvider, AuthProvider } from '../context';
import '../styles/globals.css';

export default function App({ Component, pageProps }: AppProps) {

    return (
        <SWRConfig 
            value={{
                fetcher: (resource, init) => fetch(resource, init).then(res => res.json())
            }}
        >
            <AuthProvider isLoggedIn={false} >
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
    )
    
}
