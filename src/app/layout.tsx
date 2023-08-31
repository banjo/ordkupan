import { Assets } from "@/components/Assets";
import { Inter } from "next/font/google";
import Script from "next/script";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en" className="h-full">
            <link rel="manifest" href="/site.webmanifest" />
            <title>Ordkupan</title>
            <meta name="description" content="Det svenska Spelling Bee-spelet"></meta>

            <meta name="og:title" content="Ordkupan" />
            <meta name="og:description" content="Det svenska Spelling Bee-spelet" />
            <meta name="og:image" content="/manifest-icon-512.maskable.png" />
            <meta name="og:url" content="https://ordkupan.se" />
            <meta name="og:site_name" content="Ordkupan" />

            <meta name="viewport" content="initial-scale=1, viewport-fit=cover" />
            <meta name="apple-mobile-web-app-status-bar-style" content="white-translucent" />

            <Assets />

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

            <Script
                async
                src="https://analytics.host.banjoanton.com/tracker.js"
                data-ackee-server="https://analytics.host.banjoanton.com"
                data-ackee-domain-id="1225b57d-c96f-4585-8189-affb2abfeadb"
            ></Script>

            <body className={`${inter.className} h-full`}>{children}</body>
        </html>
    );
}
