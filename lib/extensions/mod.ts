import { PbdExtBox } from "$types";
import { setupCronjobBackup } from "./cronjobs.ts";
import { getJwtHeader } from "./get-jwt-header.ts";
import { setupPBTokenAuth } from "./setup-token-auth.js";

/**
 * Pbd extensions barrel object. This object is specific to the Pbd
 * extensions collection and it holds all the functions that can be
 * used in the Pbd extensions collection.
 */
export const PbdExt: PbdExtBox = {
    auth: {
        getJwtHeader: getJwtHeader,
        setupPBTokenAuth: setupPBTokenAuth,
    },
    cron: {
        setupBackup: setupCronjobBackup,
    },
};
