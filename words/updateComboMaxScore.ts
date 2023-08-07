import { BasicWord } from "@/types/types";
import { PrismaClient } from "@prisma/client";
import fs from "node:fs";
const prisma = new PrismaClient();

const main = async () => {
    const allCombos = await prisma.combo.findMany({});

    const comboWithWrongMaxScore = allCombos.filter(combo => {
        const allWords = combo.allWords as BasicWord[];
        const maxScore = allWords.reduce((acc, word) => acc + word.score, 0);

        return maxScore !== combo.maxScore;
    });

    const output = comboWithWrongMaxScore.map(combo => {
        const allWords = combo.allWords as BasicWord[];

        const maxScore = allWords.reduce((acc, word) => acc + word.score, 0);

        return `UPDATE public."Combo" SET "maxScore"=${maxScore} WHERE id=${combo.id};`;
    });

    fs.writeFileSync("./updateComboMaxScore.sql", output.join("\n"));
};

main();
