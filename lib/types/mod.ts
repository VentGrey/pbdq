import Client from "pocketbase";
import Pbd from "../../mod.ts";

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
    options?: HeadersInit;
}

export interface PbdOauthAuthOptions extends PbdQueryOptions {
    provider: string;
}

export interface PbdRequestVerificationOptions extends PbdQueryOptions {
    email: string;
}

export interface PbdConfirmVerificationOptions extends PbdQueryOptions {
    token: string;
}

export interface PbdRequestPasswordResetOptions extends PbdQueryOptions {
    email: string;
}

export interface PbdConfirmPasswordResetOptions extends PbdQueryOptions {
    token: string;
    password: string;
    password_confirm: string;
}

export interface PbdRequestEmailChangeOptions extends PbdQueryOptions {
    email: string;
}

export interface PbdConfirmEmailChangeOptions extends PbdQueryOptions {
    token: string;
    password: string;
}

export interface PbdAuthPasswordOptions extends PbdQueryOptions {
    user_or_email: string;
    password: string;
}

export interface PbdGetListOptions extends PbdQueryOptions {
    page: number;
    perPage: number;
}
