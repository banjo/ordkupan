#!/usr/bin/env zx
/* eslint-disable unicorn/no-abusive-eslint-disable */
/* eslint-disable */
import "zx/globals";
$.verbose = true;

const currentDate = new Date().toISOString().split("T")[0];

echo`Copying database from server...`;
await $`scp root@91.107.197.143:/root/db-backups/ordkupan_backup_${currentDate}.sql .`;

echo`Restoring database...`;
await $`nr db:local:reset`;
await $`PGPASSWORD=postgres psql -U ordkupan -h localhost -p 5432 -d postgres -c "SELECT pg_terminate_backend(pid) FROM pg_stat_activity WHERE pid <> pg_backend_pid() AND datname = 'ordkupan';" -c "DROP DATABASE ordkupan;" -c "CREATE DATABASE ordkupan;"`;

echo`Importing database...`;
await $`PGPASSWORD=postgres psql -U ordkupan -d ordkupan -h localhost -p 5432 -f ./ordkupan_backup_${currentDate}.sql`;

echo`Cleaning up...`;
await $`rm ./ordkupan_backup_${currentDate}.sql`;
