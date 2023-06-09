// components/layout/SiteHeader.tsx

/**
 * Header bar for the overall site layout.
 *
 * @packageDocumentation
 */

// External Modules ----------------------------------------------------------

import Link from "next/link";

// Internal Modules ----------------------------------------------------------

import {MainNav} from "@/components/layout/MainNav";
import {siteConfig} from "@/config/site";

// Public Objects ------------------------------------------------------------

export function SiteHeader() {
    return (
        <header className="sticky top-0 z-40 w-full border-b bg-indigo-50">
            <div className="container flex h-16 items-center space-x-4 sm:justify-between sm:space-x-0">
                <MainNav items={siteConfig.mainNav}/>
                <div className="flex flex-1 items-center justify-end space-x-4">
                    <nav className="flex items-center space-x-1">
                        <Link href={siteConfig.links.github} target="_blank" rel="noreferrer">
                            <span className="sr-only">GitHub</span>
                        </Link>
                    </nav>
                </div>
            </div>
        </header>
    )
}
