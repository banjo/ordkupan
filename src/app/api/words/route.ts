import { getUserByUniqueIdentifier, getUsersWordsByDate } from "@/utils/database";
import { NextResponse } from "next/server";
import { createLogger } from "@/lib/logger";

export type PostWordsBody = {
    date: string;
    internalIdentifier: string;
};

export type PostWordsResponse = {
    words: string[];
};

const logger = createLogger("api/words");

export async function POST(req: Request) {
    logger.info("POST /api/words called");
    const body: PostWordsBody = await req.json();

    const { date, internalIdentifier } = body;

    if (!date) {
        logger.error("Date not provided in request body", { body });
        return NextResponse.json({ error: "Date not provided" }, { status: 400 });
    }

    if (!internalIdentifier) {
        logger.error("Internal identifier not provided in request body", { body });
        return NextResponse.json({ error: "Internal identifier not provided" }, { status: 400 });
    }

    const user = await getUserByUniqueIdentifier(internalIdentifier);
    logger.debug("Fetched user by unique identifier", { internalIdentifier, user });
    if (!user) {
        logger.error("User not found", { internalIdentifier });
        return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const userId = user.id;

    let words: string[] = [];
    try {
        words = await getUsersWordsByDate(userId, date);
        logger.debug("Fetched words for user and date", { userId, date, words });
    } catch (error) {
        logger.error("Error fetching words", { error });
        return NextResponse.json({ error: "Error fetching words" }, { status: 500 });
    }

    logger.info("Returning words for user", { internalIdentifier, date, words });
    return NextResponse.json({
        words,
    });
}
