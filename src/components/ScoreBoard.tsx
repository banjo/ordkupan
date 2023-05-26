import { FC } from "react";
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

const calculateStep = (score: number, maxScore: number, maxSteps: number) => {
    if(score < 10) return 1;

    if(score < 20) return 2;

    const step = Math.floor((score / maxScore) * maxSteps);

    if(step < 2) return 2;

    return step;
};

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
