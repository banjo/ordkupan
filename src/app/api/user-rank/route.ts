import {
    getHighScoresByDate,
    getScoreAmountBetterThanScore,
    ScoreWithUser,
} from "@/utils/database";
import { NextResponse } from "next/server";

export type PostUserRankBody = {
    date: string;
    score: number;
    internalUserId: string;
};

export type PostUserRankResponse = {
    rank: number;
};

export async function POST(req: Request) {
    const body: PostUserRankBody = await req.json();

    const { date, internalUserId, score } = body;

    if (!date) {
        return NextResponse.json({ error: "Date not provided" }, { status: 400 });
    }

    if (!internalUserId) {
        return NextResponse.json({ error: "User ID not provided" }, { status: 400 });
    }

    if (score === undefined) {
        return NextResponse.json({ error: "Score not provided" }, { status: 400 });
    }

    let scores: ScoreWithUser[] = [];
    try {
        scores = await getHighScoresByDate(new Date(date));
    } catch (error) {
        console.log(error);
        return NextResponse.json({ error: "Error fetching scores" }, { status: 500 });
    }

    if (scores.some(s => s.user.uniqueIdentifier === internalUserId)) {
        const rank = scores.findIndex(s => s.user.uniqueIdentifier === internalUserId) + 1;
        return NextResponse.json({ rank });
    }

    if (scores.length === 0) {
        return NextResponse.json({ error: "No scores found" }, { status: 404 });
    }

    const scoresBetterThanUser = await getScoreAmountBetterThanScore(score, new Date(date));

    if (scoresBetterThanUser === null) {
        return NextResponse.json({ error: "Error fetching scores" }, { status: 500 });
    }

    const rank = scoresBetterThanUser + 1;

    return NextResponse.json({ rank });
}
