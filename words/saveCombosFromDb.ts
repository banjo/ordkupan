import { PrismaClient } from "@prisma/client";
import fs from "node:fs";
const prisma = new PrismaClient();

const main = async () => {
    const combos = await prisma.combo.findMany({
        include: {
            words: {
                select: {
                    score: true,
                    word: true,
                },
            },
        },
        orderBy: {
            id: "asc",
        },
        take: 1000,
    });

    const parsed = combos.map(combo => {
        return {
            ...combo,
            otherLetters: JSON.parse(combo.otherLetters as string),
        };
    });

    fs.writeFileSync("./words/data/combos.json", JSON.stringify(parsed, null, 4));
};

main();
