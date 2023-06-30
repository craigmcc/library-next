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

    it("should pass on all Libraries", async () => {
        const INPUTS = await LibraryActions.all();
        expect(INPUTS.length).to.equal(SeedData.LIBRARIES.length);
    });

});

