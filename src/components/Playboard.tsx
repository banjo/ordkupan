"use client";

import { AddName } from "@/components/AddName";
import { Confetti } from "@/components/Confetti";
import { ConfettiExplosion } from "@/components/ConfettiExplosion";
import { FinishedCard } from "@/components/FinishedCard";
import { GameButtons } from "@/components/GameButtons";
import { Hexgrid } from "@/components/HexGrid";
import { InputField } from "@/components/InputField";
import { Menubar } from "@/components/Menubar";
import { ScoreBoard } from "@/components/ScoreBoard";
import { Toggle } from "@/components/Toggle";
import { useGameLogic } from "@/hooks/useGameLogic";
import { useLanguage } from "@/hooks/useLanguage";
import { useSingletonInputFocus } from "@/hooks/useSingletonInputFocus";
import { useConfettiStore } from "@/stores/useConfettiStore";
import { useGameStore } from "@/stores/useGameStore";
import { BasicComboWithWords } from "@/types/types";
import { motion } from "framer-motion";
import { Toaster } from "react-hot-toast";

const CONFETTI_TIME = 1700;

type Props = {
    combo: BasicComboWithWords;
    previous: BasicComboWithWords;
    localStorageKey: string;
};

const variantsMain = {
    hidden: { opacity: 0, y: 5 },
    visible: { opacity: 1, y: 0 },
};

export const Playboard = ({ combo, previous, localStorageKey }: Props) => {
    useLanguage();
    const { focus } = useSingletonInputFocus();
    const { appendLetter, isFinished, isWrongGuess } = useGameStore();
    const { setShowConfetti, showConfetti } = useConfettiStore();

    const { fadeOut, isLoading, setFadeOut, submitWord } = useGameLogic({
        combo,
        localStorageKey,
    });

    const handleLetterClick = (char: string) => {
        appendLetter(char);
        focus();
    };

    return (
        <>
            <Toaster toastOptions={{ duration: 2000 }} />
            <Confetti
                showConfetti={showConfetti}
                duration={CONFETTI_TIME}
                onComplete={() => setShowConfetti(false)}
                className="top-[25%]"
            />
            <ConfettiExplosion show={isFinished} duration={CONFETTI_TIME} />

            <motion.div
                variants={variantsMain}
                initial="hidden"
                animate={isLoading ? "hidden" : "visible"}
                transition={{ duration: 0.5, ease: "easeInOut" }}
                className={`relative flex h-full w-full max-w-sm flex-col 
                items-center justify-start px-4 py-6
                standalone:gap-4`}
                onClick={focus}
            >
                <div className={`flex min-h-full w-full flex-col justify-between gap-4 px-8`}>
                    <AddName />
                    <Menubar previous={previous} />
                    <ScoreBoard maxScore={combo.maxScore} />

                    <div className="flex flex-col items-center justify-start standalone:mt-8">
                        <Toggle show={!isFinished}>
                            <div key="game" className="flex flex-col items-center standalone:gap-8">
                                <InputField submitWord={submitWord} isWrongGuess={isWrongGuess} />

                                <Hexgrid
                                    mainLetter={combo.mainLetter}
                                    onClick={handleLetterClick}
                                    fadeOut={fadeOut}
                                />

                                <GameButtons setFadeOut={setFadeOut} submitWord={submitWord} />
                            </div>
                        </Toggle>

                        <Toggle show={isFinished} delay={0.5}>
                            <div className="h-[400px]">
                                <FinishedCard />
                            </div>
                        </Toggle>
                    </div>
                </div>
            </motion.div>
        </>
    );
};
