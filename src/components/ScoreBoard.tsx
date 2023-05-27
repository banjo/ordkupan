import { FC } from "react";
import { calculateStep } from "../utils/score";
import { Stepper } from "./Stepper";
import { WordField } from "./WordField";

type Props = {
    matchedWords: string[];
    score: number;
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

export const ScoreBoard: FC<Props> = ({ score, maxScore, matchedWords }) => {
    const step = calculateStep(score, maxScore, 9);

    return (
        <div className="flex flex-col justify-between gap-4">
            <div className="flex flex-col items-center justify-center">
                <Stepper steps={9} active={step} display={score} />
                <div>{labels[step - 1]}</div>
            </div>
            <WordField words={matchedWords} />
        </div>
    );
};
