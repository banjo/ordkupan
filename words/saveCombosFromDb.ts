import { BasicWord } from "@/types/types";
import { PrismaClient } from "@prisma/client";
import fs from "node:fs";
const prisma = new PrismaClient();

const main = async () => {
    const combos = await prisma.combo.findMany({
        orderBy: {
            id: "asc",
        },
        take: 1000,
    });

    const parsed = combos.map(combo => {
        const allWords = combo.allWords as BasicWord[];

        return {
            ...combo,
            words: undefined,
            otherLetters: JSON.parse(combo.otherLetters as string),
            allWords: allWords,
        };
    });

    fs.writeFileSync("./words/data/combos.json", JSON.stringify(parsed, null, 4));
};

main();
