import { assertEquals } from "jsr:@std/assert";
import { load } from "jsr:@std/dotenv";

import Client from "pocketbase";
import PocketBase from "pocketbase";

import Pbd from "../mod.ts";

await load({
    export: true,
    allowEmptyValues: false,
    envPath: "./.env",
});

interface CatCreate {
    Name: string;
    Age: number;
    Color: string;
    Breed: string;
}

interface Cat extends CatCreate {
    id: string;
    collectionId: string;
    collectionName: string;
    created: string;
    updated: string;
}

const pocketbase_user: string | undefined = Deno.env.get(
    "POCKETBASE_USER_EMAIL",
);
const pocketbase_password: string | undefined = Deno.env.get(
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
const pb: Client = new PocketBase("http://127.0.0.1:8090");
const pbd: Pbd = new Pbd({ client: pb });

// Test authentication
Deno.test({
    name: "Test authentication",
    fn: async () => {
        await pbd.authWithPassword({
            collectionName: "users",
            userOrEmail: pocketbase_user,
            password: pocketbase_password,
        });

        // deno-lint-ignore no-console
        console.log(`Authenticating as ${pocketbase_user}`);

        assertEquals(pb.authStore.isValid, true, "AuthStore should be valid");

        // deno-lint-ignore no-console
        console.log(
            `Authenticated as: ${pb.authStore.model?.username} / ${pb.authStore.model?.name} / ${pb.authStore.model?.email}`,
        );
    },
});

Deno.test({
    name: "Test all CRUD operations on the Cats collection",
    fn: async () => {
        // Create a new cat
        const newCat: CatCreate = {
            "Name": "Gato",
            "Age": 2,
            "Color": "Ermac",
            "Breed": "Psycho Orange Cat",
        };

        const result: Cat | null = await pbd.create<Cat>(
            { collectionName: "Cats" },
            newCat,
        );

        if (!result) {
            throw new Error("Failed to create new cat");
        }

        assertEquals(
            result.Name,
            newCat.Name,
            "Cat name should be ${newCat.Name}",
        );
        // deno-lint-ignore no-console
        console.log(
            `Created new cat: ${result.Name} / ${result.Age} / ${result.Color} / ${result.Breed}`,
        );

        const newCatID: string = result.id;

        // List all cats
        const cats: Cat[] | null = await pbd.getFullList<Cat>({
            collectionName: "Cats",
        });
        assertEquals(Array.isArray(cats), true, "Cats should be an array");

        // Get a single cat
        const cat: Cat | null = await pbd.getOne<Cat>(newCatID, {
            collectionName: "Cats",
        });

        if (!cat) throw new Error("Failed to get cat");

        assertEquals(
            cat.Name,
            newCat.Name,
            "Cat name should be ${newCat.Name}",
        );
        // deno-lint-ignore no-console
        console.log(
            `Successfully got a single cat: ${cat.Name} / ${cat.Age} / ${cat.Color} / ${cat.Breed}`,
        );

        // Update the cat name
        const updatedCat: Cat | null = await pbd.update<Cat>(newCatID, {
            collectionName: "Cats",
        }, {
            "Name": "Erina Pendleton",
        });

        if (!updatedCat) throw new Error("Failed to update cat");

        assertEquals(
            updatedCat.Name,
            "Erina Pendleton",
            "Cat name should be Erina Pendleton",
        );
        // deno-lint-ignore no-console
        console.log(
            `Successfully updated cat: ${updatedCat.Name} / ${updatedCat.Age} / ${updatedCat.Color} / ${updatedCat.Breed}`,
        );

        // Delete the new "cat"
        await pbd.delete(newCatID, { collectionName: "Cats" });
        // deno-lint-ignore no-console
        console.log(
            `Successfully deleted cat: ${updatedCat.Name} / ${updatedCat.Age} / ${updatedCat.Color} / ${updatedCat.Breed}`,
        );
    },
});

Deno.test({
    name: "Test Auth Clear",
    fn: () => {
        pbd.authClear();
        assertEquals(
            pb.authStore.isValid,
            false,
            "AuthStore should be invalid",
        );
    },
});

Deno.bench("Test authentication (PBDQ)", async () => {
    await pbd.authWithPassword({
        collectionName: "users",
        userOrEmail: pocketbase_user,
        password: pocketbase_password,
    });
});

Deno.bench(
    "Test all CRUD operations on the Cats collection (PBDQ)",
    async () => {
        // Create a new cat
        const newCat: CatCreate = {
            "Name": "Gato",
            "Age": 2,
            "Color": "Ermac",
            "Breed": "Psycho Orange Cat",
        };

        const result: Cat | null = await pbd.create<Cat>(
            { collectionName: "Cats" },
            newCat,
        );

        if (!result) throw new Error("Failed to create new cat");

        const newCatID: string = result.id;

        // List all cats
        await pbd.getFullList<Cat>({
            collectionName: "Cats",
        });

        // Get a single cat
        await pbd.getOne<Cat>(newCatID, {
            collectionName: "Cats",
        });

        // Update the cat name
        await pbd.update<Cat>(newCatID, {
            collectionName: "Cats",
        }, {
            "Name": "Erina Pendleton",
        });

        // Delete the new "cat"
        await pbd.delete(newCatID, { collectionName: "Cats" });
    },
);

Deno.bench("Test Auth Clear (PBDQ)", () => {
    pbd.authClear();
});
