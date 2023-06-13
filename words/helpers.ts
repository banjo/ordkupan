import * as fs from "node:fs";

export function importJsonFile(filePath: string) {
    const file = fs.readFileSync(filePath, "utf8");
    const parsed = JSON.parse(file);
    return parsed;
}

export function exportJsonFile(filePath: string, data: any) {
    const stringified = JSON.stringify(data, null, 2);
    fs.writeFileSync(filePath, stringified);
}
