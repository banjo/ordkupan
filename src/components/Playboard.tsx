"use client";

import { shuffle } from "@banjoanton/utils";
import { useRef, useState } from "react";
import ConfettiExplosion from "react-confetti-explosion";
import { Toaster, toast } from "react-hot-toast";
import { FiRotateCcw } from "react-icons/fi";
import { Combo } from "../types/types";
import { Button } from "./Button";
import { Hexgrid } from "./HexGrid";

const CONFETTI_TIME = 1700;

export const Playboard = ({ combo }: { combo: Combo }) => {
    const [word, setWord] = useState("");
    const [score, setScore] = useState(0);
    const [matchedWords, setMatchedWords] = useState<string[]>([]);
    const [otherLetters, setOtherLetters] = useState<string[]>(combo.otherLetters);
    const [showConfetti, setShowConfetti] = useState(false);
    const [fadeOut, setFadeOut] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

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
        setMatchedWords([...matchedWords, submittedWord.word]);
        setScore(s => s + submittedWord.score);
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
            <div className="flex flex-col items-center justify-center">
                <div className="flex flex-col lg:flex-row gap-8">
                    <div className="flex flex-row justify-between px-8">
                        <div className="basis-6/12">
                            <div className="uppercase text-sm font-semibold mb-2">
                                Korrekta svar
                            </div>
                            <div className="flex flex-col gap-3 h-20 overflow-y-scroll">
                                {matchedWords.map(w => (
                                    <span
                                        className="py-1 px-2 bg-primary text-black uppercase rounded-sm text-center"
                                        key={w}
                                    >
                                        {w}
                                    </span>
                                ))}
                                {matchedWords.length === 0 && (
                                    <span className="text-2xl font-bold">Inga 😞</span>
                                )}
                            </div>
                        </div>
                        <div className="basis-5/12 text-right">
                            <div className="uppercase text-sm font-semibold mb-2">Poäng</div>
                            <div className="text-2xl font-bold">
                                {score} / {combo.maxScore}
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col justify-center items-center">
                        <input
                            type="text"
                            ref={inputRef}
                            value={word.toUpperCase()}
                            max={15}
                            inputMode="none"
                            onChange={event => setWord(event.target.value)}
                            className="text-black h-16 w-80 bg-white 
                            text-center font-bold text-3xl
                            border-none outline-none
                            caret-primary"
                            onKeyDown={keyDown}
                        ></input>

                        <Hexgrid
                            mainLetter={combo.mainLetter}
                            otherLetters={otherLetters}
                            onClick={handleLetterClick}
                            fadeOut={fadeOut}
                        />

                        <div
                            className="flex items-center justify-between gap-3 w-full 
                            relative right-[4px]"
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
