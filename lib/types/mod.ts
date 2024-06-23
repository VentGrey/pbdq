import Client, { CollectionModel, CommonOptions } from "pocketbase";
import Pbd from "$pbdq";

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

    /**
     * If set to true, Pbd class methods that require authentication will
     * throw an error if the client `authStore` is not valid.
     *
     * @type {boolean}
     */
    unauthorized_errors?: boolean;

    /**
     * If set to true, Pbd class methods that get any {@linkcode ClientResponseError} will
     * return an empty array or an empty object instead of throwing an error.
     *
     * **Note:** This only applies to the methods that are async since it is possible
     * to further handle errors with `.catch()`.
     *
     * PBD errors are not covered by this option. You'll still need to handle
     * those yourself.
     *
     * @type {boolean}
     */
    return_empty_on_error?: boolean;
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
     * the SDK. See {@linkcode Client}
     * @type {import("pocketbase").CommonOptions}
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
    passwordConfirm: string;
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
    userOrEmail: string;

    /**
     * The user password required to authenticat
     */
    password: string;
}

/**
 * The options for the getList method.
 */
export interface PbdGetListOptions extends PbdQueryOptions {
    /**
     * The page number.
     * @type {number}
     */
    page: number;

    /**
     * The number of results per page.
     * @type {number}
     */
    perPage: number;
}

/**
 * The options for the downloadBackup method.
 */
export interface PbdDownloadBackupOptions {
    /**
     * The name of the backup to download. If you saved in either
     * zip or other formats, you'll have to provide the extension
     * as well.
     */
    backupName: string;

    /**
     * A generated token to access the backup.
     * {@linkcode Pbd.downloadBackup}
     */
    token: string;
}

/**
 * The options for the {@linkcode Pbd.getLogs} wrapped method.
 */
export interface PbdGetLogsOptions extends PbdQueryOptions {
    /**
     * The page number.
     * @type {number}
     */
    page: number;

    /**
     * The number of results per page.
     * @type {number}
     */
    perPage: number;
}

/**
 * The options for the testS3 wrapped method.
 * @see {@linkcode Pbd.testS3}
 */
export interface PbdTestS3Options {
    /**
     * The type of backups to test.
     *
     * @type {"storage" | "backups"}
     */
    backups: "storage" | "backups";
}

/**
 * The options for the {@linkcode Pbd.testEmail} wrapped method.
 */
export interface PbdTestEmailOptions {
    /**
     * The email address to test. If the email is not valid, the
     * PocketBase server will throw an error.
     *
     * @type {string}
     */
    email: string;

    /**
     * The email html template to use in the sent email.
     *
     * @type {string}
     */
    template: string;
}

/**
 * The options for the {@linkcode Pbd.generateAppleClientSecret} wrapped method.
 */
export interface PbdGenerateAppleClientSecretOptions {
    /**
     * The Apple client id to generate the secret for.
     *
     * @type {string}
     */
    client_id: string;

    /**
     * The Apple team id to generate the secret for.
     *
     * @type {string}
     */
    team_id: string;

    /**
     * The Apple key id required to generate the secret.
     *
     * @type {string}
     */
    key_id: string;

    /**
     *  Your generated Apple private key
     *
     * @type {string}
     */
    private_key: string;

    /**
     * The duration of the apple client secret in seconds
     *
     * @type {number}
     */
    duration: number;
}

/**
 * The options for the {@linkcode Pbd.importCollections} wrapped method.
 */
export interface PbdImportCollectionsOptions {
    /**
     * The collections to import into pocketbase
     * This is an array of PocketBase {@linkcode CollectionModel}
     *
     * See the official SDK documentation for more information on how
     * to build your collection objects to fit into the PocketBase model.
     *
     * @type {Array<CollectionModel>}
     */
    collections: Array<CollectionModel>;

    /**
     * Whether to delete missing collections.
     *
     * @type {boolean}
     */
    deleteMissing: boolean;
}

/**
 * The options for the {@linkcode Pbd.getOneCollection} wrapped method.
 */
export interface PbdGetOneCollectionOptions {
    /**
     * The name or id of the collection to get
     *
     * @type {string}
     */
    nameOrId: string;
}

/**
 * The options for the {@linkcode Pbd.deleteCollection} wrapped method.
 */
export interface PbdDeleteCollectionOptions {
    /**
     * The name or id of the collection to delete
     *
     * @type {string}
     */
    nameOrId: string;
}

/**
 * The options for the createCollection method.
 * @see {@linkcode Pbd.createCollection}
 */
export interface PbdCreateCollectionOptions extends PbdQueryOptions {
    /**
     * The name of the collection you want to create.
     * @type {string}
     */
    name: string;

    /**
     * The schema of the collection.
     *
     * @type {Record<string, unknown>}
     */
    schema: Record<string, unknown>;

    /**
     * The collection type, see Pocketbase {@linkcode CommonOptions} to find
     * out what options are available for each type.
     *
     * @see {@link https://pocketbase.io/docs/collections} for more information
     * about collection types.
     */
    type: "base" | "auth" | "view";

    /**
     * A pocketbase filter (using pocketbase syntax) that can be used
     * to condition the listing of the collection.
     *
     * For more indormation see:
     * {@link https://docs.pocketbase.io/docs/api-rules-and-filters}
     *
     * @type {string}
     */
    listRule?: string;

    /**
     * A pocketbase filter (using pocketbase syntax) that can be used
     * to condition the viewing of the collection.
     *
     * For more indormation see:
     * {@link https://docs.pocketbase.io/docs/api-rules-and-filters}
     *
     * @type {string}
     */
    viewRule?: string;

    /**
     * A pocketbase filter (using pocketbase syntax) that can be used
     * to condition the creation of the collection.
     *
     * For more indormation see:
     * {@link https://docs.pocketbase.io/docs/api-rules-and-filters}
     *
     * @type {string}
     */
    createRule?: string;

    /**
     * A pocketbase filter (using pocketbase syntax) that can be used
     * to condition the update of the collection.
     *
     * For more indormation see:
     * {@link https://docs.pocketbase.io/docs/api-rules-and-filters}
     *
     * @type {string}
     */
    updateRule?: string;

    /**
     * A pocketbase filter (using pocketbase syntax) that can be used
     * to condition the deletion of the collection.
     *
     * For more indormation see:
     * {@link https://docs.pocketbase.io/docs/api-rules-and-filters}
     *
     * @type {string}
     */
    deleteRule?: string;
}

/**
 * The options for the {@linkcode Pbd.adminAuthWithPassword} method.
 */
export interface PbdAdminAuthWithPasswordOptions {
    /**
     * The user email to authenticate with.
     * @type {string}
     */
    email: string;

    /**
     * The user password required to authenticate.
     * @type {string}
     */
    password: string;
}

/**
 * The options for the adminPasswordReset method.
 */
export interface PbdAdminPasswordResetOptions {
    /**
     * The user email to send the password reset request to.
     * @type {string}
     */
    email: string;
}

/**
 * The options for the {@linkcode Pbd.adminConfirmPasswordReset} wrapped method.
 */
export interface PbdAdminConfirmPasswordResetOptions {
    /**
     * The received token from the password reset request.
     * @type {string}
     */
    token: string;

    /**
     * The new user password to be set.
     * @returns {string}
     */
    password: string;

    /**
     * The password confirmation (Same as password).
     * @type {string}
     */
    passwordConfirm: string;
}

/**
 * Options for the {@linkcode Pbd.adminGetFullList} wrapped method.
 * The sort option is optional.
 */
export interface PbdAdminGetFullListOptions {
    /**
     * Optional sorting for the full list.
     */
    sort?: string;

    /**
     * Pocketbase client common options to send in almost all requests in
     * the SDK. See {@linkcode Client}
     * @type {import("pocketbase").CommonOptions}
     */
    options?: CommonOptions;
}

/**
 * Options for the {@linkcode Pbd.listBackup} wrapped method.
 * The fields option is optional.
 */
export interface PbdListBackupOptions {
    /**
     * Optional fields to return in the backup json response.
     *
     * @type {string}
     */
    fields?: string;

    /**
     * Pocketbase client common options to send in almost all requests in
     * the SDK. See {@linkcode Client}
     * @type {import("pocketbase").CommonOptions}
     */
    options?: CommonOptions;
}

/**
 * Options for the {@linkcode Pbd.adminGetList} wrapped method.
 *
 * The page and perPage options are
 * required.
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

    /**
     * The password of the admin to be created.
     * @type {string}
     */
    password: string;

    /**
     * The password confirmation (Same as password).
     * @type {string}
     */
    passwordConfirm: string;

    /**
     * The avatar of the admin. Defaults to 0.
     */
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
    cronExpression: string;

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
    backupName: "auto" | string;
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
     * Extend Pocketbase Auth with these alternatives.
     * This object holds the auth related functions.
     */
    auth: {
        /**
         * Get the JWT auth header from the Pbd instance. This extracts
         * the user token from the PocketBase client present in the Pbd
         * instance. When you authenticate either as a user or as an
         * admin, the SDK saves a JWT token in the AuthStore.
         *
         * This token uses HMAC + SHA-256 encoded in base64. You can use
         * this token to make authenticated requests to the API.
         *
         * @param Pbd {Pbd} - The Pbd instance to use in this extension.
         * @returns {string} - The JWT auth header
         */
        getJwtHeader: (Pbd: Pbd) => string;

        /**
         * Setup the auth token in the headers of the request.
         *
         * @param pbd {Pbd} - The Pbd instance to use in this extension.
         * @returns {void} - No result seems to be returned because mutation happens in pocketbase's side (?)
         */
        setupPBTokenAuth: (pbd: Pbd) => void;
    };
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
