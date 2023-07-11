// this function caused a bug:
// const isUnique = uniq([...word]).length === word.length;

// It should be equals to 7, not the length of the word. This means there are some letters that are repeated in the word, but the word is still 7 letters or more. This is the case for the word "squeezed", which has 3 e's, but is still 7 letters long.
// I need to find all those words in the database, and fix them. I can do this by finding all the words that have a length of 7 or more, and then checking if they have any repeated letters. If they do, I can fix them by removing the repeated letters.

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

    // const updatedWords = faultyWords.map(word => {
    //     const updatedScore = getScore(word.word);

    //     return {
    //         ...word,
    //         score: updatedScore,
    //     };
    // });

    // console.log("Updating words...");

    // const batchSize = 100;

    // const batches = updatedWords.reduce((acc, word, i) => {
    //     const batchIndex = Math.floor(i / batchSize);

    //     if (!acc[batchIndex]) {
    //         acc[batchIndex] = [];
    //     }

    //     acc[batchIndex].push(word);

    //     return acc;
    // }, [] as Word[][]);

    // let batchIndex = 0;
    // for (const batch of batches) {
    //     console.log(`Updating batch ${batchIndex + 1} of ${batches.length}`);
    //     await prisma.$transaction(
    //         batch.map(word => {
    //             return prisma.word.update({
    //                 where: {
    //                     id: word.id,
    //                 },
    //                 data: {
    //                     score: word.score,
    //                 },
    //             });
    //         })
    //     );
    //     batchIndex++;
    // }

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
