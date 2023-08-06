import {
    getDaysPlayed,
    getTotalGuesses,
    getTotalWins,
    getUserByUniqueIdentifier,
} from "@/utils/database";
import { NextResponse } from "next/server";

export type PostUserStatsBody = {
    internalUserId: string;
};

export type PostUserStatsResponse = {
    daysPlayed: number;
    totalWins: number;
    totalGuesses: number;
};

export async function POST(req: Request) {
    const body: PostUserStatsBody = await req.json();

    const { internalUserId } = body;

    if (!internalUserId) {
        return NextResponse.json({ error: "User ID not provided" }, { status: 400 });
    }

    let stats: PostUserStatsResponse | null = null;
    try {
        stats = await getStats(internalUserId);
    } catch (error) {
        console.log(error);
        return NextResponse.json({ error: "Error fetching scores" }, { status: 500 });
    }

    return NextResponse.json(stats);
}

async function getStats(uniqueIdentifier: string): Promise<PostUserStatsResponse | null> {
    const user = await getUserByUniqueIdentifier(uniqueIdentifier);

    if (!user) {
        console.log("User not found");
        return null;
    }

    const userId = user.id;

    const [daysPlayed, totalWins, totalGuesses] = await Promise.all([
        getDaysPlayed(userId),
        getTotalWins(userId),
        getTotalGuesses(userId),
    ]);

    return {
        daysPlayed,
        totalWins,
        totalGuesses,
    };
}
