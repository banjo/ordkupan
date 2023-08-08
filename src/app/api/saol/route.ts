import { getWord, saolResponse } from "@/utils/saol";
import { NextResponse } from "next/server";

export type PostSaolBody = {
    word: string;
};

export type PostSaolResponse = saolResponse;

export async function POST(req: Request) {
    const body: PostSaolBody = await req.json();

    const { word } = body;

    if (!word) {
        return NextResponse.json({ error: "Word not provided" }, { status: 400 });
    }

    let saolResponse: PostSaolResponse | null = null;
    try {
        saolResponse = await getWord(word);
    } catch (error) {
        console.log(error);
        return NextResponse.json({ error: "Error fetching word" }, { status: 500 });
    }

    return NextResponse.json(saolResponse);
}
