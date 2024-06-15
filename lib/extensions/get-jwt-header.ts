import Pbd from "$pbdq";

/**
 * Get the JWT header from the Pbd instance. If the
 * current state of the client says that it is not
 * a valid authenticated user, an empty string
 * is returned.
 *
 * @param pbd {Pbd} Pbd instance to interact with pocketbase
 * @returns {string} - User: {pbd.client.authStore.token}
 */
export const getJwtHeader = (pbd: Pbd): string => {
    if (!pbd.client.authStore.isValid) {
        return "";
    }

    return `Authorization: ${pbd.client.authStore.token}`;
};
