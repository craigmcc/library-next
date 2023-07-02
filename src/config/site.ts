// config/site.ts

/**
 * Configuration variables for the entire site.
 *
 * @packageDocumentation
 */

export type SiteConfig = typeof siteConfig;

export const siteConfig = {
    description: "Library Management Application based on NextJS",
    mainNav: [
        {
            title: "Home",
            href: "/",
        },
        {
            title: "Libraries",
            href: "/libraries",
        },
    ],
    name: "Library (Next)",
}
