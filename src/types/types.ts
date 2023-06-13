import { Combo, Word } from "@prisma/client";

export type BasicWord = Omit<Word, "id" | "comboId">;
export type BasicCombo = Omit<Combo, "id" | "otherLetters"> & {
    otherLetters: string[];
};

export type BasicComboWithWords = BasicCombo & {
    words: BasicWord[];
};

export type ComboWithWords = Combo & {
    words: BasicWord[];
};
