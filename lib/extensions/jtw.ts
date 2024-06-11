import Pbd from "../../mod.ts";
import { PbdJWTExtOptions } from "$types";

export class PbdJWT {
    validity: boolean;
    id: string;
    token: string;
    issuer: string;
    subject: string;
    properties: unknown;

    constructor(options: {
        validity: boolean;
        id: string;
        token: string;
        issuer: string;
        subject: string;
        properties: unknown;
    }) {
        this.validity = options.validity;
        this.id = options.id;
        this.token = options.token;
        this.issuer = options.issuer;
        this.subject = options.subject;
        this.properties = options.properties;
    }
}

export const authWithPasswordJWT = async (
    Pbd: Pbd,
    options: PbdJWTExtOptions,
) => {
    // Try to authenticate the user
    await Pbd.client.collection(options.collectionName).authWithPassword(
        `${options.username_or_email}`,
        `${options.password}`,
    );

    if (!Pbd.client.authStore.isValid) {
        throw new Error(
            "Failed to emit PocketBase Token. Authentication failed. Check your credentials.",
        );
    }

    const jwt: PbdJWT = new PbdJWT({
        validity: Pbd.client.authStore.isValid,
        id: Pbd.client.authStore.model?.id,
        token: Pbd.client.authStore.token,
        issuer: options.issuer,
        subject: options.subject,
        properties: options.properties,
    });

    return jwt;
};

export const JWTRefresh = async (Pbd: Pbd, options: PbdJWTExtOptions) => {
};
