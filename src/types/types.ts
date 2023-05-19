export type Word = {
    word: string;
    score: number;
};

export type Combo = {
    mainLetter: string;
    otherLetters: string[];
    words: Word[];
    maxScore: number;
};

export type ComboFromDb = {
    id: number;
    mainLetter: string;
    otherLetters: string;
    words: string;
    maxScore: number;
};
