import { formatDate } from "@banjoanton/utils";
import { Dispatch, SetStateAction, useCallback, useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { useLocalStorage } from "react-use";
import { Word } from "../types/types";

const LOCAL_STORAGE_KEY = "ordkupan";

type UpdateLocalStorageProps = {
    score?: number;
    matchedWords?: string[];
    streak?: number;
    date?: string;
};

type LocalStorageState = {
    date: string;
    score: number;
    matchedWords: string[];
    streak: number;
};

type Out = {
    isLoading: boolean;
    updateLocalStorage: (props: UpdateLocalStorageProps) => void;
    value: LocalStorageState | null | undefined;
};

type In = {
    setScore: Dispatch<SetStateAction<number>>;
    setMatchedWords: Dispatch<SetStateAction<string[]>>;
    words: Word[];
};

const nowAsString = () => formatDate(new Date());

export const useSaveState = ({ setScore, setMatchedWords, words }: In): Out => {
    const [localStorageValue, setLocalStorageValue] = useLocalStorage<LocalStorageState | null>(
        LOCAL_STORAGE_KEY,
        null
    );
    const [isLoading, setIsLoading] = useState(true);

    const updateLocalStorage = useCallback(
        ({ score, matchedWords, streak, date }: UpdateLocalStorageProps) => {
            setLocalStorageValue({
                date: date ?? localStorageValue?.date ?? nowAsString(),
                streak: streak ?? localStorageValue?.streak ?? 0,
                score: score ?? localStorageValue?.score ?? 0,
                matchedWords: matchedWords ?? localStorageValue?.matchedWords ?? [],
            });
        },
        [
            localStorageValue?.date,
            localStorageValue?.matchedWords,
            localStorageValue?.score,
            localStorageValue?.streak,
            setLocalStorageValue,
        ]
    );

    const resetLocalStorage = useCallback(() => {
        setLocalStorageValue({
            date: nowAsString(),
            score: 0,
            matchedWords: [],
            streak: 0,
        });
    }, [setLocalStorageValue]);

    const validateWords = useCallback(() => {
        const matchedWords = localStorageValue?.matchedWords ?? [];

        const allWordsValid = matchedWords.every(matchedWord => {
            return words.some(word => word.word === matchedWord);
        });

        if (!allWordsValid) {
            return false;
        }

        const score = localStorageValue?.score ?? 0;
        // eslint-disable-next-line unicorn/no-array-reduce
        const scoreForAllWords = matchedWords.reduce((acc, matchedWord) => {
            const word = words.find(w => w.word === matchedWord);
            return acc + (word?.score ?? 0);
        }, 0);

        if (score !== scoreForAllWords) {
            return false;
        }

        return true;
    }, [localStorageValue?.matchedWords, localStorageValue?.score, words]);

    useEffect(() => {
        if (!localStorageValue) {
            resetLocalStorage();
            setIsLoading(false);
            return;
        }

        const isSameDay = localStorageValue.date === nowAsString();

        if (isSameDay) {
            const isValid = validateWords();
            if (!isValid) {
                toast.error("Försök inte fuska!", {
                    icon: "🤬",
                });
                resetLocalStorage();
                setIsLoading(false);
                return;
            }

            toast.success("Välkommen tillbaka!", {
                icon: "👋",
            });

            setScore(localStorageValue.score);
            setMatchedWords(localStorageValue.matchedWords);
            setIsLoading(false);
            return;
        }

        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);

        const isDayAfter = localStorageValue.date === formatDate(yesterday);
        const hasScore = localStorageValue.score > 0;

        if (!isDayAfter || !hasScore) {
            resetLocalStorage();
            setIsLoading(false);
            return;
        }

        const streak = localStorageValue.streak + 1;

        updateLocalStorage({
            streak,
            date: new Date().toLocaleDateString("sv-SE", {
                timeZone: "Europe/Stockholm",
            }),
            matchedWords: [],
            score: 0,
        });

        toast.success(`Din streak är nu ${streak} dag(ar)!`, {
            icon: "🔥",
        });

        setIsLoading(false);
    }, []);

    return {
        isLoading,
        updateLocalStorage,
        value: localStorageValue,
    };
};
