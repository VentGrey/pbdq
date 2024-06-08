import { assertEquals } from "@std/assert";
import { load } from "jsr:@std/dotenv";

import Client from "pocketbase";
import PocketBase from "pocketbase";

await load({
    export: true,
    allowEmptyValues: false,
});

// Save the testing PocketBase instance details

// Use a local pocketbase instance
const pb: Client = new PocketBase("http://127.0.0.1:8090");
