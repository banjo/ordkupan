import { getWord, saolResponse } from "@/utils/saol";
import { NextResponse } from "next/server";
import { createLogger } from "@/lib/logger";

export type PostSaolBody = {
    word: string;
};

export type PostSaolResponse = saolResponse;

const logger = createLogger("api/saol");

export async function POST(req: Request) {
    logger.info("POST /api/saol called");
    const body: PostSaolBody = await req.json();

    const { word } = body;

    if (!word) {
        logger.error("Word not provided in request body", { body });
        return NextResponse.json({ error: "Word not provided" }, { status: 400 });
    }

    let saolResponse: PostSaolResponse | null = null;
    try {
        saolResponse = await getWord(word);
        logger.debug("Fetched word from SAOL", { word, saolResponse });
    } catch (error) {
        logger.error("Error fetching word from SAOL", { error });
        return NextResponse.json({ error: "Error fetching word" }, { status: 500 });
    }

    logger.info("Returning SAOL response", { word });
    return NextResponse.json(saolResponse);
}
