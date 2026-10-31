import type { Metadata, Viewport } from 'next';
import Script from 'next/script';
import { ReactNode } from 'react';
import Providers from './providers';
import '../index.css';

const faviconBase = 'https://storage.googleapis.com/www.minair.me/favicons';
export const metadata: Metadata = {
    title: 'The Minair Report',
    description: 'The Minair Report',
    icons: {
        icon: [{ url: `${faviconBase}/favicon-32x32.png`, sizes: '32x32' }, { url: `${faviconBase}/favicon-16x16.png`, sizes: '16x16' }],
        apple: `${faviconBase}/apple-touch-icon.png`
    },
    manifest: `${faviconBase}/site.webmanifest`
};
export const viewport: Viewport = { themeColor: '#ffffff' };

export default function RootLayout({ children }: { children: ReactNode }) {
    return (
        <html lang="en">
            <head>
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
                <link href="https://fonts.googleapis.com/css2?family=Barlow+Condensed:ital,wght@1,700&family=Dancing+Script:wght@700&family=Roboto:wght@400;500;700&display=swap" rel="stylesheet" />
                <link rel="mask-icon" href={`${faviconBase}/safari-pinned-tab.svg`} color="#5bbad5" />
            </head>
            <body>
                <Providers>{children}</Providers>
                <Script src="https://www.googletagmanager.com/gtag/js?id=G-E6TKKXZEJP" strategy="afterInteractive" />
                <Script id="minair-analytics" strategy="afterInteractive">{`
                    window.dataLayer = window.dataLayer || [];
                    window.gtag = function () { window.dataLayer.push(arguments); };
                    window.gtag('js', new Date());
                    window.gtag('config', 'G-E6TKKXZEJP');
                `}</Script>
            </body>
        </html>
    );
}
