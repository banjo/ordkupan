import { sample, shuffle, uniq } from "@banjoanton/utils";
import { Combo } from "../src/types/types";
import { exportJsonFile, importJsonFile } from "./helpers";

const main = () => {
    const arrayOfWords = importJsonFile("./words/data/words.json");
    const arrayOfCombos = createCombos(arrayOfWords);
    const shuffled = shuffle(arrayOfCombos);
    exportJsonFile("./words/data/combos.json", shuffled);
};

function createCombos(allWords: string[]) {
    const wordsWithSevenDifferentLetters = allWords.filter(word => {
        const letters = [...word];
        const uniqueLetters = uniq(letters);
        return uniqueLetters.length === 7;
    });

    const combos = wordsWithSevenDifferentLetters.map((word, index) => {
        console.log(`Word ${index + 1}/${wordsWithSevenDifferentLetters.length}:`, word);

        const letters = [...word];
        const mainLetter = sample(letters);
        const otherLetters = uniq(letters.filter(letter => letter !== mainLetter));

        const validWords = allWords.filter(w => {
            if (!w.includes(mainLetter)) {
                return false;
            }

            const wordLetters = [...w];

            for (const letter of wordLetters) {
                if (!letters.includes(letter)) {
                    return false;
                }
            }

            return true;
        });

        const combo: Combo = {
            mainLetter,
            otherLetters,
            words: validWords.map(w => ({
                word: w,
                score: getScore(w),
            })),
            // eslint-disable-next-line unicorn/no-array-reduce
            maxScore: validWords.reduce((acc, w) => {
                const score = getScore(w);
                return acc + score;
            }, 0),
        };

        return combo;
    });

    return combos;
}

function getScore(word: string) {
    let score = word.length - 3;

    if (score < 0) {
        return 0;
    }

    const isSevenLettersOrMore = word.length >= 7;
    const isUnique = uniq([...word]).length === word.length;

    if (isSevenLettersOrMore && isUnique) {
        score += 7;
    }

    return score;
}

main();
