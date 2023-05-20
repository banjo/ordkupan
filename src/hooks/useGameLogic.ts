import { Dispatch, SetStateAction, useState } from "react";
import toast from "react-hot-toast";
import { Combo } from "../types/types";
import { useSaveState } from "./useSaveState";

type Out = {
    isLoading: boolean;
    fadeOut: boolean;
    word: string;
    score: number;
    matchedWords: string[];
    otherLetters: string[];
    setFadeOut: Dispatch<SetStateAction<boolean>>;
    setOtherLetters: Dispatch<SetStateAction<string[]>>;
    setWord: Dispatch<SetStateAction<string>>;
    submitWord: () => void;
};

type In = {
    combo: Combo;
    setShowConfetti: Dispatch<SetStateAction<boolean>>;
};

export const useGameLogic = ({ combo, setShowConfetti }: In): Out => {
    const [word, setWord] = useState("");
    const [score, setScore] = useState(0);
    const [matchedWords, setMatchedWords] = useState<string[]>([]);
    const [otherLetters, setOtherLetters] = useState<string[]>(combo.otherLetters);
    const [fadeOut, setFadeOut] = useState(false);
    const {
        isLoading,
        updateLocalStorage,
        value: localStorageValue,
    } = useSaveState({ setScore, setMatchedWords, words: combo.words });

    const submitWord = () => {
        const submittedWord = combo.words.find(w => w.word === word);
        setWord("");
        focus();

        if (word.length === 0) {
            return;
        }

        if (word.length < 4) {
            toast.error("För kort ord", {
                icon: "😞",
            });
            return;
        }

        if (!submittedWord && !word.includes(combo.mainLetter)) {
            toast.error(`Måste innehålla bokstaven "${combo.mainLetter.toUpperCase()}"`, {
                icon: "🤔",
            });
            return;
        }

        if (!submittedWord) {
            toast.error("Inte ett giltigt ord", {
                icon: "😞",
            });
            console.log("Word not found");
            return;
        }

        if (matchedWords.includes(submittedWord.word)) {
            toast.error("Redan använt", {
                icon: "😲",
            });
            console.log("Word already matched");
            return;
        }

        if (submittedWord.score > 5) {
            toast.success("Full pott!", {
                icon: "🤩",
            });
        } else if (submittedWord.score > 3) {
            toast.success("Bra jobbat!", {
                icon: "😎",
            });
        }

        setShowConfetti(true);
        const newMatchedWords = [...matchedWords, submittedWord.word];
        const newScore = score + submittedWord.score;

        updateLocalStorage({
            date: new Date().toLocaleDateString("sv-SE", {
                timeZone: "Europe/Stockholm",
            }),
            streak: localStorageValue?.streak ?? 0,
            score: newScore,
            matchedWords: newMatchedWords,
        });

        setMatchedWords(newMatchedWords);
        setScore(newScore);
    };

    return {
        fadeOut,
        isLoading,
        matchedWords,
        otherLetters,
        score,
        word,
        setFadeOut,
        setOtherLetters,
        setWord,
        submitWord,
    };
};
