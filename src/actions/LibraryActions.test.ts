// actions/LibraryActions.test.ts

/**
 * Functional tests for LibraryActions.
 *
 * @packageDocumentation
 */

// External Modules ----------------------------------------------------------

import chai from "chai";
const expect = chai.expect;
import {
    Library,
    Prisma,
} from "@prisma/client";

// Internal Modules ----------------------------------------------------------

import * as LibraryActions from "./LibraryActions";
import ActionsUtils from "../test/ActionsUtils";
import * as SeedData from "../test/SeedData";
import {BadRequest, NotFound, NotUnique} from "../util/HttpErrors";

const UTILS = new ActionsUtils();

// Test Specifications -------------------------------------------------------

describe("LibraryActions Functional Tests", () => {

    // Test Hooks ------------------------------------------------------------

    beforeEach(async () => {
        await UTILS.loadData({
            withAuthors: true,
            withLibraries: true,
            withSeries: true,
            withStories: true,
            withVolumes: true,
        });
    });

    // Test Methods ----------------------------------------------------------

    describe("LibraryActions.all()", () => {

        it("should pass on active Libraries", async () => {
            const INPUTS =
                await LibraryActions.all({ active: true });
            for (const INPUT of INPUTS) {
                expect(INPUT.active).to.be.true;
            }
        });

        it("should pass on all Libraries", async () => {
            const INPUTS = await LibraryActions.all();
            expect(INPUTS.length).to.equal(SeedData.LIBRARIES.length);
        });

        it("should pass on inactive Libraries", async () => {
            const INPUTS =
                await LibraryActions.all({ active: false });
            for (const INPUT of INPUTS) {
                expect(INPUT.active).to.be.false;
            }
        });

        it("should pass on included children", async () => {
            const INPUTS =
                await LibraryActions.all({
                    withAuthors: true,
                    withSeries: true,
                    withStories: true,
                    withVolumes: true,
                });
            for (const INPUT of INPUTS) {
                if (INPUT.name !== SeedData.LIBRARY_NAME_THIRD) {
                    expect(INPUT.authors.length).to.be.greaterThan(0);
                    expect(INPUT.series.length).to.be.greaterThan(0);
                    expect(INPUT.stories.length).to.be.greaterThan(0);
                    expect(INPUT.volumes.length).to.be.greaterThan(0);
                }
            }
        });

        it("should pass on named libraries", async () => {
            const PATTERN = "iBr";
            const OUTPUTS =
                await LibraryActions.all({ name: PATTERN});
            expect(OUTPUTS.length).to.be.greaterThan(0);
            for (const OUTPUT of OUTPUTS) {
                expect(OUTPUT.name.toLowerCase()).to.include(PATTERN.toLowerCase());
            }
        });

        it("should pass on paginated libraries", async () => {
            const LIMIT = 99;
            const OFFSET = 1;
            const INPUTS = await LibraryActions.all();
            const OUTPUTS = await LibraryActions.all({
                limit: LIMIT,
                offset: OFFSET,
            });
            expect(OUTPUTS.length).to.equal(SeedData.LIBRARIES.length - 1);
            OUTPUTS.forEach((OUTPUT, index) => {
                compareLibraryOld(OUTPUT, INPUTS[index + OFFSET]);
            });
        });

    });

    // TODO: LibraryActions.authors()

    describe("LibraryActions.exact()", () => {

        it("should fail on invalid name", async () => {
            const INVALID_NAME = "INVALID LIBRARY NAME";
            try {
                await LibraryActions.exact(INVALID_NAME);
                expect.fail("Should have thrown NotFound");
            } catch (error) {
                if (error instanceof NotFound) {
                    expect(error.message).includes(`Missing Library '${INVALID_NAME}'`);
                } else {
                    expect.fail(`Should not have thrown '${error}'`);
                }
            }
        });

        it("should pass on valid names", async () => {
            for (const INPUT of SeedData.LIBRARIES) {
                try {
                    const OUTPUT =
                        await LibraryActions.exact(INPUT.name);
                    expect(OUTPUT.name).to.equal(INPUT.name);
                } catch (error) {
                    expect.fail(`Should not have thrown '${error}'`);
                }
            }
        });

    });

    describe("LibraryActions.find()", () => {

        it("should fail on invalid id", async () => {
            const INVALID_ID = 9999;
            try {
                await LibraryActions.find(INVALID_ID);
                expect.fail("Should have thrown NotFound");
            } catch (error) {
                if (error instanceof NotFound) {
                    expect(error.message).includes(`Missing Library ${INVALID_ID}`);
                } else {
                    expect.fail(`Should not have thrown '${error}'`);
                }
            }
        });

        it("should pass on included relations", async () => {
            const INPUTS = await LibraryActions.all();
            for (const INPUT of INPUTS) {
                try {
                    const OUTPUT =
                        await LibraryActions.find(INPUT.id, {
                            withAuthors: true,
                            withSeries: true,
                            withStories: true,
                            withVolumes: true,
                        });
                    if (OUTPUT.name !== SeedData.LIBRARY_NAME_THIRD) {
                        expect(OUTPUT.authors.length).to.be.greaterThan(0);
                        expect(OUTPUT.series.length).to.be.greaterThan(0);
                        expect(OUTPUT.stories.length).to.be.greaterThan(0);
                        expect(OUTPUT.volumes.length).to.be.greaterThan(0);
                    }
                } catch (error) {
                    expect.fail(`Should not have thrown '${error}`);
                }
            }
        });

        it("should pass on valid ids", async () => {
            const INPUTS = await LibraryActions.all();
            for (const INPUT of INPUTS) {
                try {
                    const OUTPUT =
                        await LibraryActions.find(INPUT.id);
                    compareLibraryOld(OUTPUT, INPUT);
                } catch (error) {
                    expect.fail(`Should not have thrown '${error}'`);
                }
            }
        });

    });

});

// Private Objects -------------------------------------------------------

export function compareLibraryNew(OUTPUT: Library, INPUT: Library) {
    expect(OUTPUT.id).to.exist;
    expect(OUTPUT.active).to.equal(INPUT.active !== undefined ? INPUT.active : true);
    expect(OUTPUT.name).to.equal(INPUT.name);
    expect(OUTPUT.notes).to.equal(INPUT.notes ? INPUT.notes : null);
    expect(OUTPUT.scope).to.equal(INPUT.scope);
}

export function compareLibraryOld(OUTPUT: Library, INPUT: Library) {
    expect(OUTPUT.id).to.equal(INPUT.id ? INPUT.id : OUTPUT.id);
    expect(OUTPUT.active).to.equal(INPUT.active !== undefined ? INPUT.active : OUTPUT.active);
    expect(OUTPUT.name).to.equal(INPUT.name ? INPUT.name : OUTPUT.name);
    expect(OUTPUT.notes).to.equal(INPUT.notes ? INPUT.notes : null);
    expect(OUTPUT.scope).to.equal(INPUT.scope ? INPUT.scope : OUTPUT.scope);
}

