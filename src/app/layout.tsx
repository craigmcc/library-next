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
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  )
}
