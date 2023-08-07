import { BasicCombo } from "@/types/types";
import { create } from "zustand";

type ComboStore = {
    combo: BasicCombo;
    setCombo: (combo: BasicCombo) => void;
};
export const useComboStore = create<ComboStore>(set => ({
    combo: {
        otherLetters: [],
        allWords: [],
        mainLetter: "",
        maxScore: 0,
    },
    setCombo: (combo: BasicCombo) => set({ combo }),
}));
