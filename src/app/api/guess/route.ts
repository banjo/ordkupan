import {
    addToGuess,
    createNewGuess,
    getTodaysGuess,
    getUserByUniqueIdentifier,
} from "@/utils/database";
import { NextResponse } from "next/server";
import { createLogger } from "@/lib/logger";

export type GuessExpectedBody = {
    word: string;
    userUniqueIdentifier: string;
};

const logger = createLogger("api/guess");

export async function POST(req: Request) {
    logger.info("POST /api/guess called");
    const body: GuessExpectedBody = await req.json();

    if (!body.word || !body.userUniqueIdentifier) {
        logger.error("Bad request: word or userUniqueIdentifier missing", { body });
        return NextResponse.json({ error: "Bad request" }, { status: 400 });
    }

    const { word, userUniqueIdentifier } = body;

    try {
        const user = await getUserByUniqueIdentifier(userUniqueIdentifier);
        logger.debug("Fetched user by unique identifier", { userUniqueIdentifier, user });
        if (!user) {
            logger.error("User not found", { userUniqueIdentifier });
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        const guessEntity = await getTodaysGuess(user.id);
        logger.debug("Fetched today's guess entity", { userId: user.id, guessEntity });
        if (!guessEntity) {
            logger.info("Guess not found, creating new guess", { userId: user.id });
            await createNewGuess(user.id, word);
            return NextResponse.json({ success: true });
        }

        await addToGuess(guessEntity.id, word);
        logger.info("Added word to existing guess", { guessId: guessEntity.id, word });
        return NextResponse.json({ success: true });
    } catch (error) {
        logger.error("Error updating guess", { error });
        return NextResponse.json({ error: "Error updating guess" }, { status: 500 });
    }
}
