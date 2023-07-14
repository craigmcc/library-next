// app/layout.ts

/**
 * Global layout for this application.
 *
 * @packageDocumentation
 */

// External Modules ----------------------------------------------------------

import { Inter } from 'next/font/google';
import { Metadata } from "next";

const inter = Inter({ subsets: ['latin'] })

// Internal Modules ----------------------------------------------------------

import './globals.css';
//import {SiteHeader} from "@/components/layout/SiteHeader";
import { siteConfig } from "@/config/site";

// Public Objects ------------------------------------------------------------

export const metadata: Metadata = {
  description: siteConfig.description,
  icons: {
    icon: "/favicon.ico",
  },
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.name}`,
  },
}

export interface RootLayoutProps {
  children: React.ReactNode,
}

export default function RootLayout({ children }: RootLayoutProps) {
return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <div className="flex-1">{children}</div>
      </body>
    </html>
)

/*
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <div className="relative flex min-h-screen flex-col">
          {/!*<SiteHeader/>*!/}
          <div className="flex-1">{children}</div>
        </div>
      </body>
    </html>
  )
*/
}
