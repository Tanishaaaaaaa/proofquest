'use client'

import { WalletProvider } from '@solana/wallet-adapter-react'
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui'
import { PhantomWalletAdapter } from '@solana/wallet-adapter-wallets'
import { ConnectionProvider } from '@solana/wallet-adapter-react'
import { Toaster } from 'react-hot-toast'
import { useMemo } from 'react'
import Navigation from '../components/Navigation'

require('@solana/wallet-adapter-react-ui/styles.css')

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const endpoint = process.env.NEXT_PUBLIC_SOLANA_RPC_URL || 'https://api.devnet.solana.com'
  
  const wallets = useMemo(
    () => [
      new PhantomWalletAdapter(),
    ],
    []
  )

  return (
    <html lang="en">
      <body>
        <ConnectionProvider endpoint={endpoint}>
          <WalletProvider wallets={wallets} autoConnect>
            <WalletModalProvider>
              <Navigation />
              {children}
              <Toaster 
                position="top-right"
                toastOptions={{
                  style: {
                    background: '#1a1a1a',
                    color: '#fff',
                    border: '1px solid #2a2a2a',
                  },
                }}
              />
            </WalletModalProvider>
          </WalletProvider>
        </ConnectionProvider>
      </body>
    </html>
  )
}
