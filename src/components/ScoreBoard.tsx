import { Stepper } from "@/components/Stepper";
import { WordField } from "@/components/WordField";
import { useGameStore } from "@/stores/useGameStore";
import { calculateStep } from "@/utils/score";
import { FC } from "react";

type Props = {
    maxScore: number;
};

const labels = [
    "👶 Nybörjare",
    "👦 Förstående",
    "👨 Okej",
    "👴 Bra",
    "🧙‍♂️ Vass",
    "📺 Proffs",
    "🏆 Mästare",
    "🥷 Guru",
    "🔥 Legend",
];

const STEPS = 9;

export const ScoreBoard: FC<Props> = ({ maxScore }) => {
    const { matchedWords, score, allWords } = useGameStore();
    const step = calculateStep(score, maxScore, STEPS);

    return (
        <div className="flex flex-col justify-between gap-4">
            <div className="flex flex-col items-center justify-center">
                <Stepper steps={STEPS} active={step} display={score} maxScore={maxScore} />
                <div>{labels[step - 1]}</div>
            </div>
            <WordField words={matchedWords} totalLength={allWords.length} />
        </div>
    );
};
