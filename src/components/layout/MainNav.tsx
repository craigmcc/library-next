// components/layout/MainNav.tsx

/**
 * Main navigation controls for the overall layout.
 *
 * @packageDocumentation
 */

// External Modules ----------------------------------------------------------

//import * as React from "react";
import Link from "next/link";

// Internal Modules ----------------------------------------------------------

import {siteConfig} from "@/config/site";
import {cn} from "@/lib/utils";
import {NavItem} from "@/types/NavItem";

// Public Objects ------------------------------------------------------------

interface MainNavProps {
    items?: NavItem[];
}

export function MainNav({items}: MainNavProps) {
    return (
        <div className="flex gap-6 md:gap-10">
            <Link href="/" className="flex items-center space-x-2">
                <span>(Logo Icon)</span>
                <span className="inline-block font-bold">
                    {siteConfig.name}
                </span>
            </Link>
            {items?.length ? (
                <nav className="flex gap-6">
                    {items.map((item, index) =>
                        item.href && (
                            <Link
                                className={cn(
                                    "flex items-center text-sm font-medium text-muted-foreground",
                                    item.disabled && "cursor-not-allowed opacity-80"
                                )}
                                href={item.href}
                                key={index}
                            >
                                {item.title}
                            </Link>
                            )
                    )}
                </nav>
            ) : null }
        </div>
    )
}
