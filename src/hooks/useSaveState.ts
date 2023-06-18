import { formatDate } from "@banjoanton/utils";
import { Temporal } from "@js-temporal/polyfill";
import { useCallback, useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { useLocalStorage } from "react-use";
import { useGameStore } from "../stores/useGameStore";
import { useSocialStore } from "../stores/useSocialStore";
import { BasicComboWithWords } from "../types/types";
import { dateNow } from "../utils/date";
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
};

type In = {
    combo: BasicComboWithWords;
    localStorageKey: string;
};

const nowAsString = () => formatDate(new Date(dateNow()));

export const useSaveState = ({ combo, localStorageKey }: In): Out => {
    const { date, friends, name, streak, id } = useSocialStore();
    const { score, matchedWords } = useGameStore();
    const { words, otherLetters } = combo;
    const [localStorageValue, setLocalStorageValue] = useLocalStorage<LocalStorageState | null>(
        localStorageKey,
        null
    );
    const [isLoading, setIsLoading] = useState(true);
    const { setOtherLetters } = useGameStore();

    const updateState = useCallback(
        ({
            score: scoreUpdate,
            matchedWords: matchedWordsUpdate,
            streak: streakUpdate,
            date: dateUpdate,
            name: nameUpdate,
            friends: friendsUpdate,
            id: idUpdate,
        }: UpdateLocalStorageProps) => {
            useSocialStore.setState({
                date: dateUpdate ?? localStorageValue?.date ?? nowAsString(),
                streak: streakUpdate ?? localStorageValue?.streak ?? 0,
                friends: friendsUpdate ?? localStorageValue?.friends ?? [],
                name: nameUpdate ?? localStorageValue?.name ?? "",
                id: idUpdate ?? localStorageValue?.id,
            });

            useGameStore.setState({
                score: scoreUpdate ?? localStorageValue?.score ?? 0,
                matchedWords: matchedWordsUpdate ?? localStorageValue?.matchedWords ?? [],
                otherLetters: otherLetters,
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
            otherLetters,
        ]
    );

    const resetState = useCallback(() => {
        useSocialStore.setState({
            date: nowAsString(),
            streak: 0,
            friends: localStorageValue?.friends ?? [],
            name: localStorageValue?.name ?? "",
            id: localStorageValue?.id,
        });

        useGameStore.setState({
            score: 0,
            matchedWords: [],
            otherLetters: [],
        });
    }, [localStorageValue?.friends, localStorageValue?.id, localStorageValue?.name]);

    const validateWords = useCallback(() => {
        return validate({
            allWords: words,
            matchedWords: localStorageValue?.matchedWords ?? [],
            score: localStorageValue?.score ?? 0,
            maxScore: words.reduce((acc, word) => acc + word.score, 0),
        });
    }, [localStorageValue?.matchedWords, localStorageValue?.score, words]);

    // INIT LOCAL STORAGE ON START
    useEffect(() => {
        if (!localStorageValue) {
            resetState();
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
                resetState();
                setIsLoading(false);
                return;
            }

            toast.success("Välkommen tillbaka!", {
                icon: "👋",
            });

            updateState({
                score: localStorageValue.score,
                matchedWords: localStorageValue.matchedWords,
                date: nowAsString(),
                friends: localStorageValue.friends,
                name: localStorageValue.name,
                id: localStorageValue.id,
                streak: localStorageValue.streak,
            });

            setIsLoading(false);
            return;
        }

        const yesterday = Temporal.Now.plainDateISO("Europe/Stockholm")
            .add({ days: -1 })
            .toString();

        const isDayAfter = localStorageValue.date === formatDate(new Date(yesterday));
        const hasScore = localStorageValue.score > 0;

        if (!isDayAfter || !hasScore) {
            resetState();
            setIsLoading(false);
            return;
        }

        const updatedStreak = localStorageValue.streak + 1;

        updateState({
            streak: updatedStreak,
            date: dateNow(),
            matchedWords: [],
            score: 0,
            friends: localStorageValue.friends,
            name: localStorageValue.name,
            id: localStorageValue.id,
        });

        toast.success(`Din streak är nu ${updatedStreak} dag${updatedStreak === 1 ? "" : "ar"}!`, {
            icon: "🔥",
        });

        setIsLoading(false);
    }, []);

    // SET OTHER LETTERS TO STORE
    useEffect(() => {
        setOtherLetters(otherLetters);
    }, []);

    // UPDATE LOCAL STORAGE ON STORE CHANGE
    useEffect(() => {
        setLocalStorageValue({
            date,
            score,
            matchedWords,
            streak,
            friends,
            name,
            id,
        });
    }, [date, friends, id, matchedWords, name, score, setLocalStorageValue, streak]);

    return {
        isLoading,
    };
};
