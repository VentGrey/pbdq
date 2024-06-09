import { assertEquals } from "jsr:@std/assert";
import { load } from "jsr:@std/dotenv";

import Client from "pocketbase";
import PocketBase from "pocketbase";

await load({
    export: true,
    allowEmptyValues: false,
    envPath: "./.env",
});

/** @type {string | undefined} */
const pocketbase_user = Deno.env.get(
    "POCKETBASE_USER_EMAIL",
);

/** @type {string | undefined} */
const pocketbase_password = Deno.env.get(
    "POCKETBASE_USER_SECRET",
);

if (!pocketbase_user || !pocketbase_password) {
    throw new Error(
        "POCKETBASE_USER_EMAIL and POCKETBASE_USER_SECRET must be set in the\
.env file when running tests. Make sure your local pocketbase instance\
is running and then set your variables properly.",
    );
}

// Save the testing PocketBase instance details

// Use a local pocketbase instance

/** @type {Client} */
const pb = new PocketBase("http://127.0.0.1:8090");

// Test authentication
Deno.test({
    name: "Test authentication (JS-SDK)",
    fn: async () => {
        // deno-lint-ignore no-console
        console.log(`==== Auth Store initial state ====`);

        // deno-lint-ignore no-console
        console.log(pb.authStore);
        await pb.collection("users").authWithPassword(
            pocketbase_user,
            pocketbase_password,
        );

        // deno-lint-ignore no-console
        console.log(`Authenticating as ${pocketbase_user}`);

        assertEquals(pb.authStore.isValid, true);

        // deno-lint-ignore no-console
        console.log(`==== Auth Store final state ====`);
        // deno-lint-ignore no-console
        console.log(pb.authStore);
    },
});

Deno.bench("Test authentication (JS-SDK)", async () => {
    await pb.collection("users").authWithPassword(
        pocketbase_user,
        pocketbase_password,
    );
});
