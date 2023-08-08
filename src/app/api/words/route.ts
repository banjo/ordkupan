import { getUserByUniqueIdentifier, getUsersWordsByDate } from "@/utils/database";
import { NextResponse } from "next/server";

export type PostWordsBody = {
    date: string;
    internalIdentifier: string;
};

export type PostWordsResponse = {
    words: string[];
};

export async function POST(req: Request) {
    const body: PostWordsBody = await req.json();

    const { date, internalIdentifier } = body;

    if (!date) {
        return NextResponse.json({ error: "Date not provided" }, { status: 400 });
    }

    if (!internalIdentifier) {
        return NextResponse.json({ error: "Internal identifier not provided" }, { status: 400 });
    }

    const user = await getUserByUniqueIdentifier(internalIdentifier);

    if (!user) {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const userId = user.id;

    let words: string[] = [];
    try {
        words = await getUsersWordsByDate(userId, date);
    } catch (error) {
        console.log(error);
        return NextResponse.json({ error: "Error fetching words" }, { status: 500 });
    }

    return NextResponse.json({
        words,
    });
}
