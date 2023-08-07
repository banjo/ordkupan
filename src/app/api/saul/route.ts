import { getWord, SaulResponse } from "@/utils/saul";
import { NextResponse } from "next/server";

export type PostSaulBody = {
    word: string;
};

export type PostSaulResponse = SaulResponse;

export async function POST(req: Request) {
    const body: PostSaulBody = await req.json();

    const { word } = body;

    if (!word) {
        return NextResponse.json({ error: "Word not provided" }, { status: 400 });
    }

    let saulResponse: PostSaulResponse | null = null;
    try {
        saulResponse = await getWord(word);
    } catch (error) {
        console.log(error);
        return NextResponse.json({ error: "Error fetching word" }, { status: 500 });
    }

    return NextResponse.json(saulResponse);
}
