import { create } from "zustand";

type GameStore = {
    matchedWords: string[];
    setMatchedWords: (matchedWords: string[]) => void;
    score: number;
    setScore: (score: number) => void;
    word: string;
    setWord: (word: string) => void;
    appendLetter: (letter: string) => void;
};
export const useGameStore = create<GameStore>(set => ({
    matchedWords: [],
    setMatchedWords: (matchedWords: string[]) => set({ matchedWords }),
    score: 0,
    setScore: (score: number) => set({ score }),
    word: "",
    setWord: (word: string) => set({ word }),
    appendLetter: (letter: string) =>
        set(state => ({ word: `${state.word}${letter}`.toLowerCase() })),
}));
