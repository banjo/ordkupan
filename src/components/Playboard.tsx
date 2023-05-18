"use client";

import { shuffle } from "@banjoanton/utils";
import { useRef, useState } from "react";
import ConfettiExplosion from "react-confetti-explosion";
import { Toaster, toast } from "react-hot-toast";
import { Combo } from "../types/types";
import { Hexgrid } from "./HexGrid";

const CONFETTI_TIME = 1700;

export const Playboard = ({ combo }: { combo: Combo }) => {
    const [word, setWord] = useState("");
    const [score, setScore] = useState(0);
    const [matchedWords, setMatchedWords] = useState<string[]>([]);
    const [otherLetters, setOtherLetters] = useState<string[]>(combo.otherLetters);
    const [showConfetti, setShowConfetti] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    const shuffleLetters = () => {
        setOtherLetters(letters => shuffle(letters));
    };

    const handleLetterClick = (char: string) => {
        setWord(w => w + char);
        inputRef.current?.focus();
    };

    const submitWord = () => {
        const submittedWord = combo.words.find(w => w.word === word);
        setWord("");

        if (word.length < 4) {
            toast.error("För kort ord", {
                icon: "😞",
            });
            console.log("Word too short");
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
                    <div className="flex flex-col">
                        <input
                            type="text"
                            ref={inputRef}
                            value={word.toUpperCase()}
                            placeholder="Ord..."
                            onChange={event => setWord(event.target.value)}
                            className="text-black"
                            onKeyDown={keyDown}
                        ></input>

                        <Hexgrid
                            mainLetter={combo.mainLetter}
                            otherLetters={otherLetters}
                            onClick={handleLetterClick}
                        />
                        <button onClick={shuffleLetters}>Shuffle</button>
                    </div>
                </div>
            </div>
        </>
    );
};
