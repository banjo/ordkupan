import { getUserByName } from "@/utils/database";
import { User } from "@prisma/client";
import { NextResponse } from "next/server";

export type PostFriendNameBody = {
    name: string;
};

export type PostFriendNameResponse = {
    publicIdentifier: string;
};

export async function POST(req: Request) {
    const body: PostFriendNameBody = await req.json();

    const { name } = body;

    if (!name) {
        return NextResponse.json({ error: "Name is required" }, { status: 400 });
    }

    let user: User | null;
    try {
        user = await getUserByName(name);
    } catch (error: any) {
        console.log(error);
        return NextResponse.json({ error: "Error fetching user by name" }, { status: 500 });
    }

    if (!user) {
        return NextResponse.json({ error: "Error fetching user" }, { status: 500 });
    }

    return NextResponse.json({ publicIdentifier: user.publicIdentifier });
}
