import { PublicScore } from "@/types/types";
import { getHighScoresByDate, ScoreWithUser } from "@/utils/database";
import { NextResponse } from "next/server";
import { createLogger } from "@/lib/logger";

export type PostHighScoreBody = {
    date: string;
};

export type PostHighScoreResponse = {
    score: PublicScore[];
    maxScore: number;
};

const logger = createLogger("api/highscore");

export async function POST(req: Request) {
    logger.info("POST /api/highscore called");
    const body: PostHighScoreBody = await req.json();

    const { date } = body;

    if (!date) {
        logger.error("Date not provided in request body", { body });
        return NextResponse.json({ error: "Date not provided" }, { status: 400 });
    }

    let scores: ScoreWithUser[] = [];
    try {
        scores = await getHighScoresByDate(new Date(date));
        logger.debug("Fetched high scores by date", { date, scores });
    } catch (error) {
        logger.error("Error fetching scores", { error });
        return NextResponse.json({ error: "Error fetching scores" }, { status: 500 });
    }

    let publicScores: PublicScore[] = [];
    try {
        publicScores = scores
            .map(score => {
                if (!score.score) {
                    throw new Error("Score not found");
                }
                return {
                    score: score.score,
                    name: score.user.name,
                    publicIdentifier: score.user.publicIdentifier,
                };
            })
            .filter(score => score.score > 0);
        logger.debug("Mapped public scores", { publicScores });
    } catch (error) {
        logger.error("Error mapping public scores", { error });
        return NextResponse.json({ error: "Error mapping public scores" }, { status: 500 });
    }

    if (publicScores.length === 0) {
        logger.info("No scores found for date", { date });
        return NextResponse.json({ error: "No scores found" }, { status: 404 });
    }

    logger.info("Returning high scores", { publicScores, maxScore: scores[0]?.maxScore });
    return NextResponse.json({ score: publicScores, maxScore: scores[0]?.maxScore });
}
