"use client";

import { shuffle } from "@banjoanton/utils";
import { useState } from "react";
import { Toaster } from "react-hot-toast";
import { FiRotateCcw } from "react-icons/fi";
import { useGameLogic } from "../hooks/useGameLogic";
import { useInputFocus } from "../hooks/useInputFocus";
import { Combo } from "../types/types";
import { Button } from "./Button";
import { Confetti } from "./Confetti";
import { Hexgrid } from "./HexGrid";
import { WordField } from "./WordField";

const CONFETTI_TIME = 1700;

export const Playboard = ({ combo }: { combo: Combo }) => {
    const [showConfetti, setShowConfetti] = useState(false);

    const {
        fadeOut,
        isLoading,
        matchedWords,
        otherLetters,
        score,
        word,
        setFadeOut,
        setOtherLetters,
        setWord,
        submitWord,
    } = useGameLogic({ combo, setShowConfetti });

    const { ref, focus } = useInputFocus();

    const shuffleLetters = () => {
        setFadeOut(true);

        setTimeout(() => {
            setOtherLetters(letters => shuffle(letters));
            setFadeOut(false);
        }, 500);
    };

    const deleteLastLetter = () => {
        setWord(w => w.slice(0, -1));
        focus();
    };

    const handleLetterClick = (char: string) => {
        setWord(w => w + char);
        focus();
    };

    const keyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === "Enter") {
            submitWord();
        }
    };

    return (
        <>
            <Toaster toastOptions={{ duration: 1400 }} />
            <Confetti
                showConfetti={showConfetti}
                duration={CONFETTI_TIME}
                onComplete={() => setShowConfetti(false)}
            />
            <div
                className={`flex h-full w-full max-w-sm flex-col items-center justify-center
            ${isLoading ? "opacity-0" : ""} transition-opacity duration-500 ease-in-out`}
                onClick={focus}
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
                            ref={ref}
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
