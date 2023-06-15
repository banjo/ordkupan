import { shuffle } from "@banjoanton/utils";
import { create } from "zustand";

type GameStore = {
    isWrongGuess: boolean;
    setIsWrongGuess: (isWrongGuess: boolean) => void;
    isFinished: boolean;
    setIsFinished: (isFinished: boolean) => void;
    otherLetters: string[];
    shuffleOtherLetters: () => void;
    setOtherLetters: (otherLetters: string[]) => void;
    matchedWords: string[];
    setMatchedWords: (matchedWords: string[]) => void;
    score: number;
    setScore: (score: number) => void;
    word: string;
    setWord: (word: string) => void;
    appendLetter: (letter: string) => void;
};
export const useGameStore = create<GameStore>(set => ({
    isWrongGuess: false,
    setIsWrongGuess: (isWrongGuess: boolean) => set({ isWrongGuess }),
    isFinished: false,
    setIsFinished: (isFinished: boolean) => set({ isFinished }),
    otherLetters: [],
    shuffleOtherLetters: () => set(state => ({ otherLetters: shuffle(state.otherLetters) })),
    setOtherLetters: (otherLetters: string[]) => set({ otherLetters }),
    matchedWords: [],
    setMatchedWords: (matchedWords: string[]) => set({ matchedWords }),
    score: 0,
    setScore: (score: number) => set({ score }),
    word: "",
    setWord: (word: string) => set({ word }),
    appendLetter: (letter: string) =>
        set(state => ({ word: `${state.word}${letter}`.toLowerCase() })),
}));
