import { NextResponse } from "next/server";
import { PublicScore } from "../../../types/types";
import { getHighScoresByDate, ScoreWithUser } from "../../../utils/database";

export type PostHighScoreBody = {
    date: string;
};

export type PostHighScoreResponse = {
    score: PublicScore[];
};

export async function POST(req: Request) {
    const body: PostHighScoreBody = await req.json();

    const { date } = body;

    if (!date) {
        return NextResponse.json({ error: "Date not provided" }, { status: 400 });
    }

    let scores: ScoreWithUser[] = [];
    try {
        scores = await getHighScoresByDate(new Date(date));
    } catch (error) {
        console.log(error);
        return NextResponse.json({ error: "Error fetching scores" }, { status: 500 });
    }

    const publicScores: PublicScore[] = scores
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

    if (publicScores.length === 0) {
        return NextResponse.json({ error: "No scores found" }, { status: 404 });
    }

    return NextResponse.json({ score: publicScores });
}
