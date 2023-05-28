"use client";

import { useState } from "react";
import { Toaster } from "react-hot-toast";
import { useGameLogic } from "../hooks/useGameLogic";
import { useInputFocus } from "../hooks/useInputFocus";
import { useLanguage } from "../hooks/useLanguage";
import { Combo } from "../types/types";
import { Confetti } from "./Confetti";
import { FinishedCard } from "./FinishedCard";
import { GameButtons } from "./GameButtons";
import { Hexgrid } from "./HexGrid";
import { InputField } from "./InputField";
import { Menubar } from "./Menubar";
import { ScoreBoard } from "./ScoreBoard";
import { Toggle } from "./Toggle";

const CONFETTI_TIME = 1700;

type Props = {
    combo: Combo;
    previous: Combo;
};

export const Playboard = ({ combo, previous }: Props) => {
    useLanguage();
    const [showConfetti, setShowConfetti] = useState(false);

    const {
        fadeOut,
        isLoading,
        matchedWords,
        otherLetters,
        score,
        word,
        finished,
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
            <Toaster toastOptions={{ duration: 2000 }} />
            <Confetti
                showConfetti={showConfetti}
                duration={CONFETTI_TIME}
                onComplete={() => setShowConfetti(false)}
            />
            <div
                className={`relative flex h-full w-full max-w-sm flex-col 
                items-center justify-start 
                px-4 py-6
                ${isLoading ? "opacity-0" : ""} transition-opacity duration-500 ease-in-out`}
                onClick={focus}
            >
                <div className="flex min-h-full w-full flex-col justify-start gap-4 px-8">
                    <Menubar previous={previous} />
                    <ScoreBoard
                        matchedWords={matchedWords}
                        maxScore={combo.maxScore}
                        score={score}
                    />

                    <div className="flex flex-col items-center justify-start">
                        <Toggle show={finished}>
                            <FinishedCard />
                        </Toggle>
                        <Toggle show={!finished}>
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
                        </Toggle>
                    </div>
                </div>
            </div>
        </>
    );
};
