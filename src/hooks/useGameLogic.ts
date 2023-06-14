import { uniq } from "@banjoanton/utils";
import ky from "ky";
import { Dispatch, SetStateAction, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { PostFriendNameBody, PostFriendNameResponse } from "../app/api/friends/name/route";
import { PostScoreExpectedBody } from "../app/api/score/route";
import { PostUserResponse } from "../app/api/user/route";
import { BasicComboWithWords } from "../types/types";
import { useSaveState } from "./useSaveState";
import { useSingletonInputFocus } from "./useSingletonInputFocus";

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
    name: string;
    friends: string[];
    id?: string;
    setFadeOut: Dispatch<SetStateAction<boolean>>;
    setOtherLetters: Dispatch<SetStateAction<string[]>>;
    setWord: Dispatch<SetStateAction<string>>;
    submitWord: () => Promise<boolean>;
    addFriend: (friend: string) => Promise<string[]>;
    createUser: (name: string) => Promise<boolean>;
};

type In = {
    combo: BasicComboWithWords;
    setShowConfetti: Dispatch<SetStateAction<boolean>>;
    localStorageKey: string;
};

export const useGameLogic = ({ combo, setShowConfetti, localStorageKey }: In): Out => {
    const { focus } = useSingletonInputFocus();
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

    const addFriend = async (friend: string) => {
        try {
            const body: PostFriendNameBody = {
                name: friend,
            };
            const res: PostFriendNameResponse = await ky
                .post(`/api/friends/name`, {
                    body: JSON.stringify(body),
                })
                .json();

            if (!res.publicIdentifier) {
                toast.error("Kunde inte hitta användaren 😔");
                return localStorageValue?.friends ?? [];
            }

            const newFriends = [...(localStorageValue?.friends ?? []), res.publicIdentifier];
            updateLocalStorage({
                friends: newFriends,
            });

            toast.success("Vän tillagd! 🧑‍🤝‍🧑");
            return newFriends;
        } catch (error) {
            console.log(error);
            toast.error("Kunde inte hitta användaren 😔");
            return localStorageValue?.friends ?? [];
        }
    };

    const createUser = async (name: string): Promise<boolean> => {
        const body = {
            name,
        };

        try {
            const response = await ky.post("/api/user", {
                body: JSON.stringify(body),
            });

            const data: PostUserResponse = await response.json();

            updateLocalStorage({
                id: data.uniqueIdentifier,
                name,
            });

            return true;
        } catch (error) {
            console.log(error);
            return false;
        }
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
        friends: localStorageValue?.friends ?? [],
        id: localStorageValue?.id,
        name: localStorageValue?.name ?? "",
        setFadeOut,
        setOtherLetters,
        setWord,
        submitWord,
        addFriend,
        createUser,
    };
};
