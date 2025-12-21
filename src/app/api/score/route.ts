import { getCombos } from "@/utils/combo";
import {
    addScore,
    getTodaysScore,
    getUserByUniqueIdentifier,
    setScoreAndWords,
} from "@/utils/database";
import { validate } from "@/utils/validation";
import { NextResponse } from "next/server";
import { createLogger } from "@/lib/logger";

export type PostScoreExpectedBody = {
    userUniqueIdentifier: string;
    score: number;
    maxScore: number;
    matchedWords: string[];
};

const logger = createLogger("api/score");

export async function POST(req: Request) {
    logger.info("POST /api/score called");
    const body: PostScoreExpectedBody = await req.json();

    if (!body.matchedWords || !body.maxScore || !body.score || !body.userUniqueIdentifier) {
        logger.error("Bad request: missing required fields", { body });
        return NextResponse.json({ error: "Bad request" }, { status: 400 });
    }

    const { userUniqueIdentifier, score, maxScore, matchedWords } = body;

    const [combo] = await getCombos();
    const allWords = combo.allWords;

    const mappedWords = matchedWords.map(word => {
        const res = allWords.find(w => w.word === word);

        if (!res) {
            return null;
        }

        return res;
    });

    if (mappedWords.includes(null)) {
        logger.error("Invalid words in matchedWords", { matchedWords });
        return NextResponse.json({ error: "Invalid words" }, { status: 400 });
    }

    const isValid = validate({
        allWords,
        matchedWords,
        maxScore,
        score,
    });

    if (!isValid) {
        logger.error("Invalid score", { score, maxScore, matchedWords });
        return NextResponse.json({ error: "Invalid score" }, { status: 400 });
    }

    try {
        const user = await getUserByUniqueIdentifier(userUniqueIdentifier);
        logger.debug("Fetched user by unique identifier", { userUniqueIdentifier, user });
        if (!user) {
            logger.error("User not found", { userUniqueIdentifier });
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        const scoreEntity = await getTodaysScore(user.id);
        logger.debug("Fetched today's score entity", { userId: user.id, scoreEntity });
        if (!scoreEntity) {
            logger.info("Score not found, creating new score", { userId: user.id });
            await addScore({ userId: user.id, score, maxScore, matchedWords });
            return NextResponse.json({ success: true });
        }

        await setScoreAndWords(scoreEntity.id, score, matchedWords);
        logger.info("Updated score and words for user", { userId: user.id, score, matchedWords });
        return NextResponse.json({ success: true });
    } catch (error) {
        logger.error("Error updating score", { error });
        return NextResponse.json({ error: "Error updating score" }, { status: 500 });
    }
}
