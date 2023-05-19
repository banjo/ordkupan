"use client";

import { shuffle } from "@banjoanton/utils";
import ConfettiExplosion from "react-confetti-explosion";
import { Toaster } from "react-hot-toast";
import { FiRotateCcw } from "react-icons/fi";
import { useGameLogic } from "../hooks/useGameLogic";
import { useInputFocus } from "../hooks/useInputFocus";
import { Combo } from "../types/types";
import { Button } from "./Button";
import { Hexgrid } from "./HexGrid";
import { WordField } from "./WordField";

const CONFETTI_TIME = 1700;

export const Playboard = ({ combo }: { combo: Combo }) => {
    const {
        fadeOut,
        isLoading,
        matchedWords,
        otherLetters,
        score,
        showConfetti,
        word,
        setFadeOut,
        setOtherLetters,
        setShowConfetti,
        setWord,
        submitWord,
    } = useGameLogic({ combo });

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
