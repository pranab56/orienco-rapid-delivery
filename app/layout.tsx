import { I18nProvider } from "@/components/providers/i18n-provider";
import { LenisProvider } from "@/lib/lenis";
import SplashScreen from "@/components/shared/SplashScreen";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ReduxProvider } from "@/components/providers/ReduxProvider";
import { Toaster } from "react-hot-toast";
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Orienco Rapid Delivery",
  description: "Orienco Rapid Delivery - Fast and reliable delivery services",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-white text-black selection:bg-zinc-100">
        <ReduxProvider>
          <I18nProvider>
            {/* <SplashScreen /> */}
            <LenisProvider>
              {children}
              <Toaster />
            </LenisProvider>
          </I18nProvider>
        </ReduxProvider>
      </body>
    </html>
  );
}
