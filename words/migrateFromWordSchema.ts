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
    });

    const parsed = combos.map(combo => {
        return {
            ...combo,
            otherLetters: JSON.parse(combo.otherLetters as string),
        };
    });

    let index = 0;
    let output = "";
    for await (const combo of parsed) {
        console.log(`updating combo ${index++} out of ${parsed.length}`);

        output += `UPDATE public."Combo" SET "allWords"='${JSON.stringify(
            combo.words.map(word => {
                return {
                    score: word.score,
                    word: word.word,
                };
            })
        )}' ::jsonb WHERE id=${combo.id};\n`;

        // await prisma.combo.update({
        //     where: {
        //         id: combo.id,
        //     },
        //     data: {
        //         allWords: JSON.stringify(
        //             combo.words.map(word => {
        //                 return {
        //                     score: word.score,
        //                     word: word.word,
        //                 };
        //             })
        //         ),
        //     },
        // });
    }

    fs.writeFileSync("./updateComboWords.sql", output);
};

main();
