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

    const shuffleLetters = () => {
        setFadeOut(true);

        setTimeout(() => {
            setOtherLetters(letters => shuffle(letters));
            setFadeOut(false);
        }, 500);
    };

    const handleLetterClick = (char: string) => {
        setWord(w => w + char);
        setTimeout(() => {
            inputRef.current?.focus();
        }, 0);
    };

    const submitWord = () => {
        const submittedWord = combo.words.find(w => w.word === word);
        setWord("");

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
                    <div>
                        <div>score: {score}</div>
                        <div>
                            words:
                            {matchedWords.map(w => (
                                <div key={w}>{w}</div>
                            ))}
                        </div>
                    </div>
                    <div className="flex flex-col justify-center items-center">
                        <input
                            type="text"
                            ref={inputRef}
                            value={word.toUpperCase()}
                            max={15}
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

                        <div className="flex items-center justify-between gap-3">
                            <Button text="Delete" onClick={shuffleLetters} />
                            <Button text="Shuffle" onClick={shuffleLetters} icon={FiRotateCcw} />
                            <Button text="Enter" onClick={shuffleLetters} />
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};
