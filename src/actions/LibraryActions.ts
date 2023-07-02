"use server"

// src/actions/LibraryActions.ts

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
import {PaginationOptions} from "../types/types";
import {NotFound, ServerError} from "../util/HttpErrors";

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

/**
 * The type for options of an "all" function for this model.
 */
export type AllOptions = IncludeOptions & MatchOptions & PaginationOptions;

/**
 * The type for options of a "find" (or related single result) function
 * for this model.
 */
export type FindOptions = IncludeOptions;

// Private Types -------------------------------------------------------------

/**
 * The type for options that select which child or parent models should be
 * included in a response.
 */
type IncludeOptions = {
    // Include child Authors?
    withAuthors?: boolean;
    // Include child Series?
    withSeries?: boolean;
    // Include child Stories?
    withStories?: boolean;
    // Include child Volumes?
    withVolumes?: boolean;
}


/**
 * The type for criteria that select which Library objects should be included
 * in the response.
 */
type MatchOptions = {
    // Whether to limit this response to Libraries with matching active values.
    active?: boolean;
    // The name (wildcard match) of the Libraries that should be returned.
    name?: string;
    // The scope (unique per Library) for authorizations for this Library.
    scope?: string;
}

// Public Actions ------------------------------------------------------------

/**
 * Return all Library instances that match the specified criteria.
 *
 * @param options                       Optional match/include/pagination options
 *
 * @throws ServerError                  If a low level error is thrown
 */
export const all = async (options?: AllOptions): Promise<LibraryPlus[]> => {
    const args: Prisma.LibraryFindManyArgs = {
        // cursor???
        // distinct???
        include: include(options),
        orderBy: orderBy(options),
        select: select(options),
        skip: skip(options),
        take: take(options),
        where: where(options),
    }
    try {
        const results =
            await prisma.library.findMany(args);
        return results as LibraryPlus[];
    } catch (error) {
        throw new ServerError(
            error as Error,
            "LibraryActions.all",
        )
    }
}

/**
 * Return the Library instance with the specified name, or throw NotFound.
 *
 * @param name                          Name of the requested Library
 * @param options                       Optional include query parameters
 *
 * @throws NotFound                     If no such Library is found
 * @throws ServerError                  If a low level error is thrown
 */
export const exact = async (name: string, options?: FindOptions): Promise<LibraryPlus> => {
    try {
        const result = await prisma.library.findUnique({
            include: include(options),
            where: {
                name: name,
            }
        });
        if (result) {
            return result as LibraryPlus;
        } else {
            throw new NotFound(
                `name: Missing Library '${name}'`,
                "LibraryActions.exact",
            )
        }
    } catch (error) {
        if (error instanceof NotFound) {
            throw error;
        } else {
            throw new ServerError(
                error as Error,
                "LibraryActions.exact",
            )
        }
    }
}

/**
 * Return the Library instance with the specified libraryId, or throw NotFound.
 *
 * @param libraryId                     ID of the requested Library
 * @param options                       Optional include query parameters
 *
 * @throws NotFound                     If no such Library is found
 * @throws ServerError                  If a low level error is thrown
 */
export const find = async (libraryId: number, options?: FindOptions): Promise<LibraryPlus> => {
    try {
        const result =
            await prisma.library.findUnique({
                include: include(options),
                where: {
                    id: libraryId,
                }
            });
        if (result) {
            return result as LibraryPlus;
        } else {
            throw new NotFound(
                `id: Missing Library ${libraryId}`,
                "LibraryActions.find"
            )
        }
    } catch (error) {
        if (error instanceof NotFound) {
            throw error;
        } else {
            throw new ServerError(
                error as Error,
                "LibraryActions.find",
            )
        }
    }
}

// Support Functions ---------------------------------------------------------

/**
 * Calculate and return the "include" options from the specified query
 * options, if any were specified.
 */
export const include = (options?: IncludeOptions): Prisma.LibraryInclude | undefined => {
    if (!options) {
        return undefined;
    }
    const include: Prisma.LibraryInclude = {};
    if (options.withAuthors) {
        include.authors = true;
    }
    if (options.withSeries) {
        include.series = true;
    }
    if (options.withStories) {
        include.stories = true;
    }
    if (options.withVolumes) {
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
 * Calculate and return the "skip" options (pre-Prisma called "offset")
 * from the specified query options, if any were specified.
 */
export const skip = (options?: PaginationOptions): number | undefined => {
    if (options?.offset) {
        return Number(options.offset);
    } else {
        return undefined;
    }
}

/**
 * Calculate and return the "take" options (pre-prisma called "limit")
 * from the specified query options, if any were specified.
 */
export const take = (options?: PaginationOptions): number | undefined => {
    if (options?.limit) {
        return Number(options.limit);
    } else {
        return undefined;
    }
}

/**
 * Calculate and return the "where" options from the specified query
 * parameters, if any were specified.
 *
 * @param options                       MatchOptions relevant for this model
 */
export const where = (options?: MatchOptions): Prisma.LibraryWhereInput | undefined => {
    if (!options) {
        return undefined;
    }
    const where: Prisma.LibraryWhereInput = {};
    if (typeof options.active !== undefined) {
        where.active = options.active;
    }
    if (options.name) {
        where.name = {
            contains: options.name,
            mode: "insensitive",
        }
    }
    if (options.scope) {
        where.scope = {
            equals: options.scope,
        }
    }
    if (Object.keys(where).length > 0) {
        return where;
    } else {
        return undefined;
    }
}
