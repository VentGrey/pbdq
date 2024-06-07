import { assertEquals } from "@std/assert";

import { load } from "jsr:@std/dotenv";

import Client from "pocketbase";
import PocketBase from "pocketbase";

await load({
    export: true,
    allowEmptyValues: false
});

const pb: Client = new PocketBase();