import {
    getDaysPlayed,
    getTotalGuesses,
    getTotalWins,
    getUserByUniqueIdentifier,
} from "@/utils/database";
import { NextResponse } from "next/server";
import { createLogger } from "@/lib/logger";

export type PostUserStatsBody = {
    internalUserId: string;
};

export type PostUserStatsResponse = {
    daysPlayed: number;
    totalWins: number;
    totalGuesses: number;
};

const logger = createLogger("api/stats");

export async function POST(req: Request) {
    logger.info("POST /api/stats called");
    const body: PostUserStatsBody = await req.json();

    const { internalUserId } = body;

    if (!internalUserId) {
        logger.error("User ID not provided in request body", { body });
        return NextResponse.json({ error: "User ID not provided" }, { status: 400 });
    }

    let stats: PostUserStatsResponse | null = null;
    try {
        stats = await getStats(internalUserId);
        logger.debug("Fetched stats for user", { internalUserId, stats });
    } catch (error) {
        logger.error("Error fetching scores", { error });
        return NextResponse.json({ error: "Error fetching scores" }, { status: 500 });
    }

    logger.info("Returning user stats", { internalUserId, stats });
    return NextResponse.json(stats);
}

async function getStats(uniqueIdentifier: string): Promise<PostUserStatsResponse | null> {
    const user = await getUserByUniqueIdentifier(uniqueIdentifier);
    logger.debug("Fetched user by unique identifier", { uniqueIdentifier, userId: user?.id });
    if (!user) {
        logger.error("User not found", { uniqueIdentifier });
        return null;
    }

    const userId = user.id;

    const [daysPlayed, totalWins, totalGuesses] = await Promise.all([
        getDaysPlayed(userId),
        getTotalWins(userId),
        getTotalGuesses(userId),
    ]);
    logger.debug("Fetched stats details", { userId, daysPlayed, totalWins, totalGuesses });
    return {
        daysPlayed,
        totalWins,
        totalGuesses,
    };
}
