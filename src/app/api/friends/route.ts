import { PublicScore } from "@/types/types";
import {
    getScoreByUserIdsAndDate,
    getUsersByPublicIdentifiers,
    ScoreWithUser,
} from "@/utils/database";
import { User } from "@prisma/client";
import { NextResponse } from "next/server";

export type PostFriendBody = {
    friends: string[];
    date: string;
};

export type PostFriendResponse = {
    score: PublicScore[];
    maxScore: number;
};

export async function POST(req: Request) {
    const body: PostFriendBody = await req.json();

    const { friends, date } = body;

    if (!friends || !date) {
        return NextResponse.json({ error: "Friends or date not provided" }, { status: 400 });
    }

    let users: User[] | null;
    try {
        users = await getUsersByPublicIdentifiers(friends);
    } catch (error: any) {
        console.log(error);
        return NextResponse.json({ error: "Error fetching friends" }, { status: 500 });
    }

    if (!users) {
        return NextResponse.json({ error: "Error fetching friends" }, { status: 500 });
    }

    const userIds = users.map(u => u.id);

    let scores: ScoreWithUser[] = [];
    try {
        scores = await getScoreByUserIdsAndDate(userIds, new Date(date));
    } catch (error) {
        console.log(error);
        return NextResponse.json({ error: "Error fetching scores" }, { status: 500 });
    }

    const publicScores: PublicScore[] = users.map(user => {
        const score = scores.find(s => s.userId === user.id);

        if (!score) {
            return {
                score: 0,
                name: user.name,
                publicIdentifier: user.publicIdentifier,
            };
        }

        return {
            score: score.score ?? 0,
            name: user.name,
            publicIdentifier: user.publicIdentifier,
        };
    });

    return NextResponse.json({ score: publicScores, maxScore: scores[0]?.maxScore });
}
