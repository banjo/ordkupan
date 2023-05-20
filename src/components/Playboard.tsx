"use client";

import { useState } from "react";
import { Toaster } from "react-hot-toast";
import { useGameLogic } from "../hooks/useGameLogic";
import { useInputFocus } from "../hooks/useInputFocus";
import { Combo } from "../types/types";
import { Confetti } from "./Confetti";
import { GameButtons } from "./GameButtons";
import { Hexgrid } from "./HexGrid";
import { InputField } from "./InputField";
import { ScoreBoard } from "./ScoreBoard";

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

    const handleLetterClick = (char: string) => {
        setWord(w => w + char);
        focus();
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
                <div className="flex w-full flex-col gap-8">
                    <ScoreBoard
                        matchedWords={matchedWords}
                        maxScore={combo.maxScore}
                        score={score}
                    />
                    <div className="flex flex-col items-center justify-center">
                        <InputField
                            ref={ref}
                            setWord={setWord}
                            submitWord={submitWord}
                            word={word}
                        />

                        <Hexgrid
                            mainLetter={combo.mainLetter}
                            otherLetters={otherLetters}
                            onClick={handleLetterClick}
                            fadeOut={fadeOut}
                        />

                        <GameButtons
                            setFadeOut={setFadeOut}
                            setOtherLetters={setOtherLetters}
                            setWord={setWord}
                            submitWord={submitWord}
                        />
                    </div>
                </div>
            </div>
        </>
    );
};
