export type Combo = {
    mainLetter: string;
    otherLetters: string[];
    words: {
        word: string;
        score: number;
    }[];
    maxScore: number;
};
