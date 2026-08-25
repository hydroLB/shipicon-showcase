import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'ShipIcon Web Showcase',
  description: 'Explore ShipIcon in demo mode and preview its icon-generation workflow.',
  icons: { icon: '/shipicon-demo-source.png' },
  openGraph: {
    title: 'ShipIcon Web Showcase',
    description: 'Explore ShipIcon in demo mode and preview its icon-generation workflow.',
    images: ['/og.jpg'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ShipIcon Web Showcase',
    description: 'Explore ShipIcon in demo mode and preview its icon-generation workflow.',
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
