import Client, { CommonOptions } from "pocketbase";
import Pbd from "../../mod.ts";

/**
 * The options for the Pbd wrapper object. As of now, it only needs an already
 * initialized pocketbase client.
 */
export interface PbdOptions {
    /**
     * The initialized pocketbase client to use for querying.
     *
     * @type {Client}
     */
    client: Client;
}

/**
 * Basic options when interacting with pocketbase. PbdQueryOptions are
 * specific to the Pbd wrapper.
 */
export interface PbdQueryOptions {
    /**
     * The name of the collection to query.
     * @type {string}
     */
    collectionName: string;

    /**
     * Pocketbase client common options to send in almost all requests in
     * the SDK. See {@link Client}
     */
    options?: CommonOptions;

    /**
     * The filter to use when querying.
     * @type {string}
     */
    filter?: string;
}

/**
 * The options for the oauth auth method.
 */
export interface PbdOauthAuthOptions extends PbdQueryOptions {
    /**
     * The OAuth2 provider to use.
     * See {@link https://docs.pocketbase.io/overview/oauth2}
     */
    provider: string;
}

/**
 * The options for the requestVerification method.
 */
export interface PbdRequestVerificationOptions extends PbdQueryOptions {
    /**
     * The email to send the verification request to.
     * @type {string}
     */
    email: string;
}

/**
 * The options for the confirmVerification method.
 * @see {@link Pbd.confirmVerification}
 */
export interface PbdConfirmVerificationOptions extends PbdQueryOptions {
    /**
     * The token to confirm. See {@link Pbd.requestVerification}
     * @type {string}
     */
    token: string;
}

/**
 * The options for the requestPasswordReset method.
 * @see {@link Pbd.requestPasswordReset}
 */
export interface PbdRequestPasswordResetOptions extends PbdQueryOptions {
    /**
     * The user email to send the password reset request to.
     * @type {string}
     */
    email: string;
}

/**
 * The options for the confirmPasswordReset method.
 * @see {@link Pbd.confirmPasswordReset}
 */
export interface PbdConfirmPasswordResetOptions extends PbdQueryOptions {
    token: string;

    /**
     * The new user password to be set.
     * @returns {string}
     */
    password: string;

    /**
     * The password confirmation.
     * @type {string}
     */
    password_confirm: string;
}

/**
 * The options for the requestEmailChange method.
 * @see {@link Pbd.requestEmailChange}
 */
export interface PbdRequestEmailChangeOptions extends PbdQueryOptions {
    /**
     * The user email to send the email change request to.
     * @type {string}
     */
    email: string;
}

/**
 * The options for the confirmEmailChange method.
 */
export interface PbdConfirmEmailChangeOptions extends PbdQueryOptions {
    /**
     * The received token from the email change request.
     * @type {string}
     */
    token: string;

    /**
     * The user password to confirm the email change.
     */
    password: string;
}

/**
 * The options for the unlinkExternalAuth method.
 */
export interface PbdUnlinkExternalAuthOptions extends PbdQueryOptions {
    /**
     * The external auth provider to unlink.
     * See {@link https://docs.pocketbase.io/overview/oauth2}
     *
     * @type {string}
     */
    provider: string;
}

/**
 * The options for the authPassword method.
 */
export interface PbdAuthPasswordOptions extends PbdQueryOptions {
    /**
     * The username or email address to authenticate with.
     * @type {string}
     */
    user_or_email: string;

    /**
     * The user password required to authenticat
     */
    password: string;
}

export interface PbdGetListOptions extends PbdQueryOptions {
    page: number;
    perPage: number;
}

export interface PbdDownloadBackupOptions {
    backup_name: string;
    token: string;
}

export interface PbdGetLogsOptions extends PbdQueryOptions {
    page: number;
    perPage: number;
}

export interface PbdCreateCollectionOptions extends PbdQueryOptions {
    name: string;
    schema: Record<string, unknown>;
    type: "base" | "auth" | "view";
    createRule?: string;
    updateRule?: string;
    deleteRule?: string;
}

export interface PbdAdminAuthWithPasswordOptions {
    email: string;
    password: string;
}

export interface PbdAdminPasswordResetOptions {
    email: string;
}

export interface PbdAdminConfirmPasswordResetOptions {
    token: string;
    password: string;
    password_confirm: string;
}

/**
 * Options for the adminGetList method. The page and perPage options are
 * required.
 *
 * @see {@link Pbd.adminGetList}
 */
export interface PbdAdminGetListOptions extends PbdQueryOptions {
    /**
     * The page mumber to get.
     * @type {number}
     */
    page: number;

    /**
     * How much admins to return per page
     * @type {number}
     */
    perPage: number;

    /**
     * Optional sorting.
     * See {@link https://docs.pocketbase.io/overview/querying}
     */
    sort?: string;
}

/**
 * Options for the adminView method. The id is required.
 * @see {@link Pbd.adminView}
 */
export interface PbdAdminViewOptions extends PbdQueryOptions {
    /**
     * The ID of the admin you want to view.
     * @type {string}
     */
    id: string;
}

/**
 * Options for the adminCreate method.
 */
export interface PbdAdminCreateOptions {
    /**
     * The email of the admin. Must be unique.
     * @type {string}
     */
    email: string;
    password: string;
    passwordConfirm: string;
    avatar: number;
}

/**
 * Options for the adminUpdate method. The id is required.
 */
export interface PbdAdminUpdateOptions {
    /**
     * The ID of the admin you want to update.
     * @type {string}
     */
    id: string;

    /**
     * The email of the admin. Defaults to the current email.
     * @type {string}
     */
    email?: string;

    /**
     * The password of the admin. Defaults to the current password.
     * @type {string}
     */
    password?: string;

    /**
     * The password confirmation of the admin. Defaults to the current
     * password.
     * @type {string}
     */
    passwordConfirm?: string;

    /**
     * The avatar of the admin. Defaults to the current avatar.
     * @type {number}
     */
    avatar?: number;
}

/**
 * Options for the adminDelete method.
 */
export interface PbdAdminDeleteOptions {
    /**
     * The ID of the admin to delete.
     * @type {string}
     */
    id: string;
}

/**
 * Options from the cronjob extension. This type is specific to the Pbd
 * extensions collection.
 *
 * @see {@link Pbd.setupCronjobBackup}
 */
export interface PbdCronExtOptions {
    /**
     * The cron expression to use when running the backup.
     * @see {@link https://crontab.guru/}
     *
     * Deno handles the validation of the cron expression for us.
     * @type {string}
     */
    cron_expression: string;

    /**
     * The name of the backup to use when running the backup.
     * defaults to "auto".
     *
     * When auto is chosen or used as the name, the backup will be created
     * with the name "auto-YYYY-MM-DD-HH-MM-SS". Anything else than
     * "auto" will be used as the name of the backup, you don't need to
     * include the .zip extension as it will be added automatically.
     *
     * @type {string}
     */
    backup_name: "auto" | string;
}

export interface PbdJWTExtOptions {
    collectionName: string;
    username_or_email: string;
    password: string;
    issuer: string;
    subject: string;
    properties: unknown;
}

/**
 * Pbd extensions object. This object is specific to the Pbd
 * extensions collection and it holds all the functions that can be
 * used in the Pbd extensions collection.
 *
 * @see {@link PbdCronExtOptions}
 */
export interface PbdExtBox {
    /**
     * Extend PocketBase with Deno Cronjobs
     * This object holds the cronjob related functions.
     */
    cron: {
        /**
         * This extension allows you to setup a cron job to backup the database.
         *
         * By default the backup name will be `auto-YYYY-MM-DD-HH-MM-SS.zip`. If
         * this format does not suit your needs, you can set the `backup_name` option
         * to your desired name. You dont' need to include the `.zip` extension as
         *
         * @param Pbd {Pbd} - The Pbd instance to use in this extension.
         * @param options {PbdCronExtOptions} - The options for the extension.
         * @returns {void}
         */
        setupBackup: (Pbd: Pbd, options: PbdCronExtOptions) => void;
    };
}
