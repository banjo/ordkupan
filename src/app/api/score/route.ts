import { NextResponse } from "next/server";
import { getCombos } from "../../../utils/combo";
import {
    addScore,
    getTodaysScore,
    getUserByUniqueIdentifier,
    setScore,
} from "../../../utils/database";
import { validate } from "../../../utils/validation";

export type PostScoreExpectedBody = {
    userUniqueIdentifier: string;
    score: number;
    maxScore: number;
    matchedWords: string[];
};

export async function POST(req: Request) {
    const body: PostScoreExpectedBody = await req.json();

    if (!body.matchedWords || !body.maxScore || !body.score || !body.userUniqueIdentifier) {
        return NextResponse.json({ error: "Bad request" }, { status: 400 });
    }

    const { userUniqueIdentifier, score, maxScore, matchedWords } = body;

    const [combo] = await getCombos();
    const allWords = combo.words;

    const mappedWords = matchedWords.map(word => {
        const res = allWords.find(w => w.word === word);

        if (!res) {
            return null;
        }

        return res;
    });

    if (mappedWords.includes(null)) {
        console.log("Invalid words");
        return NextResponse.json({ error: "Invalid words" }, { status: 400 });
    }

    const isValid = validate({
        allWords,
        matchedWords,
        maxScore,
        score,
    });

    if (!isValid) {
        console.log("Invalid score");
        return NextResponse.json({ error: "Invalid score" }, { status: 400 });
    }

    try {
        const user = await getUserByUniqueIdentifier(userUniqueIdentifier);

        if (!user) {
            console.log("User not found");
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        const scoreEntity = await getTodaysScore(user.id);

        if (!scoreEntity) {
            console.log("Score not found, creating");
            await addScore(user.id, score, maxScore);
            return NextResponse.json({ success: true });
        }

        await setScore(scoreEntity.id, score);
        return NextResponse.json({ success: true });
    } catch (error) {
        console.log(error);
        return NextResponse.json({ error: "Error updating score" }, { status: 500 });
    }
}
