import "@/styles/globals.css";
import { Inter as FontSans } from "next/font/google"
import localFont from "next/font/local"

import { Metadata } from "next";
import { cn } from "@/lib/utils";
import { ThemeProvider } from "@/providers/theme-provider"
import { Toaster } from "@/components/ui/toaster";
import { siteConfig } from "@/config/site"
import Chatbot from '@/components/chatbot';
import { AOSInit } from '@/components/aos-init';
import { TooltipProvider } from '@/components/ui/tooltip';
import AuthProvider from "@/providers/auth-provider";
import ScrollToTop from "@/components/ui/scroll-to-top";

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
})

const title = `AI Search - ${siteConfig.name}`;
const description = "Search.co is AI Search Platform.";

export const metadata: Metadata = {
  title,
  description,
  twitter: {
    card: "summary_large_image",
    title,
    description,
  },
  metadataBase: new URL('https://search.co/'),
  openGraph: {
    title: title,
    description: description,
    url: new URL('https://search.co/'),
    siteName: 'Search.co',
    type: 'website',
  },
};


export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
      </head>
      <AOSInit />
      <body
        id='root'
       className="custom-scrollbar"
      >
        <AuthProvider>
        <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
          <TooltipProvider>
            {children}
            <Toaster />
          </TooltipProvider>
          <ScrollToTop />
        </ThemeProvider>
        </AuthProvider>
        {/* <Chatbot /> */}

      </body>
    </html>
  );
}
