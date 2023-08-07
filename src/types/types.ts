import { Combo, Word } from "@prisma/client";

export type BasicWord = Omit<Word, "id" | "comboId">;
export type BasicCombo = Omit<Combo, "id" | "otherLetters" | "allWords"> & {
    otherLetters: string[];
    allWords: BasicWord[];
};

export type PublicScore = {
    score: number;
    name: string;
    publicIdentifier: string;
};

export type FetchScoreResponse = {
    score: PublicScore[];
    maxScore: number;
};
