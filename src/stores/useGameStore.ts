import { create } from "zustand";

type GameStore = {
    word: string;
    setWord: (word: string) => void;
    appendLetter: (letter: string) => void;
};
export const useGameStore = create<GameStore>(set => ({
    word: "",
    setWord: (word: string) => set({ word }),
    appendLetter: (letter: string) =>
        set(state => ({ word: `${state.word}${letter}`.toLowerCase() })),
}));
