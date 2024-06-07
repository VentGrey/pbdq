import Client from "pocketbase";

/**
 * The options for the Pbd wrapper object. As of now, it only needs an already
 * initialized pocketbase client.
 */
export interface PbdOptions {

    /**
     * The initialized pocketbase client to use for querying.
     * 
     * @type {import("pocketbase").Client}
     */
    client: Client;
}

export interface PbdQueryOptions {
    collectionName: string;
}

export interface PbdAuthPasswordOptions extends PbdQueryOptions {
    user_or_email: string;
    password: string;
}


export interface PbdGetListOptions extends PbdQueryOptions {
    page: number;
    perPage: number;
    options?: any;
}