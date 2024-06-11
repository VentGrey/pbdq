import { PbdExtBox } from "$types";
import { setupCronjobBackup } from "./cronjobs.ts";

/**
 * Pbd extensions barrel object. This object is specific to the Pbd
 * extensions collection and it holds all the functions that can be
 * used in the Pbd extensions collection.
 */
export const PbdExt: PbdExtBox = {
    cron: {
        setupBackup: setupCronjobBackup,
    },
};
