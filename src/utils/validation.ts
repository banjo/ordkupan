import { BasicWord } from "@/types/types";

export const validate = ({
    matchedWords,
    allWords,
    score,
    maxScore,
}: {
    matchedWords: string[];
    allWords: BasicWord[];
    score: number;
    maxScore: number;
}) => {
    debugger;
    const uniqueMatchedWords = [...new Set(matchedWords)];

    if (uniqueMatchedWords.length !== matchedWords.length) {
        return false;
    }

    const allWordsValid = matchedWords.every(matchedWord => {
        return allWords.some(word => word.word === matchedWord);
    });

    if (!allWordsValid) {
        return false;
    }

    // eslint-disable-next-line unicorn/no-array-reduce
    const scoreForAllWords = matchedWords.reduce((acc, matchedWord) => {
        const word = allWords.find(w => w.word === matchedWord);
        return acc + (word?.score ?? 0);
    }, 0);

    if (score !== scoreForAllWords) {
        return false;
    }

    // const totalScorePossible = allWords.reduce((acc, word) => acc + word.score, 0);

    // if (maxScore !== totalScorePossible) {
    //     return false;
    // }

    // if (score > maxScore) {
    //     return false;
    // }

    return true;
};
