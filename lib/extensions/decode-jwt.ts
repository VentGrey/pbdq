import { decode } from "djwt";
import Pbd from "$pbdq";

/**
 * Decode the header from a JWT. This is useful for debugging
 * or applying custom routing logic based on the JWT header.
 *
 * @param Pbd {Pbd} - JWT to decode the header from.
 * @returns {string} - Decoded JWT header
 */
export const decodeJwtHeader = (Pbd: Pbd): string => {
    const [header, payload, signature] = decode(Pbd.client.authStore.token);

    return JSON.stringify({ header, payload, signature });
};
