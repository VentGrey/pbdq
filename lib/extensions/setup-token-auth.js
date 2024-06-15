import Pbd from "$pbdq";

/**
 * This extension allows you to setup the auth token
 * in the headers of the request.
 *
 * @param pbd {Pbd} - Pbd instance to use in the extension. This Pbd instance needs
 * an authenticated Client instance in core to work.
 */
export const setupPBTokenAuth = (pbd) => {
    pbd.client.beforeSend = function (url, options) {
        options.headers = Object.assign({}, options.headers, {
            "Authorization": `${pbd.client.authStore.token}`,
        });
        return { url, options };
    };
};
