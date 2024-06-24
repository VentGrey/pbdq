import Client, {
    AdminAuthResponse,
    AdminModel,
    AuthMethodsList,
    ClientResponseError,
    CollectionModel,
    ExternalAuthModel,
    HealthCheckResponse,
    HourlyStats,
    ListResult,
    LogModel,
    RecordAuthResponse,
    RecordModel,
} from "pocketbase";
import BackupFileInfo from "pocketbase";
import appleClientSecret from "pocketbase";

import {
    PbdAdminAuthWithPasswordOptions,
    PbdAdminConfirmPasswordResetOptions,
    PbdAdminCreateOptions,
    PbdAdminDeleteOptions,
    PbdAdminGetFullListOptions,
    PbdAdminGetListOptions,
    PbdAdminPasswordResetOptions,
    PbdAdminUpdateOptions,
    PbdAdminViewOptions,
    PbdAuthPasswordOptions,
    PbdConfirmEmailChangeOptions,
    PbdConfirmPasswordResetOptions,
    PbdConfirmVerificationOptions,
    PbdCreateCollectionOptions,
    PbdDeleteCollectionOptions,
    PbdDownloadBackupOptions,
    PbdGenerateAppleClientSecretOptions,
    PbdGetListOptions,
    PbdGetLogsOptions,
    PbdGetOneCollectionOptions,
    PbdImportCollectionsOptions,
    PbdListBackupOptions,
    PbdOauthAuthOptions,
    PbdOptions,
    PbdQueryOptions,
    PbdRequestEmailChangeOptions,
    PbdRequestPasswordResetOptions,
    PbdRequestVerificationOptions,
    PbdTestEmailOptions,
    PbdTestS3Options,
    PbdUnlinkExternalAuthOptions,
} from "$types";

import { PbdExt } from "$extensions";

/**
 * Pbd - Core
 * > The core wrapper for PBDQ
 *
 * Pbd is a wrapper for the PocketBase JS SDK. This wrapper helps you simplify
 * the integration of PocketBase with server side TypeScript/JavaScript. Mainly
 * in Deno.
 *
 * This wrapper makes some operations like getting, setting, and deleting
 * pocketbase records more convenient. This wrapper does not aim to be
 * highly performant, but rather to make the PocketBase SDK compatible
 * with server side TypeScript/JavaScript.
 *
 * This uses some generic functions and tries to fill the missing bits and
 * pieces from the JS SDK for TypeScript.
 *
 * > [!IMPORTANT]
 * > While I myself use this wrapper in production, I don't really test much of
 * > the features I don't use. If you find any bugs, please open an issue.
 *
 * @example - CRUD operations on "Cats" from the PocketBase Collection "cats"
 * ```typescript
 * // Instantiate a new PocketBase client
 * const pb: Client = new PocketBase("http://127.0.0.1:8090");
 *
 * // Instantiate the Pbd wrapper
 * const pbd: Pbd = new Pbd({ client: pb });
 *
 * // Get a list of "cats"
 * const cats: ListResult<Cat> = await pbd
 *     .getList({ collectionName: "cats" });
 *
 * // Create a new "cat"
 * const newCat: Cat = await pbd.create({ collectionName: "cats" }, {
 *     name: "Erina",
 *     age: 2,
 *     color: "brown",
 *     breed: "Domestic Short Hair",
 * });
 *
 * // Get the new "cat"
 * const cat: Cat = await pbd.get({ collectionName: "cats", id: newCat.id });
 *
 * // Update the new "cat"
 * const updatedCat: Cat = await pbd.update({ collectionName: "cats", id: newCat.id }, {
 *     name: "Erina Pendleton",
 *     age: 2,
 *     color: "brown",
 *     breed: "Domestic Short Hair",
 * });
 *
 * // Delete the new "cat"
 * await pbd.delete({ collectionName: "cats", id: newCat.id });
 * ```
 *
 * @example - Setup a Deno Cron Job to check the health of the PocketBase every
 * minute
 * ```typescript
 * Deno.cron("Check PocketBase Health", "* * * * *", async () => {
 *   // Assuming you already have a Pbd instance
 *   const result = await pbd.getHealth();
 *
 *   // Do something with the result
 *   result.message ? console.log(result.message) : console.log("Api is not healthy");
 * })
 * ```
 *
 * @example - Control backups from a Deno Cron Job. The backup will be created
 * at 00:00 every day
 * ```typescript
 * Deno.cron("Backup", "0 0 * * *", async () => {
 *    // Assuming you already have a Pbd instance
 *    const result = await pbd.createBackup(`${new Date().toISOString()}.zip`);
 *
 *    // Do something with the result
 *    result ? console.log("Backup succeeded") : console.log("Backup failed");
 * });
 * ```
 *
 * @module
 */
export class Pbd {
    /**
     * The pocketbase {@link Client} that is wrapped by the Pbd wrapper.
     * This is the client we are passing into the Pbd wrapper. The wrapper
     * will change the client state to be authenticated, get or set records,
     * interact with backups, etc.
     *
     * This client class contains all the methods and properties that you
     * can mutate with the js-sdk. Pbd uses that SDK and tries to wrap queries
     * or common operations.
     *
     * @type {import("pocketbase").Client}
     */
    client: Client;

    /**
     * This feature, when set to true, will throw an error if you try to
     * run any Pbd method that requires either user  or admin credentials.
     *
     * This error will be thrown if the {@linkcode client} authStore is not
     * marked as valid.
     *
     * **Default:** `false`
     *
     * @type {boolean}
     */
    unauthorized_errors: boolean;

    /**
     * This feature, when set to true, will return a null value
     * if the requested resource is not found or if there is an
     * error in the request to PocketBase.
     *
     * This may benefit you if you are using this kind of pattern:
     *
     * ```typescript
     * const result = await pbd.get({ collectionName: "cats", id: "123" });
     *
     * if (!result) {
     *     console.log("Resource not found");
     *     return;
     * }
     * ```
     *
     * This does not apply to functions that return `Promise<boolean>` like
     * update, insert, or other PocketBase operation that return booleans.
     * This it because it makes no sense to compare a resourse such as
     * `boolean | null` when the boolean should be always true, as a
     * false value is returned on error. To handle this, all boolean functions
     * will return `false` if there is an error.
     *
     * **Default:** `false`
     *
     * @type {boolean}
     */
    return_null_on_error: boolean;

    /**
     * The constructor method for the Pbd wrapper. This takes in the options
     * passed in when initializing a new wrapper instance.
     *
     * @param options - The Pbd options when initializing the pocketbase
     * wrapper. See {@link PbdOptions} for more information.
     */
    constructor(options: PbdOptions) {
        this.client = options.client;

        if (!options.unauthorized_errors) {
            options.unauthorized_errors = false;
        }

        if (!options.return_empty_on_error) {
            options.return_empty_on_error = false;
        }

        this.unauthorized_errors = options.unauthorized_errors;
        this.return_null_on_error = options.return_empty_on_error;
    }

    /**
     * Mutates the client state to be authenticated against the pocketbase
     * server. If the Authentication is successful it redirects the pocketbase result to the client
     *
     * @param options {PbdAuthPasswordOptions} - The options for the
     * authWithPassword pocketbase sdk method.
     * @throws {ClientResponseError} - If the request to pocketbase fails.
     * @returns {Promise<RecordAuthResponse<RecordModel> | null>} - The result of the authWithPassword
     * if return_null_on_error is set to true, it will return null if the request fails.
     */
    async authWithPassword(
        options: PbdAuthPasswordOptions,
    ): Promise<RecordAuthResponse<RecordModel> | null> {
        return await this.client.collection(options.collectionName)
            .authWithPassword(options.userOrEmail, options.password)
            .then(
                (res: RecordAuthResponse<RecordModel>) => {
                    return res;
                },
            ).catch(
                (err: ClientResponseError) => {
                    if (this.return_null_on_error) {
                        return null;
                    }
                    throw err;
                },
            );
    }

    /**
     * Authenticates the provided client with an OAuth2 provider.
     *
     * @param options {PbdOauthAuthOptions} - The options for the authWithOAuth2 method
     * @throws {ClientResponseError} - If the request to pocketbase fails
     * @returns {Promise<RecordAuthResponse<RecordModel> | null>} - The result of the authWithOAuth2
     * if return_null_on_error is set to true, it will return null if the request fails.
     */
    async authWithOAuth2(
        options: PbdOauthAuthOptions,
    ): Promise<RecordAuthResponse<RecordModel> | null> {
        return await this.client.collection(options.collectionName)
            .authWithOAuth2({
                provider: options.provider,
            }).then(
                (res: RecordAuthResponse<RecordModel>) => {
                    return res;
                },
            ).catch(
                (err: ClientResponseError) => {
                    if (this.return_null_on_error) {
                        return null;
                    }
                    throw err;
                },
            );
    }

    /**
     * Clears the client auth state.
     *
     * @returns {void}
     */
    authClear(): void {
        this.client.authStore.clear();
    }

    /**
     * Refreshes the provided client's auth token. I think this queries a
     * certain encpoint in PocketBase. and depending on your authStore state
     * it may return a new token if the current one is expired. Or it may
     * do nothing because the current token is still valid.
     *
     * @throws {ClientResponseError} - If the request to pocketbase fails
     * @param options {PbdAuthPasswordOptions} - The options for the authRefresh method
     * @returns {Promise<RecordAuthResponse<RecordModel> | null>} - The result of the authRefresh
     * if return_null_on_error is set to true, it will return null if the request fails.
     */
    async authRefresh(
        options: PbdAuthPasswordOptions,
    ): Promise<RecordAuthResponse<RecordModel> | null> {
        return await this.client.collection(options.collectionName)
            .authRefresh().then(
                (res: RecordAuthResponse<RecordModel>) => {
                    return res;
                },
            ).catch(
                (err: ClientResponseError) => {
                    if (this.return_null_on_error) {
                        return null;
                    }
                    throw err;
                },
            );
    }

    /**
     * Sends a verification request to the provided email using the
     * configured email template/settings in PocketBase.
     *
     * @param options {PbdRequestVerificationOptions} - The options for the requestVerification method
     * @throws {ClientResponseError} - If the request to pocketbase fails
     * @returns {Promise<boolean>} - True if the email was sent
     */
    async requestVerification(
        options: PbdRequestVerificationOptions,
    ): Promise<boolean> {
        return await this.client.collection(options.collectionName)
            .requestVerification(options.email).then(
                (res: boolean) => {
                    return res;
                },
            ).catch(
                (err: ClientResponseError) => {
                    if (this.return_null_on_error) {
                        return false;
                    }
                    throw err;
                },
            );
    }

    /**
     * Confirms a verification request using the provided token.
     *
     * @throws {ClientResponseError} - If the request to pocketbase fails
     * @param options {PbdConfirmVerificationOptions} - The options for the confirmVerification method
     * @returns {Promise<boolean>} - True if the email was sent
     */
    async confirmVerification(
        options: PbdConfirmVerificationOptions,
    ): Promise<boolean> {
        return await this.client.collection(options.collectionName)
            .confirmVerification(options.token)
            .then(
                (res: boolean) => {
                    return res;
                },
            ).catch(
                (err: ClientResponseError) => {
                    if (this.return_null_on_error) {
                        return false;
                    }
                    throw err;
                },
            );
    }

    /**
     * Sends a password reset request to the provided email using the
     * configured email template/settings in PocketBase.
     *
     * @param options {PbdRequestPasswordResetOptions} - The options for the requestPasswordReset method
     * @throws {ClientResponseError} - If the request to pocketbase fails
     * @returns {Promise<boolean>} - True if the email was sent
     */
    async requestPasswordReset(
        options: PbdRequestPasswordResetOptions,
    ): Promise<boolean> {
        return await this.client.collection(options.collectionName)
            .requestPasswordReset(options.email)
            .then(
                (res: boolean) => {
                    return res;
                },
            ).catch(
                (err: ClientResponseError) => {
                    if (this.return_null_on_error) {
                        return false;
                    }
                    throw err;
                },
            );
    }

    /**
     * Confirms a password reset using the provided token. If the token
     * is invalid, an error will be thrown.
     *
     * @param options {PbdConfirmPasswordResetOptions} - The options for the confirmPasswordReset method
     * @throws {ClientResponseError} - If the request to pocketbase fails
     * @returns {Promise<boolean>} - True if the email was sent
     */
    async confirmPasswordReset(
        options: PbdConfirmPasswordResetOptions,
    ): Promise<boolean> {
        return await this.client.collection(options.collectionName)
            .confirmPasswordReset(
                options.token,
                options.password,
                options.passwordConfirm,
            ).then(
                (res: boolean) => {
                    return res;
                },
            ).catch(
                (err: ClientResponseError) => {
                    if (this.return_null_on_error) {
                        return false;
                    }
                    throw err;
                },
            );
    }

    /**
     * Sends an email change request to the provided email using the
     * configured email template/settings in PocketBase.
     *
     * @param options {PbdRequestEmailChangeOptions} - The options for the requestEmailChange method
     * @throws {ClientResponseError} - If the request to pocketbase fails
     * @returns {Promise<boolean>} - True if the email was sent
     */
    async requestEmailChange(
        options: PbdRequestEmailChangeOptions,
    ): Promise<boolean> {
        if (this.unauthorized_errors && !this.client.authStore.isValid) {
            throw new Error(
                `Attempted to make a protected operation. The current client user auth state is ${this.client.authStore.isValid}.`,
            );
        }

        return await this.client.collection(options.collectionName)
            .requestEmailChange(options.email)
            .then(
                (res: boolean) => {
                    return res;
                },
            )
            .catch(
                (err: ClientResponseError) => {
                    if (this.return_null_on_error) {
                        return false;
                    }
                    throw err;
                },
            );
    }

    /**
     * Confirms an email change using the provided token. If the token
     * is invalid, an error will be thrown.
     *
     * @param options {PbdConfirmEmailChangeOptions} - The options for the confirmEmailChange method
     * @throws {ClientResponseError} - If the request to pocketbase fails
     * @returns {Promise<boolean>} - True if the email was sent
     */
    async confirmEmailChange(
        options: PbdConfirmEmailChangeOptions,
    ): Promise<boolean> {
        return await this.client.collection(options.collectionName)
            .confirmEmailChange(
                options.token,
                options.password,
            ).then(
                (res: boolean) => {
                    return res;
                },
            ).catch(
                (err: ClientResponseError) => {
                    if (this.return_null_on_error) {
                        return false;
                    }
                    throw err;
                },
            );
    }

    /**
     * Lists all available auth methods for the provided collection.
     *
     * @param options {PbdQueryOptions} - The options for the listAuthMethods method
     * @throws {ClientResponseError} - If the request to pocketbase fails
     * @returns {Promise<AuthMethodsList | null>} - The list of auth methods, or null if return_null_on_error is
     * set to true
     */
    async listAuthMethods(
        options: PbdQueryOptions,
    ): Promise<AuthMethodsList | null> {
        return await this.client.collection(options.collectionName)
            .listAuthMethods({
                ...options.options,
            }).then(
                (res: AuthMethodsList) => {
                    return res;
                },
            ).catch(
                (err: ClientResponseError) => {
                    if (this.return_null_on_error) {
                        return null;
                    }
                    throw err;
                },
            );
    }

    /**
     * Lists all available external auth methods for the provided collection.
     *
     * @throws {ClientResponseError} - If the request to pocketbase fails
     * @param options {PbdQueryOptions} - The options for the listExternalAuths method
     * @returns {Promise<ExternalAuthModel[] | null>} - The list of external auth, or null if return_null_on_error
     * is set to true
     */
    async listExternalAuth(
        options: PbdQueryOptions,
    ): Promise<ExternalAuthModel[] | null> {
        if (this.unauthorized_errors && !this.client.authStore.isValid) {
            throw new Error(
                `Attempted to make a protected operation. The current client user auth state is ${this.client.authStore.isValid}.`,
            );
        }

        return await this.client.collection(options.collectionName)
            .listExternalAuths(
                this.client.authStore.model?.id,
            ).then(
                (res: ExternalAuthModel[]) => {
                    return res;
                },
            ).catch(
                (err: ClientResponseError) => {
                    if (this.return_null_on_error) {
                        return null;
                    }
                    throw err;
                },
            );
    }

    /**
     * Unlinks a single external OAuth2 provider from any `authModel` collection.
     * Which means, any auth collection in the PocketBase. I do not recommend
     * reusing this method if you have a second or third auth collections.
     *
     * As much as it sounds horrible memory waste, it's better for your
     * reproducibility.
     *
     * @param options {PbdUnlinkExternalAuthOptions} - The options for the unlinkExternalAuth
     * @returns {Promise<boolean>} - True if the unlink was successful
     */
    async unlinkExternalAuth(
        options: PbdUnlinkExternalAuthOptions,
    ): Promise<boolean> {
        if (this.unauthorized_errors && !this.client.authStore.isValid) {
            throw new Error(
                `Attempted to make a protected operation. The current client user auth state is ${this.client.authStore.isValid}.`,
            );
        }

        return await this.client.collection(options.collectionName)
            .unlinkExternalAuth(
                this.client.authStore.model?.id,
                options.provider,
            ).then(
                (res: boolean) => {
                    return res;
                },
            ).catch(
                (err: ClientResponseError) => {
                    if (this.return_null_on_error) {
                        return false;
                    }
                    throw err;
                },
            );
    }

    /**
     * Wraps the getList method from the pocketbase client. It uses generics
     * to return the correct type when querying the collection. If you
     * already have some type definitions, you can use them in the generics
     * provided in this function.
     *
     * @param {PbdGetListOptions} options - The options for the getList
     * @returns {Promise<ListResult<T> | null>} - The result of the getList, or null if return_null_on_error
     * is set to true
     *
     * @example Get a list of "products" from the "products" collection.
     * ```typescript
     *  import { Client } from "pocketbase";
     *  import { Pbd } from "pbd";
     *
     *  const pb: Client = new PocketBase();
     *  const pbd: Pbd = new Pbd({ client: pb });
     *
     *  const products: ListResult<Product> = await pbd
     *     .getList({ collectionName: "products" });
     *
     *  // If you want to change the page and the number of items returned per
     *  // page you can use the optional parameters.
     *
     * const products: ListResult<Product> = await pbd
     *     .getList({ collectionName: "products", page: 1, perPage: 10 });
     *
     * // PocketBase options are also available if you need them:
     *
     * const products: ListResult<Product> = await pbd
     *     .getList({
     *          collectionName: "products",
     *          options: { sort: "-created" }
     *     });
     *
     * ```
     */
    async getList<T>(
        options: PbdGetListOptions,
    ): Promise<ListResult<T> | null> {
        return await this.client.collection(options.collectionName).getList<T>(
            options.page,
            options.perPage,
            options.options,
        ).then(
            (res: ListResult<T>) => {
                if (res.totalItems === 0) {
                    if (this.return_null_on_error) {
                        return null;
                    }

                    throw new Error(
                        `No items found in ${options.collectionName}`,
                    );
                }

                return res;
            },
        ).catch(
            (err: ClientResponseError) => {
                if (this.return_null_on_error) {
                    return null;
                }
                throw err;
            },
        );
    }

    /**
     * Wraps the getFullList method from the pocketbase client. It uses generics
     * to return the correct type when querying the collection. If you
     * already have some type definitions, you can use them in the generics
     * provided in this function.
     *
     * @param options {PbdQueryOptions} - The options for the getFullList pocketbase method
     * @returns {Promise<T[] | null>} - The result of the getFullList pocketbase method,
     * or null if return_null_on_error is set to true
     */
    async getFullList<T>(options: PbdQueryOptions): Promise<T[] | null> {
        return await this.client
            .collection(options.collectionName)
            .getFullList<T>({
                options: options.options,
                sort: options.sort,
            }).then(
                (res: T[]) => {
                    if (res.length === 0) {
                        if (this.return_null_on_error) {
                            return null;
                        }
                        throw new Error(
                            `No items found in collection ${options.collectionName}`,
                        );
                    }

                    return res;
                },
            ).catch(
                (err: ClientResponseError) => {
                    if (this.return_null_on_error) {
                        return null;
                    }
                    throw err;
                },
            );
    }

    /**
     * Wraps the getFirstListItem method from the pocketbase client. It uses generics
     * to return the correct type when querying the collection. If you
     * already have some type definitions, you can use them in the generics
     * provided in this function.
     *
     * @param options {PbdQueryOptions} - The options for the getFirstListItem
     * @returns {Promise<T | null>} - The result of the getFirstListItem
     * or null if return_null_on_error is set to true
     */
    async getFirstListItem<T>(options: PbdQueryOptions): Promise<T | null> {
        return await this.client
            .collection(options.collectionName)
            .getFirstListItem<T>(
                options.filter ? options.filter.toString() : "",
                {
                    options: options.options,
                },
            ).then(
                (res: T) => {
                    return res;
                },
            ).catch(
                (err: ClientResponseError) => {
                    if (this.return_null_on_error) {
                        return null;
                    }
                    throw err;
                },
            );
    }

    /**
     * Wraps the getOne method from the pocketbase client. It uses generics
     * to return the correct type when querying the collection. If you
     * already have some type definitions, you can use them in the generics
     * provided in this function.
     *
     * @throws {ClientResponseError} - If the request to pocketbase fails
     * @param record_id {string} - The id of the record
     * @param options {PbdQueryOptions} - The options for the getOne
     * @returns {Promise<T | null>} - The result of the getOne or null if
     * return_null_on_error is set to true
     */
    async getOne<T>(
        record_id: string,
        options: PbdQueryOptions,
    ): Promise<T | null> {
        return await this.client.collection(options.collectionName).getOne<T>(
            record_id,
            {
                ...options.options,
            },
        ).then(
            (res: T) => {
                return res;
            },
        ).catch(
            (err: ClientResponseError) => {
                if (this.return_null_on_error) {
                    return null;
                }
                throw err;
            },
        );
    }

    /**
     * Wraps the create method from the pocketbase client. It uses generics
     * to return the correct type when querying the collection. If you
     * already have some type definitions, you can use them in the generics
     * provided in this function.
     *
     * See {@linkcode PbdCreateOptions}
     *
     * @throws {ClientResponseError} - If the request to pocketbase fails
     * @param options {PbdQueryOptions} - The options for the create
     * @param data {T} - The data to create
     * @returns {Promise<T | null>} - The result of the create, or null if
     * return_null_on_error is set to true
     */
    async create<T>(
        options: PbdQueryOptions,
        // deno-lint-ignore no-explicit-any
        data: any,
    ): Promise<T | null> {
        return await this.client.collection(options.collectionName).create<T>(
            data,
            {
                ...options.options,
            },
        ).then(
            (res: T) => {
                return res;
            },
        ).catch(
            (err: ClientResponseError) => {
                if (this.return_null_on_error) {
                    return null;
                }
                throw err;
            },
        );
    }

    /**
     * Wraps the update method from the pocketbase client. It uses generics
     * to return the correct type when querying the collection. If you
     * already have some type definitions, you can use them in the generics
     * provided in this function.
     *
     * @throws {ClientResponseError} - If the request to pocketbase fails
     * @param record_id {string} - The id of the record
     * @param options {PbdQueryOptions} - The options for the update
     * @param data {T} - The data to update
     * @returns {Promise<T | null>} - The result of the update, or null if
     * return_null_on_error is set to true
     */
    async update<T>(
        record_id: string,
        options: PbdQueryOptions,
        // deno-lint-ignore no-explicit-any
        data: any,
    ): Promise<T | null> {
        return await this.client.collection(options.collectionName).update<T>(
            record_id,
            data,
            {
                ...options.options,
            },
        ).then(
            (res: T) => {
                return res;
            },
        ).catch(
            (err: ClientResponseError) => {
                if (this.return_null_on_error) {
                    return null;
                }
                throw err;
            },
        );
    }

    /**
     * Wraps the delete method from the pocketbase client. It uses generics
     * to return the correct type when querying the collection. If you
     * already have some type definitions, you can use them in the generics
     * provided in this function.
     *
     * @throws {ClientResponseError} - If the request to pocketbase fails
     * @param record_id {string} - The id of the record
     * @param options {PbdQueryOptions} - The options for the delete
     * @returns {Promise<void>} - The result of the delete
     */
    async delete(
        record_id: string,
        options: PbdQueryOptions,
    ): Promise<boolean> {
        return await this.client.collection(options.collectionName).delete(
            record_id,
            { ...options.options },
        ).then(
            (res: boolean) => {
                return res;
            },
        ).catch(
            (err: ClientResponseError) => {
                if (this.return_null_on_error) {
                    return false;
                }
                throw err;
            },
        );
    }

    /**
     * Wraps the fileGetUrl method from the pocketbase client. It uses generics
     * to return the correct type when querying the collection. If you
     * already have some type definitions, you can use them in the generics
     * provided in this function.
     *
     * @throws {ClientResponseError} - If the request to pocketbase fails
     * @param options {PbdQueryOptions} - The options for the fileGetUrl
     * @param filename {string} - The name of the file
     * @param record_id {string} - The id of the record
     * @returns {string} - The result of the fileGetUrl
     */
    fileGetUrl<T>(
        options: PbdQueryOptions,
        filename: string,
        record_id: string,
    ): string {
        return this.client.files.getUrl(
            this.client.collection(options.collectionName).getOne<T>(record_id),
            filename,
            {
                ...options.options,
            },
        );
    }

    /**
     * Wraps the getToken method from the pocketbase client. This is used
     * to get tokens for protected files in the pocketbase server.
     *
     * > [!IMPORTANT]
     * > This method requires the client to be authenticated.
     * > either as user or admin.
     *
     * @throws {ClientResponseError} - If the request to pocketbase fails
     * @returns {Promise<string | null>} - The result of the getToken, or null if
     * return_null_on_error is set to true
     */
    async getFileToken(): Promise<string | null> {
        if (this.unauthorized_errors && !this.client.authStore.isValid) {
            throw new Error(
                `Attempted to make a protected operation. The current client user auth state is ${this.client.authStore.isValid}.`,
            );
        }
        return await this.client.files.getToken().then(
            (res: string) => {
                return res;
            },
        ).catch(
            (err: ClientResponseError) => {
                if (this.return_null_on_error) {
                    return null;
                }
                throw err;
            },
        );
    }

    /**
     * Wraps the getHealth method from the pocketbase client. This
     *
     * @throws {ClientResponseError} - If the request to pocketbase fails
     * @returns {Promise<HealthCheckResponse | null>} - The result of the getHealth, or null if
     * return_null_on_error is set to true
     */
    async getHealth(): Promise<HealthCheckResponse | null> {
        return await this.client.health.check().then(
            (res: HealthCheckResponse) => {
                return res;
            },
        ).catch(
            (err: ClientResponseError) => {
                if (this.return_null_on_error) {
                    return null;
                }
                throw err;
            },
        );
    }

    /**
     * Wraps the listBackups method from the pocketbase client.
     *
     * @throws {ClientResponseError} - If the request to pocketbase fails
     * @param options {PbdListBackupOptions} - The options for the listBackups
     * @returns {Promise<BackupFileInfo[] | null>} - The result of the listBackups,
     * or null if return_null_on_error is set to true
     */
    async listBackups(
        options: PbdListBackupOptions,
    ): Promise<BackupFileInfo[] | null> {
        if (this.unauthorized_errors && !this.client.authStore.isAdmin) {
            throw new Error(
                `Attempted to make an administrator operation. The current client 'isAdmin' state is ${this.client.authStore.isAdmin}.`,
            );
        }

        return await this.client.backups.getFullList({
            fields: options.fields,
            options: options.options,
        }).then(
            (res: unknown | BackupFileInfo[]) => {
                if (!Array.isArray(res)) {
                    throw new Error(`The returned data is not an array.`);
                }
                return res;
            },
        ).catch(
            (err: ClientResponseError) => {
                if (this.return_null_on_error) {
                    return null;
                }
                throw err;
            },
        );
    }

    /**
     * Wraps the createBackup method from the pocketbase client.
     *
     * @throws {ClientResponseError} - If the request to pocketbase fails
     * @param backup_name {string} - The name of the backup to create.
     * @returns {Promise<boolean>} - The result of the createBackup
     */
    async createBackup(backup_name: string): Promise<boolean> {
        if (this.unauthorized_errors && !this.client.authStore.isAdmin) {
            throw new Error(
                `Attempted to make an administrator operation. The current client 'isAdmin' state is ${this.client.authStore.isAdmin}.`,
            );
        }

        return await this.client.backups.create(backup_name).then(
            (res: boolean) => {
                return res;
            },
        ).catch(
            (err: ClientResponseError) => {
                if (this.return_null_on_error) {
                    return false;
                }
                throw err;
            },
        );
    }

    /**
     * Uploads a backup to the PocketBase server.
     *
     * @throws {ClientResponseError} - If the request to pocketbase fails
     * @param blob {Blob} - The blob to upload
     * @returns {Promise<boolean>} - The result of the upload
     */
    async uploadBackup(blob: Blob): Promise<boolean> {
        if (this.unauthorized_errors && !this.client.authStore.isAdmin) {
            throw new Error(
                `Attempted to make an administrator operation. The current client 'isAdmin' state is ${this.client.authStore.isAdmin}.`,
            );
        }

        return await this.client.backups.upload(
            {
                file: blob,
            },
        ).then(
            (res: boolean) => {
                return res;
            },
        ).catch(
            (err: ClientResponseError) => {
                if (this.return_null_on_error) {
                    return false;
                }
                throw err;
            },
        );
    }

    /**
     * Delete a backup from the PocketBase server.
     *
     * @throws {ClientResponseError} - If the request to pocketbase fails
     * @param backup_name {string} - The name of the backup
     * @returns {Promise<boolean>} - The result of the delete
     */
    async deleteBackup(backup_name: string): Promise<boolean> {
        if (this.unauthorized_errors && !this.client.authStore.isAdmin) {
            throw new Error(
                `Attempted to make an administrator operation. The current client 'isAdmin' state is ${this.client.authStore.isAdmin}.`,
            );
        }

        return await this.client.backups.delete(backup_name).then(
            (res: boolean) => {
                return res;
            },
        ).catch(
            (err: ClientResponseError) => {
                if (this.return_null_on_error) {
                    return false;
                }
                throw err;
            },
        );
    }

    /**
     * Restore a backup from the PocketBase.
     *
     * @throws {ClientResponseError} - If the request to pocketbase fails
     * @param backup_name {string}- The name of the backup
     * @returns {Promise<boolean>}
     */
    async restoreBackup(backup_name: string): Promise<boolean> {
        if (this.unauthorized_errors && !this.client.authStore.isAdmin) {
            throw new Error(
                `Attempted to make an administrator operation. The current client 'isAdmin' state is ${this.client.authStore.isAdmin}.`,
            );
        }

        return await this.client.backups.restore(backup_name).then(
            (res: boolean) => {
                return res;
            },
        ).catch(
            (err: ClientResponseError) => {
                if (this.return_null_on_error) {
                    return false;
                }
                throw err;
            },
        );
    }

    /**
     * Get the download url of a backup file from the PocketBase.
     *
     * @throws {ClientResponseError} - If the request to pocketbase fails
     * @param options {PbdDownloadBackupOptions} - The options for the downloadBackup
     * @returns {string}- The download url
     */
    downloadBackup(options: PbdDownloadBackupOptions): string {
        if (this.unauthorized_errors && !this.client.authStore.isAdmin) {
            throw new Error(
                `Attempted to make an administrator operation. The current client 'isAdmin' state is ${this.client.authStore.isAdmin}.`,
            );
        }

        return this.client.backups.getDownloadUrl(
            options.token,
            options.backupName,
        );
    }

    /**
     * Get a list of logs from the PocketBase.
     *
     * - A filter string is required to use this function
     *
     * @throws {ClientResponseError} - If the request to pocketbase fails
     * @param options {PbdGetLogsOptions} - The options for the getLogList method
     * @returns {Promise<ListResult<LogModel> | null>} - The list of logs, or
     * null if return_null_on_error is set to true
     */
    async getLogList(
        options: PbdGetLogsOptions,
    ): Promise<ListResult<LogModel> | null> {
        if (this.unauthorized_errors && !this.client.authStore.isAdmin) {
            throw new Error(
                `Attempted to make an administrator operation. The current client 'isAdmin' state is ${this.client.authStore.isAdmin}.`,
            );
        }

        return await this.client.logs.getList(options.page, options.perPage, {
            filter: options.filter,
        }).then(
            (res: ListResult<LogModel>) => {
                return res;
            },
        ).catch(
            (err: ClientResponseError) => {
                if (this.return_null_on_error) {
                    return null;
                }
                throw err;
            },
        );
    }

    /**
     * Get a single log entry from the PocketBase.
     *
     * @throws {ClientResponseError} - If the request to pocketbase fails
     * @param log_id {string} - The id of the log to get
     * @returns {Promise<LogModel | null>} - The log object or null if
     * return_null_on_error is set to true
     */
    async getOneLog(log_id: string): Promise<LogModel | null> {
        if (this.unauthorized_errors && !this.client.authStore.isAdmin) {
            throw new Error(
                `Attempted to make an administrator operation. The current client 'isAdmin' state is ${this.client.authStore.isAdmin}.`,
            );
        }
        return await this.client.logs.getOne(log_id).then(
            (res: LogModel) => {
                return res;
            },
        ).catch(
            (err: ClientResponseError) => {
                if (this.return_null_on_error) {
                    return null;
                }
                throw err;
            },
        );
    }

    /**
     * Get all the stats from the PocketBase.
     *
     * @throws {ClientResponseError} - If the request to pocketbase fails
     * @param filter {string} - The filter to use
     * @returns {Promise<HourlyStats[] | null>} - The stats from Pocketbase or
     * null if return_null_on_error is set to true
     */
    async getLogStats(filter: string): Promise<HourlyStats[] | null> {
        if (this.unauthorized_errors && !this.client.authStore.isAdmin) {
            throw new Error(
                `Attempted to make an administrator operation. The current client 'isAdmin' state is ${this.client.authStore.isAdmin}.`,
            );
        }
        return await this.client.logs.getStats({
            filter: filter,
        }).then(
            (res: HourlyStats[]) => {
                return res;
            },
        ).catch(
            (err: ClientResponseError) => {
                if (this.return_null_on_error) {
                    return null;
                }
                throw err;
            },
        );
    }

    /**
     * Get all current settings from the PocketBase.
     *
     * @throws {ClientResponseError} - If the request to pocketbase fails
     * @returns {Promise<{[key: string]: unknown}> | null} - The settings that
     * Pocketbase uses or null if return_null_on_error is set to true
     */
    async getAllSettings(): Promise<{ [key: string]: unknown } | null> {
        if (this.unauthorized_errors && !this.client.authStore.isAdmin) {
            throw new Error(
                `Attempted to make an administrator operation. The current client 'isAdmin' state is ${this.client.authStore.isAdmin}.`,
            );
        }
        return await this.client.settings.getAll().then(
            (res: { [key: string]: unknown }) => {
                return res;
            },
        ).catch(
            (err: ClientResponseError) => {
                if (this.return_null_on_error) {
                    return null;
                }
                throw err;
            },
        );
    }

    /**
     * Update the settings. It requires a pocketbase settings object.
     *
     * @throws {ClientResponseError} - If the request to pocketbase fails
     * @param settings {[key: string]: unknown} - The settings to update
     * @returns {Promise<{[key: string]: unknown} | null>} - The updated settings or
     * null if return_null_on_error is set to true
     */
    async updateSettings(
        settings: { [key: string]: unknown },
    ): Promise<{ [key: string]: unknown } | null> {
        if (this.unauthorized_errors && !this.client.authStore.isAdmin) {
            throw new Error(
                `Attempted to make an administrator operation. The current client 'isAdmin' state is ${this.client.authStore.isAdmin}.`,
            );
        }

        return await this.client.settings.update(settings).then(
            (res: { [key: string]: unknown }) => {
                return res;
            },
        ).catch(
            (err: ClientResponseError) => {
                if (this.return_null_on_error) {
                    return null;
                }
                throw err;
            },
        );
    }

    /**
     * Test the configured S3 settings
     *
     * @param options {PbdTestS3Options} - The options for the test S3
     * @returns {Promise<boolean>} - True if the backups are working, false if
     * an error occurred or if backups are not configured
     */
    async testS3(options: PbdTestS3Options): Promise<boolean> {
        if (this.unauthorized_errors && !this.client.authStore.isAdmin) {
            throw new Error(
                `Attempted to make an administrator operation. The current client 'isAdmin' state is ${this.client.authStore.isAdmin}.`,
            );
        }

        return await this.client.settings.testS3(options.backups).then(
            (res: boolean) => {
                return res;
            },
        ).catch(
            (err: ClientResponseError) => {
                if (this.return_null_on_error) {
                    return false;
                }
                throw err;
            },
        );
    }

    /**
     * Sends a test email via PocketBase with configured SMTP settings.
     *
     * @param options {PbdTestEmailOptions} - The options for the test email
     * @throws {ClientResponseError} - If the request to pocketbase fails
     * @returns {Promise<boolean>} - True if the email was sent
     */
    async testEmail(options: PbdTestEmailOptions): Promise<boolean> {
        if (this.unauthorized_errors && !this.client.authStore.isAdmin) {
            throw new Error(
                `Attempted to make an administrator operation. The current client 'isAdmin' state is ${this.client.authStore.isAdmin}.`,
            );
        }

        return await this.client.settings.testEmail(
            options.email,
            options.template,
        ).then(
            (res: boolean) => {
                return res;
            },
        ).catch(
            (err: ClientResponseError) => {
                if (this.return_null_on_error) {
                    return false;
                }
                throw err;
            },
        );
    }

    /**
     * Generate Apple client secret for the current user
     *
     * @throws {ClientResponseError} - If the request to pocketbase fails
     * @param options {PbdGenerateAppleClientSecretOptions} - The options for the
     * generateAppleClientSecret.
     * @returns {Promise<appleClientSecret | null>} - The apple client secret or null
     * if return_null_on_error is set to true
     */
    async generateAppleClientSecret(
        options: PbdGenerateAppleClientSecretOptions,
    ): Promise<appleClientSecret | null> {
        if (this.unauthorized_errors && !this.client.authStore.isAdmin) {
            throw new Error(
                `Attempted to make an administrator operation. The current client 'isAdmin' state is ${this.client.authStore.isAdmin}.`,
            );
        }

        return await this.client.settings.generateAppleClientSecret(
            options.client_id,
            options.team_id,
            options.key_id,
            options.private_key,
            options.duration,
        ).then(
            (res: appleClientSecret | unknown) => {
                if (res instanceof appleClientSecret) {
                    return res as appleClientSecret;
                } else {
                    return res as unknown as appleClientSecret;
                }
            },
        ).catch(
            (err: ClientResponseError) => {
                if (this.return_null_on_error) {
                    return null;
                }
                throw err;
            },
        );
    }

    /**
     * Get a paginated list of the current collections from the PocketBase.
     *
     * @throws {ClientResponseError} - If the request to pocketbase fails
     * @param options {PbdGetListOptions} - The options for the getFullCollectionsList
     * @returns {Promise<ListResult<CollectionModel> | null>} - The list of collections
     * or null if return_null_on_error is set to true
     */
    async getCollectionList(
        options: PbdGetListOptions,
    ): Promise<ListResult<CollectionModel> | null> {
        if (this.unauthorized_errors && !this.client.authStore.isAdmin) {
            throw new Error(
                `Attempted to make an administrator operation. The current client 'isAdmin' state is ${this.client.authStore.isAdmin}.`,
            );
        }

        return await this.client.collections.getList(
            options.page,
            options.perPage,
            {
                ...options.options,
            },
        ).then(
            (res: ListResult<CollectionModel>) => {
                return res;
            },
        ).catch(
            (err: ClientResponseError) => {
                if (this.return_null_on_error) {
                    return null;
                }
                throw err;
            },
        );
    }

    /**
     * Get all the collections from the PocketBase.
     *
     * @throws {ClientResponseError} - If the request to pocketbase fails
     * @param options {PbdGetListOptions} - The options for the getFullCollectionsList
     * @returns {Promise<CollectionModel[] | null>} - The list of collections
     * or null if return_null_on_error is set to true
     */
    async getCollectionFullList(
        options: PbdGetListOptions,
    ): Promise<CollectionModel[] | null> {
        if (this.unauthorized_errors && !this.client.authStore.isAdmin) {
            throw new Error(
                `Attempted to make an administrator operation. The current client 'isAdmin' state is ${this.client.authStore.isAdmin}.`,
            );
        }

        return await this.client.collections.getFullList({
            ...options.options,
        }).then(
            (res: CollectionModel[]) => {
                return res;
            },
        ).catch(
            (err: ClientResponseError) => {
                if (this.return_null_on_error) {
                    return null;
                }
                throw err;
            },
        );
    }

    /**
     * Get the first collection from the PocketBase using a specific filter.
     *
     * @throws {ClientResponseError} - If the request to pocketbase fails
     * @param options {PbdGetListOptions} - The options for the getFullCollectionsList
     * @returns {Promise<CollectionModel | null>} - The list of collections or null
     * if return_null_on_error is set to true
     */
    async getCollectionFirstListItem(
        options: PbdGetListOptions,
    ): Promise<CollectionModel | null> {
        if (this.unauthorized_errors && !this.client.authStore.isAdmin) {
            throw new Error(
                `Attempted to make an administrator operation. The current client 'isAdmin' state is ${this.client.authStore.isAdmin}.`,
            );
        }

        return await this.client.collections.getFirstListItem(
            options.filter ? options.filter.toString() : "",
        ).then(
            (res: CollectionModel | null) => {
                return res;
            },
        ).catch(
            (err: ClientResponseError) => {
                if (this.return_null_on_error) {
                    return null;
                }
                throw err;
            },
        );
    }

    /**
     * Get a specific collection from the PocketBase.
     *
     * @throws {ClientResponseError} - If the request to pocketbase fails
     * @param options {PbdGetOneCollectionOptions} - The options for the getFullCollectionsList
     * @returns {Promise<CollectionModel | null>} - The collection that was found or null
     * if return_null_on_error is set
     */
    async getOneCollection(
        options: PbdGetOneCollectionOptions,
    ): Promise<CollectionModel | null> {
        if (this.unauthorized_errors && !this.client.authStore.isAdmin) {
            throw new Error(
                `Attempted to make an administrator operation. The current client 'isAdmin' state is ${this.client.authStore.isAdmin}.`,
            );
        }

        return await this.client.collections.getOne(options.nameOrId).then(
            (res: CollectionModel) => {
                return res;
            },
        ).catch(
            (err: ClientResponseError) => {
                if (this.return_null_on_error) {
                    return null;
                }
                throw err;
            },
        );
    }

    /**
     * Create a new collection in the PocketBase.
     *
     * @throws {ClientResponseError} - If the request to pocketbase fails
     * @param options {PbdCreateCollectionOptions} - The options for the getFullCollectionsList
     * @returns {Promise<CollectionModel | null>} - The collection that was created
     * or null if return_null_on_error is set
     */
    async createCollection(
        options: PbdCreateCollectionOptions,
    ): Promise<CollectionModel | null> {
        if (this.unauthorized_errors && !this.client.authStore.isAdmin) {
            throw new Error(
                `Attempted to make an administrator operation. The current client 'isAdmin' state is ${this.client.authStore.isAdmin}.`,
            );
        }

        return await this.client.collections.create({
            name: options.name,
            type: options.type,
            schema: options.schema,
            listRule: options.listRule,
            viewRule: options.viewRule,
            createRule: options.createRule,
            updateRule: options.updateRule,
            deleteRule: options.deleteRule,
            options: options.options,
        }).then(
            (res: CollectionModel) => {
                return res;
            },
        ).catch(
            (err: ClientResponseError) => {
                if (this.return_null_on_error) {
                    return null;
                }
                throw err;
            },
        );
    }

    /**
     * Update an existing collection in the PocketBase.
     *
     * @throws {ClientResponseError} - If the request to pocketbase fails
     * @param options {PbdCreateCollectionOptions} - The options for the getFullCollectionsList
     * @returns {Promise<CollectionModel | null>} - The collection that was created
     * or null if return_null_on_error is set
     */
    async updateCollection(
        options: PbdCreateCollectionOptions,
    ): Promise<CollectionModel | null> {
        if (this.unauthorized_errors && !this.client.authStore.isAdmin) {
            throw new Error(
                `Attempted to make an administrator operation. The current client 'isAdmin' state is ${this.client.authStore.isAdmin}.`,
            );
        }

        return await this.client.collections.update(options.name, {
            name: options.name,
            type: options.type,
            schema: options.schema,
            createRule: options.createRule,
            updateRule: options.updateRule,
            deleteRule: options.deleteRule,
            options: options.options,
        }).then(
            (res: CollectionModel) => {
                return res;
            },
        ).catch(
            (err: ClientResponseError) => {
                if (this.return_null_on_error) {
                    return null;
                }
                throw err;
            },
        );
    }

    /**
     * Delete an existing collection in the PocketBase.
     *
     * @throws {ClientResponseError} - If the request to pocketbase fails
     * @param options {PbdDeleteCollectionOptions} - The options for the getFullCollectionsList
     * @returns {Promise<boolean>} - The result of the delete
     */
    async deleteCollection(
        options: PbdDeleteCollectionOptions,
    ): Promise<boolean> {
        if (this.unauthorized_errors && !this.client.authStore.isAdmin) {
            throw new Error(
                `Attempted to make an administrator operation. The current client 'isAdmin' state is ${this.client.authStore.isAdmin}.`,
            );
        }

        return await this.client.collections.delete(options.nameOrId).then(
            (res: boolean) => {
                return res;
            },
        ).catch(
            (err: ClientResponseError) => {
                if (this.return_null_on_error) {
                    return false;
                }
                throw err;
            },
        );
    }

    /**
     * Import collections into the PocketBase.
     *
     * @throws {ClientResponseError} - If the request to pocketbase fails
     * @param options {PbdImportCollectionsOptions} - The options for the importCollections
     * @returns {Promise<boolean>} - The result of the import
     */
    async importCollections(
        options: PbdImportCollectionsOptions,
    ): Promise<boolean> {
        if (this.unauthorized_errors && !this.client.authStore.isAdmin) {
            throw new Error(
                `Attempted to make an administrator operation. The current client 'isAdmin' state is ${this.client.authStore.isAdmin}.`,
            );
        }

        return await this.client.collections.import(
            options.collections,
            options.deleteMissing,
        )
            .then(
                (res: boolean) => {
                    return res;
                },
            ).catch(
                (err: ClientResponseError) => {
                    if (this.return_null_on_error) {
                        return false;
                    }
                    throw err;
                },
            );
    }

    /**
     * Authenticates an admin with the provided email and password.
     *
     * @throws {ClientResponseError} - If the request to pocketbase fails
     * @param options {PbdAdminAuthWithPasswordOptions} - The options for the adminAuthWithPassword
     * @returns {Promise<AdminAuthResponse | null>} - The result of the adminAuthWithPassword
     * or null if return_null_on_error is set to true
     */
    async adminAuthWithPassword(
        options: PbdAdminAuthWithPasswordOptions,
    ): Promise<AdminAuthResponse | null> {
        return await this.client.admins.authWithPassword(
            options.email,
            options.password,
        )
            .then(
                (res: AdminAuthResponse) => {
                    return res;
                },
            ).catch(
                (err: ClientResponseError) => {
                    if (this.return_null_on_error) {
                        return null;
                    }
                    throw err;
                },
            );
    }

    /**
     * Refreshes an admin token.
     *
     * @throws {ClientResponseError} - If the request to pocketbase fails
     * @returns {Promise<AdminAuthResponse | null>} - The result of the adminAuthRefresh
     * or null if return_null_on_error is set to true
     */
    async adminAuthRefresh(): Promise<AdminAuthResponse | null> {
        if (this.unauthorized_errors && !this.client.authStore.isAdmin) {
            throw new Error(
                `Attempted to make an administrator operation. The current client 'isAdmin' state is ${this.client.authStore.isAdmin}.`,
            );
        }

        return await this.client.admins.authRefresh().then(
            (res: AdminAuthResponse) => {
                return res;
            },
        ).catch(
            (err: ClientResponseError) => {
                if (this.return_null_on_error) {
                    return null;
                }
                throw err;
            },
        );
    }

    /**
     * Requests a password reset for an admin account with the provided email.
     *
     * @throws {ClientResponseError} - If the request to pocketbase fails
     * @param email {string} - The email of the admin
     * @returns {Promise<boolean>} - The result of the requestPasswordReset
     */
    async adminRequestPasswordReset(
        options: PbdAdminPasswordResetOptions,
    ): Promise<boolean> {
        return await this.client.admins.requestPasswordReset(options.email)
            .then(
                (res: boolean) => {
                    return res;
                },
            ).catch(
                (err: ClientResponseError) => {
                    if (this.return_null_on_error) {
                        return false;
                    }
                    throw err;
                },
            );
    }

    /**
     * Confirms a password reset for an admin account. If the token
     * is invalid, an error will be thrown.
     *
     * @throws {ClientResponseError} - If the request to pocketbase fails
     * @param options {PbdAdminConfirmPasswordResetOptions} - The options for the confirmPasswordReset
     * @returns {Promise<boolean>} - The result of the confirmPasswordReset
     */
    async adminConfirmPasswordReset(
        options: PbdAdminConfirmPasswordResetOptions,
    ): Promise<boolean> {
        return await this.client.admins.confirmPasswordReset(
            options.token,
            options.password,
            options.passwordConfirm,
        ).then(
            (res: boolean) => {
                return res;
            },
        ).catch(
            (err: ClientResponseError) => {
                if (this.return_null_on_error) {
                    return false;
                }
                throw err;
            },
        );
    }

    /**
     * Get a list of admins. The list can be filtered and sorted.
     *
     * @throws {ClientResponseError} - If the request to pocketbase fails
     * @param options {PbdAdminGetListOptions} - The options for the adminGetList
     * @returns {Promise<ListResult<AdminModel> | null>} - The result of the adminGetList
     * or null if return_null_on_error is set to true
     */
    async adminGetList(
        options: PbdAdminGetListOptions,
    ): Promise<ListResult<AdminModel> | null> {
        if (this.unauthorized_errors && !this.client.authStore.isAdmin) {
            throw new Error(
                `Attempted to make an administrator operation. The current client 'isAdmin' state is ${this.client.authStore.isAdmin}.`,
            );
        }

        return await this.client.admins.getList(options.page, options.perPage, {
            sort: options.sort,
            filter: options.filter,
        }).then(
            (res: ListResult<AdminModel>) => {
                return res;
            },
        ).catch(
            (err: ClientResponseError) => {
                if (this.return_null_on_error) {
                    return null;
                }
                throw err;
            },
        );
    }

    /**
     * Get the full list of admins. The list can be filtered and sorted.
     *
     * @throws {ClientResponseError} - If the request to pocketbase fails
     * @param options {PbdAdminGetFullListOptions} - The options for the adminGetFullList
     * @returns {Promise<AdminModel[] | null>} - The result of the adminGetFullList
     * or null if return_null_on_error is set to true
     */
    async adminGetFullList(
        options: PbdAdminGetFullListOptions,
    ): Promise<AdminModel[] | null> {
        if (this.unauthorized_errors && !this.client.authStore.isAdmin) {
            throw new Error(
                `Attempted to make an administrator operation. The current client 'isAdmin' state is ${this.client.authStore.isAdmin}.`,
            );
        }

        return await this.client.admins.getFullList({
            sort: options.sort,
            options: options.options,
        }).then(
            (res: AdminModel[]) => {
                return res;
            },
        ).catch(
            (err: ClientResponseError) => {
                if (this.return_null_on_error) {
                    return null;
                }
                throw err;
            },
        );
    }

    /**
     * Get the first item in the list based on the filter or sort options.
     *
     * @throws {ClientResponseError} - If the request to pocketbase fails
     * @param options {PbdAdminGetListOptions} - The options for the adminGetFirstListItem
     * @returns {Promise<AdminModel | null>} - The result of the adminGetFirstListItem
     */
    async adminGetFirstListItem(
        options: PbdAdminGetListOptions,
    ): Promise<AdminModel | null> {
        if (this.unauthorized_errors && !this.client.authStore.isAdmin) {
            throw new Error(
                `Attempted to make an administrator operation. The current client 'isAdmin' state is ${this.client.authStore.isAdmin}.`,
            );
        }

        return await this.client.admins.getFirstListItem(
            options.filter ? options.filter : "",
        ).then(
            (res: AdminModel) => {
                return res;
            },
        ).catch(
            (err: ClientResponseError) => {
                if (this.return_null_on_error) {
                    return null;
                }
                throw err;
            },
        );
    }

    /**
     * Get an admin by its ID. The admin can be filtered and sorted.
     *
     * @throws {ClientResponseError} - If the request to pocketbase fails
     * @param options {PbdAdminViewOptions} - The options for the adminView
     * @returns {Promise<AdminModel | null>} - The result of the adminView
     * or null if return_null_on_error is set to true
     */
    async adminView(options: PbdAdminViewOptions): Promise<AdminModel | null> {
        if (this.unauthorized_errors && !this.client.authStore.isAdmin) {
            throw new Error(
                `Attempted to make an administrator operation. The current client 'isAdmin' state is ${this.client.authStore.isAdmin}.`,
            );
        }

        return await this.client.admins.getOne(options.id).then(
            (res: AdminModel) => {
                return res;
            },
        ).catch(
            (err: ClientResponseError) => {
                if (this.return_null_on_error) {
                    return null;
                }
                throw err;
            },
        );
    }

    /**
     * Create a new admin in the PocketBase server.
     *
     * @throws {ClientResponseError} - If the request to pocketbase fails
     * @param options {PbdAdminCreateOptions} - The options for the adminCreate
     * @returns {Promise<AdminModel | null>} - The result of the adminCreate
     * or null if return_null_on_error is set to true
     */
    async adminCreate(
        options: PbdAdminCreateOptions,
    ): Promise<AdminModel | null> {
        if (this.unauthorized_errors && !this.client.authStore.isAdmin) {
            throw new Error(
                `Attempted to make an administrator operation. The current client 'isAdmin' state is ${this.client.authStore.isAdmin}.`,
            );
        }

        return await this.client.admins.create({
            email: options.email,
            password: options.password,
            passwordConfirm: options.passwordConfirm,
            avatar: options.avatar,
        }).then(
            (res: AdminModel) => {
                return res;
            },
        ).catch(
            (err: ClientResponseError) => {
                if (this.return_null_on_error) {
                    return null;
                }
                throw err;
            },
        );
    }

    /**
     * Update an admin by its ID.
     *
     * @throws {ClientResponseError} - If the request to pocketbase fails
     * @param options {PbdAdminUpdateOptions} - The options for the adminUpdate
     * @returns {Promise<AdminModel | null>} - The result of the adminUpdate
     * or null if return_null_on_error is set to true
     */
    async adminUpdate(
        options: PbdAdminUpdateOptions,
    ): Promise<AdminModel | null> {
        if (this.unauthorized_errors && !this.client.authStore.isAdmin) {
            throw new Error(
                `Attempted to make an administrator operation. The current client 'isAdmin' state is ${this.client.authStore.isAdmin}.`,
            );
        }

        return await this.client.admins.update(options.id, {
            email: options.email,
            password: options.password,
            passwordConfirm: options.passwordConfirm,
            avatar: options.avatar,
        }).then(
            (res: AdminModel) => {
                return res;
            },
        ).catch(
            (err: ClientResponseError) => {
                if (this.return_null_on_error) {
                    return null;
                }
                throw err;
            },
        );
    }

    /**
     * Delete an admin by its ID.
     *
     * @throws {ClientResponseError} - If the request to pocketbase fails
     * @param options {PbdAdminDeleteOptions} - The options for the adminDelete
     * @returns {Promise<boolean>} - The result of the adminDelet
     */
    async adminDelete(options: PbdAdminDeleteOptions): Promise<boolean> {
        if (this.unauthorized_errors && !this.client.authStore.isAdmin) {
            throw new Error(
                `Attempted to make an administrator operation. The current client 'isAdmin' state is ${this.client.authStore.isAdmin}.`,
            );
        }

        return await this.client.admins.delete(options.id).then(
            (res: boolean) => {
                return res;
            },
        ).catch(
            (err: ClientResponseError) => {
                if (this.return_null_on_error) {
                    return false;
                }
                throw err;
            },
        );
    }
}

/**
 * Module exports
 */
export { PbdExt };
export type * from "$types";
export type * from "pocketbase";
export default Pbd;
