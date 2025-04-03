import { Assets } from "@/components/Assets";
import { Inter } from "next/font/google";
import Script from "next/script";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en" className="h-full">
            <head>
                <link rel="manifest" href="/site.webmanifest" />
                <title>Ordkupan</title>
                <meta name="description" content="Det svenska Spelling Bee-spelet"></meta>

                <meta name="og:title" content="Ordkupan" />
                <meta name="keywords" content="ordspel, svenska, spelling bee, ordkupan" />
                <meta name="og:description" content="Det svenska Spelling Bee-spelet" />
                <meta name="og:image" content="/manifest-icon-512.maskable.png" />
                <meta name="og:url" content="https://ordkupan.se" />
                <meta name="og:site_name" content="Ordkupan" />

                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:title" content="Ordkupan" />
                <meta name="twitter:description" content="Det svenska Spelling Bee-spelet" />
                <meta
                    name="twitter:image"
                    content="https://ordkupan.se/manifest-icon-512.maskable.png"
                />

                <meta name="viewport" content="initial-scale=1, viewport-fit=cover" />
                <meta name="apple-mobile-web-app-status-bar-style" content="white-translucent" />

                <Assets />

                <Script
                    defer
                    src="https://analytics.banjoanton.com/script.js"
                    data-website-id="c86866c7-2577-4ec9-8a0d-c79a4d5647c7"
                ></Script>

                <Script
                    src="https://www.googletagmanager.com/gtag/js?id=G-PRBN0CL5K4"
                    strategy="afterInteractive"
                />
                <Script id="google-analytics" strategy="afterInteractive">
                    {`
                    window.dataLayer = window.dataLayer || [];
                    function gtag(){dataLayer.push(arguments);}
                    gtag('js', new Date());

                    gtag('config', 'G-PRBN0CL5K4');
                `}
                </Script>
            </head>

            <body className={`${inter.className} h-full`}>{children}</body>
        </html>
    );
}
