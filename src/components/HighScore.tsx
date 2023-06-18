import ky from "ky";
import { FC } from "react";
import { PostHighScoreResponse } from "../app/api/highscore/route";
import { ScoreList } from "./ScoreList";

const fetchHighScore = async (date: string) => {
    try {
        const highscore: PostHighScoreResponse = await ky
            .post("/api/highscore", {
                body: JSON.stringify({ date }),
            })
            .json();

        const sorted = [...highscore.score].sort((a, b) => b.score - a.score);

        return sorted;
    } catch (error) {
        console.log(error);
        return [];
    }
};

export const HighScore: FC = () => {
    return (
        <>
            <ScoreList
                emptyText="Hittar inga resultat 😔"
                fetchFunction={fetchHighScore}
                title="Topplista 🏆"
            />
        </>
    );
};
