import { uniq } from "@banjoanton/utils";
import ky from "ky";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { PostScoreExpectedBody } from "../app/api/score/route";
import { useConfettiStore } from "../stores/useConfettiStore";
import { useGameStore } from "../stores/useGameStore";
import { BasicComboWithWords } from "../types/types";
import { useSaveState } from "./useSaveState";
import { useSingletonInputFocus } from "./useSingletonInputFocus";

type Out = {
    isLoading: boolean;
    fadeOut: boolean;
    showFinalCelebration: boolean;
    setFadeOut: Dispatch<SetStateAction<boolean>>;
    submitWord: () => Promise<boolean>;
};

type In = {
    combo: BasicComboWithWords;
    localStorageKey: string;
};

export const useGameLogic = ({ combo, localStorageKey }: In): Out => {
    const { focus } = useSingletonInputFocus();
    const {
        setWord,
        word,
        score,
        setScore,
        matchedWords,
        setMatchedWords,
        setIsWrongGuess,
        setIsFinished,
    } = useGameStore();
    const { setShowConfetti } = useConfettiStore();
    const [fadeOut, setFadeOut] = useState(false);
    const [showFinalCelebration, setShowFinalCelebration] = useState(false);
    const { isLoading, value: localStorageValue } = useSaveState({ combo, localStorageKey });

    useEffect(() => {
        if (score === combo.maxScore) {
            setIsFinished(true);
        }
    }, [combo.maxScore, score, setIsFinished]);

    const triggerWrongGuess = () => {
        setIsWrongGuess(true);
        setTimeout(() => {
            setIsWrongGuess(false);
            setWord("");
        }, 500);
    };

    const submitWord = async () => {
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
        const newScore = score + submittedWord.score;
        const newMatchedWords = [...matchedWords, submittedWord.word];

        setMatchedWords(newMatchedWords);
        setScore(newScore);

        if (localStorageValue?.id) {
            const body: PostScoreExpectedBody = {
                matchedWords: newMatchedWords,
                score: newScore,
                maxScore: combo.maxScore,
                userUniqueIdentifier: localStorageValue.id,
            };

            await ky
                .post("/api/score", {
                    body: JSON.stringify(body),
                })
                .catch(error => {
                    console.log(error);
                });
        }

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
        showFinalCelebration,
        setFadeOut,
        submitWord,
    };
};
