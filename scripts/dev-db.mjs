#!/usr/bin/env zx
/* eslint-disable unicorn/no-abusive-eslint-disable */
/* eslint-disable */
import "dotenv/config";
import "zx/globals";

const env = $.env;
const DATABASE_SECTION = "banjoanton";
const command = process.argv.slice(3);

if (env?.DATABASE_URL.includes(DATABASE_SECTION)) {
    console.log("You are trying to modify the production database. Aborting.");
    process.exit(1);
}

await $`${command}`;
