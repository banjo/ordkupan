/* eslint-disable promise/catch-or-return */
/* eslint-disable unicorn/prefer-top-level-await */
import { Combo, PrismaClient } from "@prisma/client";
import { BasicComboWithWords, BasicWord } from "../src/types/types";
import combos from "../words/data/combos.json" assert { type: "json" };

const prisma = new PrismaClient();

const COMBOS = combos as BasicComboWithWords[];

export type SeedCombo = Omit<Combo, "otherLetters"> & {
    otherLetters: string[];
};
export type SeedComboWithWords = SeedCombo & {
    words: BasicWord[];
};

async function main() {
    const combosWithId: SeedCombo[] = COMBOS.map((combo, index) => ({
        ...combo,
        words: undefined,
        id: index + 1,
    }));

    console.log("Adding combos to database");

    await prisma.combo.createMany({
        data: combosWithId.map(combo => ({
            ...combo,
            otherLetters: JSON.stringify(combo.otherLetters),
        })),
    });

    const combosWithIdAndWords: SeedComboWithWords[] = COMBOS.map((combo, index) => ({
        ...combo,
        id: index + 1,
    }));

    console.log("Adding words to database");

    await prisma.word.createMany({
        data: combosWithIdAndWords.flatMap(combo =>
            combo.words.map(word => ({ ...word, comboId: combo.id }))
        ),
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
