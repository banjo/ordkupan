import { create } from "zustand";

type ThesaurusModalStore = {
    show: boolean;
    setShow: (show: boolean) => void;
    word: string | null;
    setWord: (word: string | null) => void;
};
export const useThesaurusModalStore = create<ThesaurusModalStore>(set => ({
    show: false,
    setShow: (show: boolean) => set({ show }),
    word: "",
    setWord: (word: string | null) => set({ word }),
}));
