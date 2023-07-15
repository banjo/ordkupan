import { GuessExpectedBody } from "@/app/api/guess/route";
import { PostScoreExpectedBody } from "@/app/api/score/route";
import { useSaveState } from "@/hooks/useSaveState";
import { useSingletonInputFocus } from "@/hooks/useSingletonInputFocus";
import { useConfettiStore } from "@/stores/useConfettiStore";
import { useGameStore } from "@/stores/useGameStore";
import { useSocialStore } from "@/stores/useSocialStore";
import { BasicComboWithWords } from "@/types/types";
import { uniq } from "@banjoanton/utils";
import ky from "ky";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import toast from "react-hot-toast";

type Out = {
    isLoading: boolean;
    fadeOut: boolean;
    setFadeOut: Dispatch<SetStateAction<boolean>>;
    submitWord: () => Promise<boolean>;
};

type In = {
    combo: BasicComboWithWords;
    localStorageKey: string;
};

const postScore = async (body: PostScoreExpectedBody) => {
    await ky
        .post("/api/score", {
            body: JSON.stringify(body),
        })
        .catch(error => {
            console.log(error);
        });
};

const postGuess = async (body: GuessExpectedBody) => {
    await ky
        .post("/api/guess", {
            body: JSON.stringify(body),
        })
        .catch(error => {
            console.log(error);
        });
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
    const { id } = useSocialStore();
    const [fadeOut, setFadeOut] = useState(false);
    const { isLoading } = useSaveState({ combo, localStorageKey });

    useEffect(() => {
        if (score === combo.maxScore) {
            setIsFinished(true);
        }
    }, [combo.maxScore, score, setIsFinished]);

    // update score on mount
    useEffect(() => {
        if (!id || matchedWords.length === 0) return;

        const post = async () => {
            await postScore({
                matchedWords,
                score,
                maxScore: combo.maxScore,
                userUniqueIdentifier: id,
            });
        };

        post();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const triggerWrongGuess = () => {
        setIsWrongGuess(true);
        setTimeout(() => {
            setIsWrongGuess(false);
            setWord("");
        }, 500);
    };

    // eslint-disable-next-line require-await
    const submitWord = async () => {
        const submittedWord = combo.words.find(w => w.word === word);
        focus();

        if (word.length === 0) {
            triggerWrongGuess();
            return false;
        }

        if (id) {
            setTimeout(async () => {
                await postGuess({ word, userUniqueIdentifier: id });
            }, 0);
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

        if (id) {
            const body: PostScoreExpectedBody = {
                matchedWords: newMatchedWords,
                score: newScore,
                maxScore: combo.maxScore,
                userUniqueIdentifier: id,
            };

            setTimeout(async () => {
                await postScore(body);
            }, 0);
        }

        toast.success(`+${submittedWord.score}`, {
            position: "bottom-center",
        });

        return true;
    };

    return {
        fadeOut,
        isLoading,
        setFadeOut,
        submitWord,
    };
};
