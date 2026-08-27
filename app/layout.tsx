import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'ShipIcon — Attach your app, create your icon.',
  description: 'Create and refine app icons with simple, natural-language requests.',
  icons: { icon: '/shipicon-demo-source.png' },
  openGraph: {
    title: 'ShipIcon — Attach your app, create your icon.',
    description: 'Create and refine app icons with simple, natural-language requests.',
    images: ['/og.jpg'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ShipIcon — Attach your app, create your icon.',
    description: 'Create and refine app icons with simple, natural-language requests.',
    images: ['/og.jpg'],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
