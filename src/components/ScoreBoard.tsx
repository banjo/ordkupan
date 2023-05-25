import { FC } from "react";
import { WordField } from "./WordField";

type Props = {
    matchedWords: string[];
    score: number;
    maxScore: number;
};

export const ScoreBoard: FC<Props> = ({ score, maxScore, matchedWords }) => {
    return (
        <div className="flex flex-col justify-between gap-4">
            <div className="mb-2 flex items-center justify-between">
                <div className="text-2xl font-bold uppercase">Poäng</div>
                <div className="text-2xl font-medium">
                    {score} / {maxScore}
                </div>
            </div>
            <div>
                <WordField words={matchedWords} />
            </div>
        </div>
    );
};
