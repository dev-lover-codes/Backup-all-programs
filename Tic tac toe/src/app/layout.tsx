import type {Metadata} from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import Head from 'next/head';
import { FirebaseClientProvider } from '@/firebase/client-provider';
import { UserAuthStatus } from '@/components/user-auth-status';

export const metadata: Metadata = {
  title: 'Emoji Tic-Tac-Toe Arena',
  description: 'A modern Tic-Tac-Toe game with selectable emojis and multiple difficulty levels.',
  manifest: '/manifest.json',
  themeColor: '#09090b',
  openGraph: {
    title: 'Emoji Tic-Tac-Toe Arena',
    description: 'A modern Tic-Tac-Toe game with selectable emojis and multiple difficulty levels.',
    url: 'https://emoji-tic-tac-toe-arena.web.app',
    siteName: 'Emoji Tic-Tac-Toe Arena',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Emoji Tic-Tac-Toe Arena',
    description: 'A modern Tic-Tac-Toe game with selectable emojis and multiple difficulty levels.',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <Head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
      </Head>
      <body className="font-body antialiased">
        <FirebaseClientProvider>
          <UserAuthStatus />
          {children}
        </FirebaseClientProvider>
        <Toaster />
      </body>
    </html>
  );
}
