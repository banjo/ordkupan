import { User } from "@prisma/client";
import { NextResponse } from "next/server";
import {
    ScoreWithUser,
    getTodaysScoreByUserIds,
    getUsersByPublicIdentifiers,
} from "../../../utils/database";

export type PostFriendBody = {
    friends: string[];
};

export type PublicScore = {
    score: number;
    name: string;
};

export type PostFriendResponse = {
    score: PublicScore[];
};

export async function POST(req: Request) {
    const body: PostFriendBody = await req.json();

    const { friends } = body;

    if (!friends) {
        return NextResponse.json({ error: "Friends not provided" }, { status: 400 });
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
        scores = await getTodaysScoreByUserIds(userIds);
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
            };
        }

        return {
            score: score.score ?? 0,
            name: user.name,
        };
    });

    return NextResponse.json({ score: publicScores });
}
