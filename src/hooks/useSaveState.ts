import { formatDate } from "@banjoanton/utils";
import { useCallback, useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { useLocalStorage } from "react-use";
import { useGameStore } from "../stores/useGameStore";
import { useSocialStore } from "../stores/useSocialStore";
import { BasicWord } from "../types/types";
import { validate } from "../utils/validation";

type LocalStorageState = {
    date: string;
    score: number;
    matchedWords: string[];
    streak: number;
    friends: string[];
    name: string;
    id?: string;
};

type UpdateLocalStorageProps = Partial<LocalStorageState>;

type Out = {
    isLoading: boolean;
    updateLocalStorage: (props: UpdateLocalStorageProps) => void;
    value: LocalStorageState | null | undefined;
};

type In = {
    words: BasicWord[];
    localStorageKey: string;
};

const nowAsString = () => formatDate(new Date());

export const useSaveState = ({ words, localStorageKey }: In): Out => {
    const [localStorageValue, setLocalStorageValue] = useLocalStorage<LocalStorageState | null>(
        localStorageKey,
        null
    );
    const [isLoading, setIsLoading] = useState(true);
    const { setScore, setMatchedWords } = useGameStore();

    const updateLocalStorage = useCallback(
        ({ score, matchedWords, streak, date, name, friends, id }: UpdateLocalStorageProps) => {
            setLocalStorageValue({
                date: date ?? localStorageValue?.date ?? nowAsString(),
                streak: streak ?? localStorageValue?.streak ?? 0,
                score: score ?? localStorageValue?.score ?? 0,
                matchedWords: matchedWords ?? localStorageValue?.matchedWords ?? [],
                friends: friends ?? localStorageValue?.friends ?? [],
                name: name ?? localStorageValue?.name ?? "",
                id: id ?? localStorageValue?.id,
            });
        },
        [
            localStorageValue?.date,
            localStorageValue?.friends,
            localStorageValue?.id,
            localStorageValue?.matchedWords,
            localStorageValue?.name,
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
            friends: localStorageValue?.friends ?? [],
            name: localStorageValue?.name ?? "",
            id: localStorageValue?.id,
        });
    }, [
        localStorageValue?.friends,
        localStorageValue?.id,
        localStorageValue?.name,
        setLocalStorageValue,
    ]);

    const validateWords = useCallback(() => {
        return validate({
            allWords: words,
            matchedWords: localStorageValue?.matchedWords ?? [],
            score: localStorageValue?.score ?? 0,
            maxScore: words.reduce((acc, word) => acc + word.score, 0),
        });
    }, [localStorageValue?.matchedWords, localStorageValue?.score, words]);

    // INIT STORES FROM LOCAL STORAGE
    useEffect(() => {
        useSocialStore.setState({
            friends: localStorageValue?.friends ?? [],
        });

        useGameStore.setState({
            score: localStorageValue?.score ?? 0,
            matchedWords: localStorageValue?.matchedWords ?? [],
        });
    }, []);

    // UPDATE LOCAL STORAGE FROM STORES
    useEffect(() => {
        useSocialStore.subscribe(state => {
            updateLocalStorage({
                friends: state.friends,
            });
        });

        useGameStore.subscribe(state => {
            updateLocalStorage({
                score: state.score,
                matchedWords: state.matchedWords,
            });
        });
    }, [updateLocalStorage]);

    // INIT LOCAL STORAGE
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
