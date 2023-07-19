import { BasicComboWithWords } from "@/types/types";
import { create } from "zustand";

type ComboStore = {
    combo: BasicComboWithWords;
    setCombo: (combo: BasicComboWithWords) => void;
};
export const useComboStore = create<ComboStore>(set => ({
    combo: {
        letters: [],
        otherLetters: [],
        words: [],
        mainLetter: "",
        maxScore: 0,
    },
    setCombo: (combo: BasicComboWithWords) => set({ combo }),
}));
