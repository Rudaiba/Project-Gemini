'use client';

import './globals.css';
import { ThemeProvider } from '@/components/theme-provider';
import { NeuralLayout } from '@/components/neural-layout';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <title>Gemini Multimodal Playground</title>
        <meta name="description" content="A modern interface for Gemini AI" />
      </head>
      <body suppressHydrationWarning>
        <ThemeProvider>
          <NeuralLayout>
            {children}
          </NeuralLayout>
        </ThemeProvider>
      </body>
    </html>
  );
}
