/* eslint-disable promise/catch-or-return */
/* eslint-disable unicorn/prefer-top-level-await */
import { Combo, PrismaClient } from "@prisma/client";
import { BasicCombo } from "../src/types/types";
import combos from "../words/data/combos.json" assert { type: "json" };

const prisma = new PrismaClient();

const COMBOS = combos as BasicCombo[];

export type SeedCombo = Omit<Combo, "otherLetters"> & {
    otherLetters: string;
    allWords: string;
};

async function main() {
    const combosWithIdAndWords: SeedCombo[] = COMBOS.map((combo, index) => ({
        ...combo,
        otherLetters: JSON.stringify(combo.otherLetters),
        allWords: JSON.stringify(combo.allWords),
        id: index + 1,
    }));

    console.log("Adding combos to database");

    await prisma.combo.createMany({
        data: combosWithIdAndWords.map(combo => ({
            ...combo,
        })),
    });

    console.log("Done");
}

main()
    .then(() => console.log("Seeding complete"))
    .catch(error => {
        console.error(error);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
