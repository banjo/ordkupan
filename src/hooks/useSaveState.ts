import { Dispatch, SetStateAction, useCallback, useEffect, useState } from "react";
import { useLocalStorage } from "react-use";

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
};

export const useSaveState = ({ setScore, setMatchedWords }: In): Out => {
    const [localStorageValue, setLocalStorageValue] = useLocalStorage<LocalStorageState | null>(
        LOCAL_STORAGE_KEY,
        null
    );
    const [isLoading, setIsLoading] = useState(true);

    const updateLocalStorage = useCallback(
        ({ score, matchedWords, streak, date }: UpdateLocalStorageProps) => {
            setLocalStorageValue({
                date: date ?? localStorageValue?.date ?? new Date().toDateString(),
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
            date: new Date().toDateString(),
            score: 0,
            matchedWords: [],
            streak: 0,
        });
    }, [setLocalStorageValue]);

    useEffect(() => {
        if (!localStorageValue) {
            resetLocalStorage();
            setIsLoading(false);
            return;
        }

        const isSameDay = localStorageValue.date === new Date().toDateString();

        if (isSameDay) {
            setScore(localStorageValue.score);
            setMatchedWords(localStorageValue.matchedWords);
            setIsLoading(false);
            return;
        }

        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);

        const isDayAfter = localStorageValue.date === yesterday.toDateString();
        const hasScore = localStorageValue.score > 0;

        if (!isDayAfter || !hasScore) {
            resetLocalStorage();
            setIsLoading(false);
            return;
        }

        const streak = localStorageValue.streak + 1;

        updateLocalStorage({
            streak,
            date: new Date().toDateString(),
            matchedWords: [],
            score: 0,
        });

        setIsLoading(false);
    }, [
        localStorageValue,
        setLocalStorageValue,
        setScore,
        setMatchedWords,
        updateLocalStorage,
        resetLocalStorage,
    ]);

    return {
        isLoading,
        updateLocalStorage,
        value: localStorageValue,
    };
};
