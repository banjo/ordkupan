import { PublicScore } from "@/types/types";
import {
    getScoreByUserIdsAndDate,
    getUsersByPublicIdentifiers,
    ScoreWithUser,
} from "@/utils/database";
import { User } from "@prisma/client";
import { NextResponse } from "next/server";
import { createLogger } from "@/lib/logger";

export type PostFriendBody = {
    friends: string[];
    date: string;
};

export type PostFriendResponse = {
    score: PublicScore[];
    maxScore: number;
};

const logger = createLogger("api/friends");

export async function POST(req: Request) {
    logger.info("POST /api/friends called");
    const body: PostFriendBody = await req.json();

    const { friends, date } = body;

    if (!friends || !date) {
        logger.error("Friends or date not provided in request body", { body });
        return NextResponse.json({ error: "Friends or date not provided" }, { status: 400 });
    }

    let users: User[] | null;
    try {
        users = await getUsersByPublicIdentifiers(friends);
        logger.debug("Fetched users by public identifiers", { friends, usersCount: users.length });
    } catch (error: any) {
        logger.error("Error fetching friends", { error });
        return NextResponse.json({ error: "Error fetching friends" }, { status: 500 });
    }

    if (!users) {
        logger.error("No users found for provided friends", { friends });
        return NextResponse.json({ error: "Error fetching friends" }, { status: 500 });
    }

    const userIds = users.map(u => u.id);

    let scores: ScoreWithUser[] = [];
    try {
        scores = await getScoreByUserIdsAndDate(userIds, new Date(date));
        logger.debug("Fetched scores for users and date", {
            userIds,
            date,
            scoresCount: scores.length,
        });
    } catch (error) {
        logger.error("Error fetching scores", { error });
        return NextResponse.json({ error: "Error fetching scores" }, { status: 500 });
    }

    const publicScores: PublicScore[] = users.map(user => {
        const score = scores.find(s => s.userId === user.id);

        if (!score) {
            return {
                score: 0,
                name: user.name,
                publicIdentifier: user.publicIdentifier,
            };
        }

        return {
            score: score.score ?? 0,
            name: user.name,
            publicIdentifier: user.publicIdentifier,
        };
    });

    logger.info("Returning scores for friends", {
        publicScoresCount: publicScores.length,
        maxScore: scores[0]?.maxScore,
    });
    return NextResponse.json({ score: publicScores, maxScore: scores[0]?.maxScore });
}
