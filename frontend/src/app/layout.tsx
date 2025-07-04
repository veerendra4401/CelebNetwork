import { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Providers } from '@/components/Providers';
import Navbar from '@/components/Navbar';
import AuthGuard from '@/components/AuthGuard';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'CelebNetwork - Celebrity Discovery Platform',
  description: 'Discover and connect with global performing celebrities',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          <AuthGuard>
            <Navbar />
            <main className="container mx-auto px-4 py-8">
              {children}
            </main>
          </AuthGuard>
        </Providers>
      </body>
    </html>
  );
} 