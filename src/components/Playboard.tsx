"use client";

import { shuffle } from "@banjoanton/utils";
import { useRef, useState } from "react";
import ConfettiExplosion from "react-confetti-explosion";
import { Toaster, toast } from "react-hot-toast";
import { FiRotateCcw } from "react-icons/fi";
import { useSaveState } from "../hooks/useSaveState";
import { Combo } from "../types/types";
import { Button } from "./Button";
import { Hexgrid } from "./HexGrid";
import { WordField } from "./WordField";

const CONFETTI_TIME = 1700;

export const Playboard = ({ combo }: { combo: Combo }) => {
    const [word, setWord] = useState("");
    const [score, setScore] = useState(0);
    const [matchedWords, setMatchedWords] = useState<string[]>([]);
    const [otherLetters, setOtherLetters] = useState<string[]>(combo.otherLetters);
    const [showConfetti, setShowConfetti] = useState(false);
    const [fadeOut, setFadeOut] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);
    const {
        isLoading,
        updateLocalStorage,
        value: localStorageValue,
    } = useSaveState({ setScore, setMatchedWords });

    const focusInput = () => {
        setTimeout(() => {
            inputRef.current?.focus();
        }, 0);
    };

    const shuffleLetters = () => {
        setFadeOut(true);

        setTimeout(() => {
            setOtherLetters(letters => shuffle(letters));
            setFadeOut(false);
        }, 500);
    };

    const deleteLastLetter = () => {
        setWord(w => w.slice(0, -1));
        focusInput();
    };

    const handleLetterClick = (char: string) => {
        setWord(w => w + char);
        focusInput();
    };

    const submitWord = () => {
        const submittedWord = combo.words.find(w => w.word === word);
        setWord("");
        focusInput();

        if (word.length === 0) {
            return;
        }

        if (word.length < 4) {
            toast.error("För kort ord", {
                icon: "😞",
            });
            return;
        }

        if (word.length > 7) {
            toast.error("För långt ord", {
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

        setShowConfetti(true);
        const newMatchedWords = [...matchedWords, submittedWord.word];
        const newScore = score + submittedWord.score;

        updateLocalStorage({
            date: new Date().toDateString(),
            streak: localStorageValue?.streak ?? 0,
            score: newScore,
            matchedWords: newMatchedWords,
        });

        setMatchedWords(newMatchedWords);
        setScore(newScore);
    };

    const keyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === "Enter") {
            submitWord();
        }
    };

    return (
        <>
            <Toaster />
            <div className="absolute top-[25%]">
                {showConfetti && (
                    <ConfettiExplosion
                        duration={CONFETTI_TIME}
                        onComplete={() => setShowConfetti(false)}
                    />
                )}
                {showConfetti}
            </div>
            <div
                className={`flex h-full w-full flex-col items-center justify-center
            ${isLoading ? "opacity-0" : ""} transition-opacity duration-500 ease-in-out`}
                onClick={focusInput}
            >
                <div className="flex w-full flex-col gap-8 lg:flex-row">
                    <div className="flex flex-col justify-between gap-4 px-8">
                        <div className="mb-2 flex items-center justify-between">
                            <div className="text-2xl font-bold uppercase">Poäng</div>
                            <div className="text-2xl font-medium">
                                {score} / {combo.maxScore}
                            </div>
                        </div>
                        <div>
                            <WordField words={matchedWords} />
                        </div>
                    </div>
                    <div className="flex flex-col items-center justify-center">
                        <input
                            type="text"
                            ref={inputRef}
                            value={word.toUpperCase()}
                            max={15}
                            inputMode="none"
                            onChange={event => setWord(event.target.value)}
                            className="h-16 w-80 border-none bg-white 
                            text-center text-3xl font-bold
                            text-black caret-primary
                            outline-none"
                            onKeyDown={keyDown}
                        ></input>

                        <Hexgrid
                            mainLetter={combo.mainLetter}
                            otherLetters={otherLetters}
                            onClick={handleLetterClick}
                            fadeOut={fadeOut}
                        />

                        <div
                            className="relative flex w-9/12 items-center 
                            justify-between gap-3"
                        >
                            <Button text="Delete" onClick={deleteLastLetter} />
                            <Button onClick={shuffleLetters} icon={FiRotateCcw} />
                            <Button text="Enter" onClick={submitWord} />
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};
