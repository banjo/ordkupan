import { useSaveState } from "@/hooks/useSaveState";
import { BasicCombo } from "@/types/types";
import { toIsoDateString } from "@banjoanton/utils";
import { renderHook } from "@testing-library/react-hooks";
import { afterEach, beforeEach, describe, expect, it } from "vitest";

describe("useSaveState", () => {
    let combo: BasicCombo;
    const localStorageKey = "testLocalStorage";
    const now = toIsoDateString(new Date());
    const word = {
        score: 5,
        word: "a",
    };
    const secondWord = {
        score: 2,
        word: "ba",
    };

    beforeEach(() => {
        combo = {
            allWords: [word, secondWord],
            otherLetters: [],
            mainLetter: "a",
            maxScore: 7,
        };
    });

    afterEach(() => {
        localStorage.removeItem(localStorageKey);
    });

    it("should initialize local storage if it does not exist", () => {
        expect(localStorage.getItem(localStorageKey)).toBeNull();
        renderHook(() => useSaveState({ combo, localStorageKey }));
        expect(localStorage.getItem(localStorageKey)).toEqual(
            JSON.stringify({
                date: now,
                score: 0,
                matchedWords: [],
                streak: 0,
                friends: [],
                name: "",
            })
        );
    });

    it("should recognize same day and update state accordingly", () => {
        const localStorageData = {
            date: now, // Same day
            score: word.score,
            matchedWords: [word.word],
            streak: 1,
            friends: ["friend"],
            name: "Name",
            id: "id",
        };
        localStorage.setItem(localStorageKey, JSON.stringify(localStorageData));

        const { result, rerender } = renderHook(() => useSaveState({ combo, localStorageKey }));

        rerender();

        expect(result.current.isLoading).toBe(false);
        expect(localStorage.getItem(localStorageKey)).toEqual(JSON.stringify(localStorageData));
    });

    it("should be next day with score to increase streak", () => {
        const yesterday = toIsoDateString(new Date(Date.now() - 24 * 60 * 60 * 1000));
        const localStorageData = {
            date: yesterday,
            score: word.score,
            matchedWords: [word.word],
            streak: 0,
            friends: ["friend"],
            name: "Name",
            id: "id",
        };
        localStorage.setItem(localStorageKey, JSON.stringify(localStorageData));

        const { result, rerender } = renderHook(() => useSaveState({ combo, localStorageKey }));

        rerender();

        expect(result.current.isLoading).toBe(false);
        expect(localStorage.getItem(localStorageKey)).toEqual(
            JSON.stringify({
                ...localStorageData,
                streak: 1,
                date: now,
                score: 0,
                matchedWords: [],
            })
        );
    });

    it("should reset streak if missed a day", () => {
        const twoDaysAgo = toIsoDateString(new Date(Date.now() - 2 * 24 * 60 * 60 * 1000));
        const localStorageData = {
            date: twoDaysAgo,
            score: word.score,
            matchedWords: [word.word],
            streak: 5,
            friends: ["friend"],
            name: "Name",
            id: "id",
        };
        localStorage.setItem(localStorageKey, JSON.stringify(localStorageData));

        const { result, rerender } = renderHook(() => useSaveState({ combo, localStorageKey }));

        rerender();

        expect(result.current.isLoading).toBe(false);
        expect(localStorage.getItem(localStorageKey)).toEqual(
            JSON.stringify({
                ...localStorageData,
                streak: 0,
                date: now,
                score: 0,
                matchedWords: [],
            })
        );
    });
});
