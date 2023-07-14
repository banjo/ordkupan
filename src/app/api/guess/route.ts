import {
    addToGuess,
    createNewGuess,
    getTodaysGuess,
    getUserByUniqueIdentifier,
} from "@/utils/database";
import { NextResponse } from "next/server";

export type GuessExpectedBody = {
    word: string;
    userUniqueIdentifier: string;
};

export async function POST(req: Request) {
    const body: GuessExpectedBody = await req.json();

    if (!body.word || !body.userUniqueIdentifier) {
        return NextResponse.json({ error: "Bad request" }, { status: 400 });
    }

    const { word, userUniqueIdentifier } = body;

    try {
        const user = await getUserByUniqueIdentifier(userUniqueIdentifier);

        if (!user) {
            console.log("User not found");
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        const guessEntity = await getTodaysGuess(user.id);

        if (!guessEntity) {
            console.log("Guess not found, creating");
            await createNewGuess(user.id, word);
            return NextResponse.json({ success: true });
        }

        await addToGuess(guessEntity.id, word);
        return NextResponse.json({ success: true });
    } catch (error) {
        console.log(error);
        return NextResponse.json({ error: "Error updating guess" }, { status: 500 });
    }
}
