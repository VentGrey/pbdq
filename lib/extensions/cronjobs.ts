import Pbd from "../../mod.ts";
import { PbdCronExtOptions } from "$types";

/**
 * This extension allows you to setup a cron job to backup the database.
 *
 * By default the backup name will be `auto-YYYY-MM-DD-HH-MM-SS.zip`. If
 * this format does not suit your needs, you can set the `backup_name` option
 * to your desired name. You dont' need to include the `.zip` extension as
 * it will be added automatically.
 *
 * ```typescript
 * import PocketBase, { Client } from "pocketbase";
 * import { Pbd } from "@ventgrey/pbdq";
 * import { setupCronjobBackup } from "@ventgrey/pbdq";
 *
 * const pb: Client = new PocketBase("http://127.0.0.1:8090");
 * const pbd: Pbd = new Pbd({ client: pb });
 *
 * setupCronjobBackup(pbd, {
 *    cron_expression: "0 0 * * *",
 *    backup_name: "my-backup",
 * });
 * console.log("Cronjob for backups every day at 00:00 has been setup");
 * ```
 *
 * @param Pbd {Pbd} - The Pbd instance to use in this extension.
 * @param options {PbdCronExtOptions} - The options for the extension.
 * @type {(Pbd: Pbd, options: PbdCronExtOptions) => void}
 */
export const setupCronjobBackup: (
    Pbd: Pbd,
    options: PbdCronExtOptions,
) => void = (Pbd: Pbd, options: PbdCronExtOptions) => {
    Deno.cron(
        `Pocketbase Backup (${crypto.randomUUID()})`,
        options.cronExpression,
        async () => {
            if (options.backupName.toLowerCase() === "auto") {
                await Pbd.createBackup(
                    `auto-${new Date().getFullYear()}-${new Date().getMonth}-${
                        new Date().getDate().toString()
                    }-${new Date().getHours().toString()}-${
                        new Date().getMinutes().toString()
                    }-${new Date().getSeconds().toString()}.zip`,
                );
            } else {
                await Pbd.createBackup(`${options.backupName}.zip`);
            }
        },
    );
};
