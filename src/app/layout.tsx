import './globals.css';
import type { Metadata } from 'next';
import { ApolloProviderWrapper } from '@/components/providers/ApolloProvider';
import { ThemeProvider } from '@/components/providers/ThemeProvider';
import { Header } from '@/components/layout/Header';
import { ComparisonPanel } from '@/components/comparison/ComparisonPanel';

export const metadata: Metadata = {
  title: 'Pokédex - Discover and Explore Pokemon',
  description: 'A comprehensive Pokédex application built with Next.js, featuring Pokemon search, filtering, comparison, and detailed information.',
  keywords: 'pokemon, pokedex, search, filter, compare, stats, types, generation',
  authors: [{ name: 'Pokédex App' }],
  openGraph: {
    title: 'Pokédex - Discover and Explore Pokemon',
    description: 'A comprehensive Pokédex application built with Next.js',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning data-theme="dark">
      <body>
        <ApolloProviderWrapper>
          <ThemeProvider>
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
              <Header />
              <main className="pb-24">
                {children}
              </main>
              <ComparisonPanel />
            </div>
          </ThemeProvider>
        </ApolloProviderWrapper>
      </body>
    </html>
  );
}