"use server"

// actions/LibraryActions.ts

/**
 * Server side actions for Library model objects.
 *
 * @packageDocumentation
 */

// External Modules ----------------------------------------------------------

import {
    Library,
    Prisma,
} from "@prisma/client";

// Internal Modules ----------------------------------------------------------

import prisma from "../prisma";
import {ServerError} from "../util/HttpErrors";

// Public Types --------------------------------------------------------------

/**
 * A base Library with optional nested child object arrays.
 */
export type LibraryPlus = Library & Prisma.LibraryGetPayload<{
    include: {
        authors: true,
        series: true,
        stories: true,
        volumes: true,
    }
}>;

// Action CRUD Functions -----------------------------------------------------

/**
 * Return all Library instances that match the specified criteria.
 *
 * @param query                         Optional match/include/pagination parameters
 *
 * @throws ServerError                  If a low level error is thrown
 */
export const all = async (query?: any): Promise<LibraryPlus[]> => {
    const args: Prisma.LibraryFindManyArgs = {
        // cursor???
        // distinct???
        include: include(query),
        orderBy: orderBy(query),
        select: select(query),
        skip: skip(query),
        take: take(query),
        where: where(query),
    }
    try {
        const results = await prisma.library.findMany(args);
        return results as LibraryPlus[];
    } catch (error) {
        throw new ServerError(
            error as Error,
            "LibraryActions.all",
        )
    }
}

// Support Functions ---------------------------------------------------------

/**
 * Calculate and return the "include" options from the specified query
 * parameters, if any were specified.
 */
export const include = (query?: any): Prisma.LibraryInclude | undefined => {
    if (!query) {
        return undefined;
    }
    const include: Prisma.LibraryInclude = {};
    if (query.hasOwnProperty("withAuthors")) {
        include.authors = true;
    }
    if (query.hasOwnProperty("withSeries")) {
        include.series = true;
    }
    if (query.hasOwnProperty("withStories")) {
        include.stories = true;
    }
    if (query.hasOwnProperty("withVolumes")) {
        include.volumes = true;
    }
    if (Object.keys(include).length > 0) {
        return include;
    } else {
        return undefined;
    }
}

/**
 * Calculate and return the "orderBy" options from the specified query
 * parameters, if any were specified.
 */
export const orderBy = (query?: any): Prisma.LibraryOrderByWithRelationInput => {
    return {
        name: "asc",
    }
}

/**
 * Calculate and return the "select" options from the specified query
 * parameters, if any were specified.
 */
export const select = (query?: any): Prisma.LibrarySelect | undefined => {
    return undefined; // TODO - for future use
}

/**
 * Calculate and return the "skip" options from the specified query
 * parameters, if any were specified.
 *
 * For backwards compatibility, either "offset" or "skip" are recognized.
 */
export const skip = (query?: any): number | undefined => {
    if (!query) {
        return undefined;
    }
    if (query.hasOwnProperty("offset")) {
        return Number(query.offset);
    } else if (query.hasOwnProperty("skip")) {
        return Number(query.skip);
    } else {
        return undefined;
    }
}

/**
 * Calculate and return the "take" options from the specified query
 * parameters, if any were specified.
 *
 * For backwards compatibility, either "limit" or "take" are recognized.
 */
export const take = (query?: any): number | undefined => {
    if (!query) {
        return undefined;
    }
    if (query.hasOwnProperty("limit")) {
        return Number(query.limit);
    } else if (query.hasOwnProperty("take")) {
        return Number(query.take);
    } else {
        return undefined;
    }
}

/**
 * Calculate and return the "where" options from the specified query
 * parameters, if any were specified.
 */
export const where = (query?: any): Prisma.LibraryWhereInput | undefined => {
    if (!query) {
        return undefined;
    }
    const where: Prisma.LibraryWhereInput = {};
    if (query.hasOwnProperty("active")) {
        where.active = true;
    }
    if (query.hasOwnProperty("name")) {
        where.name = {              // TODO - verify that this does an "ilike"
            contains: query.name,
            mode: "insensitive",
        }
    }
    if (query.hasOwnProperty("scope")) {
        where.scope = {
            equals: query.scope,
        }
    }
    if (Object.keys(where).length > 0) {
        return where;
    } else {
        return undefined;
    }
}
