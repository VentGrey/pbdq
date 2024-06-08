import Client, {
AuthMethodsList,
    ClientResponseError,
    ExternalAuthModel,
    ListResult,
    RecordAuthResponse,
    RecordModel,
} from "pocketbase";

import {
    PbdAuthPasswordOptions,
    PbdConfirmEmailChangeOptions,
    PbdConfirmPasswordResetOptions,
    PbdConfirmVerificationOptions,
    PbdGetListOptions,
    PbdOauthAuthOptions,
    PbdOptions,
    PbdRequestEmailChangeOptions,
    PbdRequestPasswordResetOptions,
    PbdRequestVerificationOptions,
} from "$types";
import { PbdQueryOptions } from "$types";

/**
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
 * @example - CRUD operations on "Cats" from the PocketBase Collection "cats"
 * ```typescript
 * // Work in progress
 * ```
 *
 * @module
 */
export class Pbd {
    /**
     * The pocketbase client that is wrapped by the Pbd wrapper.
     * @type {import("pocketbase").Client}
     */
    client: Client;

    /**
     * The constructor method for the Pbd wrapper. This takes in the options
     * passed in when initializing a new wrapper instance.
     *
     * @param options - The Pbd options when initializing the pocketbase
     * wrapper.
     */
    constructor(options: PbdOptions) {
        this.client = options.client;
    }

    /**
     * Mutates the client state to be authenticated against the pocketbase
     * server.
     *
     * @param options {PbdAuthPasswordOptions} - The options for thr
     * authWithPassword pocketbase sdk method.
     * @returns {Promise<void>} - Nothing. It only changes the client state
     * to be authenticated.
     */
    async authWithPassword(options: PbdAuthPasswordOptions): Promise<void> {
        await this.client.collection(options.collectionName)
            .authWithPassword(options.user_or_email, options.password)
            .then(
                (res: RecordAuthResponse<RecordModel>) => {
                    return res;
                },
            ).catch(
                (err: ClientResponseError) => {
                    throw err;
                },
            );
    }

    async authWithOAuth2(
        options: PbdOauthAuthOptions,
    ): Promise<RecordAuthResponse<RecordModel>> {
        return await this.client.collection(options.collectionName)
            .authWithOAuth2({
                provider: options.provider,
            }).then(
                (res: RecordAuthResponse<RecordModel>) => {
                    return res;
                },
            ).catch(
                (err: ClientResponseError) => {
                    throw err;
                },
            );
    }

    async authRefresh(options: PbdAuthPasswordOptions): Promise<void> {
        await this.client.collection(options.collectionName).authRefresh().then(
            (res: RecordAuthResponse<RecordModel>) => {
                return res;
            },
        ).catch(
            (err: ClientResponseError) => {
                throw err;
            },
        );
    }

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
                    throw err;
                },
            );
    }

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
                    throw err;
                },
            );
    }

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
                    throw err;
                },
            );
    }

    async confirmPasswordReset(
        options: PbdConfirmPasswordResetOptions,
    ): Promise<boolean> {
        return await this.client.collection(options.collectionName)
            .confirmPasswordReset(
                options.token,
                options.password,
                options.password_confirm,
            ).then(
                (res: boolean) => {
                    return res;
                },
            ).catch(
                (err: ClientResponseError) => {
                    throw err;
                },
            );
    }

    async requestEmailChange(
        options: PbdRequestEmailChangeOptions,
    ): Promise<boolean> {
        return await this.client.collection(options.collectionName)
            .requestEmailChange(options.email)
            .then(
                (res: boolean) => {
                    return res;
                },
            )
            .catch(
                (err: ClientResponseError) => {
                    throw err;
                },
            );
    }

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
                    throw err;
                },
            );
    }

    async listAuthMethods(options: PbdQueryOptions): Promise<AuthMethodsList> {
        return await this.client.collection(options.collectionName).listAuthMethods({
            ...options.options
        }).then(
            (res: AuthMethodsList) => {
                return res;
            }
        ).catch(
            (err: ClientResponseError) => {
                throw err;
            },
        )
    }

    async listExternalAuth(options: PbdQueryOptions): Promise<ExternalAuthModel[]> {
        return await this.client.collection(options.collectionName).listExternalAuths(
            this.client.authStore.model?.id
        );
    }



    /**
     * Wraps the getList method from the pocketbase client. It uses generics
     * to return the correct type when querying the collection. If you
     * already have some type definitions, you can use them in the generics
     * provided in this function.
     *
     * @param {PbdGetListOptions} options - The options for the getList
     * @returns {Promise<ListResult<T>>} - The result of the getList
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
    async getList<T>(options: PbdGetListOptions): Promise<ListResult<T>> {
        return await this.client.collection(options.collectionName).getList<T>(
            options.page,
            options.perPage,
            options.options,
        ).then(
            (res: ListResult<T>) => {
                if (res.totalItems === 0) {
                    throw new Error(
                        `No items found in ${options.collectionName}`,
                    );
                }

                return res;
            },
        ).catch(
            (err: ClientResponseError) => {
                throw err;
            },
        );
    }

    async getFullList<T>(options: PbdQueryOptions): Promise<T[]> {
        return await this.client.collection(options.collectionName).getFullList<
            T
        >({
            ...options.options,
        }).then(
            (res: T[]) => {
                if (res.length === 0) {
                    throw new Error(
                        `No items found in collection ${options.collectionName}`,
                    );
                }

                return res;
            },
        ).catch(
            (err: ClientResponseError) => {
                throw err;
            },
        );
    }
}

/**
 * Module exports
 */
export type {
    PbdAuthPasswordOptions,
    PbdConfirmEmailChangeOptions,
    PbdConfirmPasswordResetOptions,
    PbdConfirmVerificationOptions,
    PbdGetListOptions,
    PbdOauthAuthOptions,
    PbdOptions,
    PbdQueryOptions,
    PbdRequestEmailChangeOptions,
    PbdRequestPasswordResetOptions,
    PbdRequestVerificationOptions,
} from "$types";

export type { Client };

export default Pbd;
