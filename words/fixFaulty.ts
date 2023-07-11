import { uniq } from "@banjoanton/utils";
import { PrismaClient, Word } from "@prisma/client";
import fs from "node:fs";
const prisma = new PrismaClient();

async function main() {
    const words: Word[] = await prisma.$queryRaw`SELECT * FROM "Word" WHERE LENGTH(word) >= 7`;

    console.log("Started...");

    const wordsLongerThanSevenLettersWithAllUniqueLetters = words.filter(word => {
        const letters = [...word.word];

        const uniqueLetters = [...new Set(letters)];

        return uniqueLetters.length === 7;
    });

    const faultyWords = wordsLongerThanSevenLettersWithAllUniqueLetters.filter(word => {
        const updatedScore = getScore(word.word);

        return updatedScore !== word.score;
    });

    console.log("Found faulty words:", faultyWords.length);

    let output = "";
    for (const word of faultyWords) {
        output += `UPDATE "Word" SET score = ${getScore(word.word)} WHERE id = ${word.id};\n`;
    }

    fs.writeFileSync("./faultyWords.sql", output);

    console.log("Done!");
}

function getScore(word: string) {
    let score = word.length - 3;

    if (score < 0) {
        return 0;
    }

    const isSevenLettersOrMore = word.length >= 7;

    const isUnique = uniq([...word]).length === 7;

    if (isSevenLettersOrMore && isUnique) {
        score += 7;
    }

    return score;
}

main();
