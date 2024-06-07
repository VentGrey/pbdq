import Client, { ClientResponseError, ListResult, RecordAuthResponse, RecordModel } from "pocketbase";
import { PbdOptions, PbdGetListOptions, PbdAuthPasswordOptions } from "$types";

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
 */
export class Pbd {

    /**
     * The pocketbase client that is wrapped by the Pbd wrapper. 
     * @type {import("pocketbase").Client}
     */
    client: Client;

    /**
     * The constructor method for the Pbd wrapper.
     * @param options - The Pbd options when initializing the pocketbase
     * wrapper.
     */
    constructor(options: PbdOptions) {
        this.client = options.client;
    }

    async authWithPassword(options: PbdAuthPasswordOptions): Promise<void> {
        await this.client.collection(options.collectionName)
            .authWithPassword(options.user_or_email, options.password)
            .then(
                (res: RecordAuthResponse<RecordModel>) => {
                    return res;
                }
            ).catch(
                (err: ClientResponseError) => {
                    throw err;
                }
            )
    }

    async authRefresh(options: PbdAuthPasswordOptions): Promise<void> {
        await this.client.collection(options.collectionName).authRefresh().then(
            (res) => {
                return res;
            }
        ).catch(
            (err: ClientResponseError) => {
                throw err;
            }
        )
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
     *     .getList({ collectionName: "products", options: { sort: "-created" } });
     *  
     * ```
     */
    async getList<T>(options: PbdGetListOptions): Promise<ListResult<T>> {
        return await this.client.collection(options.collectionName).getList<T>(
            options.page,
            options.perPage,
            options.options
        ).then(
            (res: ListResult<T>) => {
                if (res.totalItems === 0)
                    throw new Error(`No items found in collection ${options.collectionName}`)

                return res
            }
        ).catch(
            (err: ClientResponseError) => {
                throw err
            }
        )
    }


}

/**
 * Module exports
 */
export type {
    PbdOptions,
    PbdQueryOptions,
    PbdGetListOptions
} from "$types";

export type {
    Client
}

export default Pbd;