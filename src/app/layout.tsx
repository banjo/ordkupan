import { Inter } from "next/font/google";
import Script from "next/script";
import { Assets } from "../components/Assets";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
    title: "Ordkupan",
    description: "Det svenska Spelling Bee-spelet",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en" className="h-full">
            <link rel="manifest" href="/site.webmanifest" />
            <meta name="viewport" content="initial-scale=1, viewport-fit=cover" />
            <meta name="apple-mobile-web-app-status-bar-style" content="white-translucent" />

            <Assets />

            <Script
                defer
                data-domain="ordkupan.se"
                src="http://analytics.deploy.banjoanton.com/js/script.js"
            />

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

            <body className={`${inter.className} h-full`}>{children}</body>
        </html>
    );
}
