import { uniq } from "@banjoanton/utils";
import { Dispatch, SetStateAction, useMemo, useState } from "react";
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
    finished: boolean;
    showFinalCelebration: boolean;
    isWrongGuess: boolean;
    streak: number;
    setFadeOut: Dispatch<SetStateAction<boolean>>;
    setOtherLetters: Dispatch<SetStateAction<string[]>>;
    setWord: Dispatch<SetStateAction<string>>;
    submitWord: () => boolean;
};

type In = {
    combo: Combo;
    setShowConfetti: Dispatch<SetStateAction<boolean>>;
    localStorageKey: string;
    focus: () => void;
};

export const useGameLogic = ({ combo, setShowConfetti, focus, localStorageKey }: In): Out => {
    const [word, setWord] = useState("");
    const [score, setScore] = useState(0);
    const [isWrongGuess, setIsWrongGuess] = useState(false);
    const [matchedWords, setMatchedWords] = useState<string[]>([]);
    const [otherLetters, setOtherLetters] = useState<string[]>(combo.otherLetters);
    const [fadeOut, setFadeOut] = useState(false);
    const [showFinalCelebration, setShowFinalCelebration] = useState(false);
    const {
        isLoading,
        updateLocalStorage,
        value: localStorageValue,
    } = useSaveState({ setScore, setMatchedWords, words: combo.words, localStorageKey });

    const finished = useMemo(() => {
        return score === combo.maxScore;
    }, [combo.maxScore, score]);

    const triggerWrongGuess = () => {
        setIsWrongGuess(true);
        setTimeout(() => {
            setIsWrongGuess(false);
            setWord("");
        }, 500);
    };

    const submitWord = () => {
        const submittedWord = combo.words.find(w => w.word === word);
        focus();

        if (word.length === 0) {
            triggerWrongGuess();
            return false;
        }

        if (word.length < 4) {
            toast.error("För kort ord", {
                icon: "😞",
            });
            triggerWrongGuess();
            return false;
        }

        if (!submittedWord && !word.includes(combo.mainLetter)) {
            toast.error(`Måste innehålla bokstaven "${combo.mainLetter.toUpperCase()}"`, {
                icon: "🤔",
            });
            triggerWrongGuess();
            return false;
        }

        if (!submittedWord) {
            toast.error("Inte ett giltigt ord", {
                icon: "😞",
            });
            triggerWrongGuess();
            return false;
        }

        if (matchedWords.includes(submittedWord.word)) {
            toast.error("Redan använt", {
                icon: "😲",
            });
            triggerWrongGuess();
            return false;
        }

        setWord("");

        if (uniq([...submittedWord.word]).length === 7) {
            toast.success("Alla bokstäver med!", {
                icon: "🥳",
            });
        } else if (submittedWord.score > 5) {
            toast.success("Snyggt!", {
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

        toast.success(`+${submittedWord.score}`, {
            position: "bottom-center",
        });

        if (newScore === combo.maxScore) {
            setShowFinalCelebration(true);

            setTimeout(() => {
                setShowFinalCelebration(false);
            }, 2000);
        }

        return true;
    };

    return {
        fadeOut,
        isLoading,
        matchedWords,
        otherLetters,
        score,
        word,
        finished,
        showFinalCelebration,
        isWrongGuess,
        streak: localStorageValue?.streak ?? 0,
        setFadeOut,
        setOtherLetters,
        setWord,
        submitWord,
    };
};
