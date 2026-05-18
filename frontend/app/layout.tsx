import type { Metadata } from 'next';
import { Geist } from 'next/font/google';
import { Toaster } from 'sonner';
import NextTopLoader from 'nextjs-toploader';
import './globals.css';
import { AuthProvider } from '@/components/auth/AuthProvider';
import ConditionalShell from '@/components/layout/ConditionalShell';
import ScrollToTop from '@/components/layout/ScrollToTop';

const geist = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Accountant Hub — Find Accounting Professionals',
  description: 'A marketplace connecting companies with skilled accounting professionals.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geist.variable} h-full antialiased`} suppressHydrationWarning>
      <body className="min-h-full flex flex-col bg-white text-ink">
        <AuthProvider>
          <NextTopLoader color="#019a51" showSpinner={false} height={3} />
          <ScrollToTop />
          <ConditionalShell>{children}</ConditionalShell>
          <Toaster richColors position="top-right" />
        </AuthProvider>
      </body>
    </html>
  );
}
