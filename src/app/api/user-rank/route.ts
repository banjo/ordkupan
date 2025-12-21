import {
    getHighScoresByDate,
    getScoreAmountBetterThanScore,
    ScoreWithUser,
} from "@/utils/database";
import { NextResponse } from "next/server";
import { createLogger } from "@/lib/logger";

export type PostUserRankBody = {
    date: string;
    score: number;
    internalUserId: string;
};

export type PostUserRankResponse = {
    rank: number;
};

const logger = createLogger("api/user-rank");

export async function POST(req: Request) {
    logger.info("POST /api/user-rank called");
    const body: PostUserRankBody = await req.json();

    const { date, internalUserId, score } = body;

    if (!date) {
        logger.error("Date not provided in request body", { body });
        return NextResponse.json({ error: "Date not provided" }, { status: 400 });
    }

    if (!internalUserId) {
        logger.error("User ID not provided in request body", { body });
        return NextResponse.json({ error: "User ID not provided" }, { status: 400 });
    }

    if (score === undefined) {
        logger.error("Score not provided in request body", { body });
        return NextResponse.json({ error: "Score not provided" }, { status: 400 });
    }

    let scores: ScoreWithUser[] = [];
    try {
        scores = await getHighScoresByDate(new Date(date));
        logger.debug("Fetched high scores by date", { date, scoresCount: scores.length });
    } catch (error) {
        logger.error("Error fetching scores", { error });
        return NextResponse.json({ error: "Error fetching scores" }, { status: 500 });
    }

    if (scores.some(s => s.user.uniqueIdentifier === internalUserId)) {
        const rank = scores.findIndex(s => s.user.uniqueIdentifier === internalUserId) + 1;
        logger.info("User found in high scores", { internalUserId, rank });
        return NextResponse.json({ rank });
    }

    if (scores.length === 0) {
        logger.info("No scores found for date", { date });
        return NextResponse.json({ error: "No scores found" }, { status: 404 });
    }

    const scoresBetterThanUser = await getScoreAmountBetterThanScore(score, new Date(date));
    logger.debug("Fetched scores better than user", { score, date, scoresBetterThanUser });
    if (scoresBetterThanUser === null) {
        logger.error("Error fetching scores better than user", { score, date });
        return NextResponse.json({ error: "Error fetching scores" }, { status: 500 });
    }
    const rank = scoresBetterThanUser + 1;
    logger.info("Returning user rank", { internalUserId, rank });
    return NextResponse.json({ rank });
}
