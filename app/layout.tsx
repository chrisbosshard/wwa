import type { Metadata } from "next";
import Script from "next/script";
import { Providers } from "./providers";
import { fetchApplication, fetchGlobalSettings } from "@lib/directus/queries";
import { resolveWishLimit } from "@lib/directus/global-settings";
import "./globals.css";
import "./hero.css";

export const metadata: Metadata = {
  title: "Weihnachtswunschaktion | Caritas Zürich",
  description: "Weihnachtswunschaktion der Caritas Zürich – Wünsche erfüllen und Kinder unterstützen.",
};

export const dynamic = "force-dynamic";

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  let initialAppState = "registration";
  let wishLimit = 0;
  try {
    const [application, globalSettings] = await Promise.all([
      fetchApplication(),
      fetchGlobalSettings(),
    ]);
    initialAppState = application?.state || "registration";
    wishLimit = resolveWishLimit(globalSettings);
  } catch (error) {
    console.error("RootLayout: failed to load application state or global settings", error);
  }

  return (
    <html lang="de">
      <head>
        <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons" />
        <link
          href="https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap"
          rel="stylesheet"
        />
        <link href="https://fonts.googleapis.com/css2?family=Shadows+Into+Light&display=swap" rel="stylesheet" />
      </head>
      <body>
        <Script src="https://www.googletagmanager.com/gtag/js?id=UA-207750510-1" strategy="afterInteractive" />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'UA-207750510-1', {
              page_path: window.location.pathname,
            });
          `}
        </Script>
        <Providers initialAppState={initialAppState} wishLimit={wishLimit}>{children}</Providers>
      </body>
    </html>
  );
}
