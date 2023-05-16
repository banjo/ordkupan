export type Combo = {
    mainLetter: string;
    otherLetters: string[];
    words: {
        word: string;
        score: number;
    }[];
    maxScore: number;
};

export type ComboFromDb = {
    id: number;
    mainLetter: string;
    otherLetters: string;
    words: string;
    maxScore: number;
};
