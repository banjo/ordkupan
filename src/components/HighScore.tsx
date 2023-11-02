import { PostHighScoreResponse } from "@/app/api/highscore/route";
import { PostUserRankResponse } from "@/app/api/user-rank/route";
import { ScoreList } from "@/components/ScoreList";
import { useGameStore } from "@/stores/useGameStore";
import { useSocialStore } from "@/stores/useSocialStore";
import { FetchScoreResponse } from "@/types/types";
import { dateNow } from "@/utils/date";
import { Maybe } from "@banjoanton/utils";
import ky from "ky";
import { FC } from "react";

const getUserRank = async (
    internalUserId: Maybe<string>,
    score: number,
    date: Date
): Promise<number | null> => {
    if (!internalUserId) return null;

    try {
        const res: PostUserRankResponse = await ky
            .post("/api/user-rank", {
                body: JSON.stringify({ date, internalUserId, score }),
            })
            .json();

        return res.rank;
    } catch (error) {
        console.log(error);
        return null;
    }
};

const bannedUsers = new Set(["jag fuskar och vinner!"]);

export const HighScore: FC<{ showHighScore: boolean }> = ({ showHighScore }) => {
    const { id, name } = useSocialStore();
    const { score } = useGameStore();

    const fetchHighScore = async (date: string): Promise<FetchScoreResponse> => {
        try {
            const highscore: PostHighScoreResponse = await ky
                .post("/api/highscore", {
                    body: JSON.stringify({ date }),
                })
                .json();

            let sorted = [...highscore.score].sort((a, b) => b.score - a.score);

            if (!bannedUsers.has(name)) {
                sorted = sorted.filter(s => !bannedUsers.has(s.name));
            }

            return { score: sorted.slice(0, 5), maxScore: highscore.maxScore };
        } catch (error) {
            console.log(error);
            return { maxScore: 0, score: [] };
        }
    };

    return (
        <>
            <ScoreList
                emptyText="Hittar inga resultat 😔"
                fetchFunction={fetchHighScore}
                title="Topplista 🏆"
                subTitle="Dagens bästa"
                trigger={showHighScore}
                fetchRankFunction={() => getUserRank(id, score, new Date(dateNow()))}
            />
        </>
    );
};
