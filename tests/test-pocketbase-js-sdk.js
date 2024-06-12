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

Deno.bench("Test authentication (JS-SDK)", async () => {
    await pb.collection("users").authWithPassword(
        pocketbase_user,
        pocketbase_password,
    );
});

Deno.bench(
    "Test all CRUD operations on the Cats collection (JS-SDK)",
    async () => {
        const newCat = {
            "Name": "Gato",
            "Age": 2,
            "Color": "Ermac",
            "Breed": "Psycho Orange Cat",
        };

        /** @type {import("pocketbase").RecordModel} */
        const result = await pb.collection("Cats").create(newCat).then(
            (result) => result,
        ).catch(
            (error) => {
                throw error;
            },
        );

        /** @type {string} */
        const newCatID = result.id;

        await pb.collection("Cats").getFullList().then(
            (result) => result,
        ).catch(
            (error) => {
                throw error;
            },
        );

        await pb.collection("Cats").getOne(newCatID).then(
            (result) => result,
        ).catch(
            (error) => {
                throw error;
            },
        );

        await pb.collection("Cats").update(newCatID, {
            name: "Erina Pendleton",
            age: 2,
            color: "brown",
            breed: "Domestic Short Hair",
        }).then(
            (result) => result,
        ).catch(
            (error) => {
                throw error;
            },
        );

        await pb.collection("Cats").delete(newCatID);
    },
);

Deno.bench("Test Auth Clear (JS-SDK)", () => {
    pb.authStore.clear();
});
