import { getUserByName } from "@/utils/database";
import { User } from "@prisma/client";
import { NextResponse } from "next/server";
import { createLogger } from "@/lib/logger";

export type PostFriendNameBody = {
    name: string;
};

export type PostFriendNameResponse = {
    publicIdentifier: string;
};

const logger = createLogger("api/friends/name");

export async function POST(req: Request) {
    logger.info("POST /api/friends/name called");
    const body: PostFriendNameBody = await req.json();

    const { name } = body;

    if (!name) {
        logger.error("Name is required in request body", { body });
        return NextResponse.json({ error: "Name is required" }, { status: 400 });
    }

    let user: User | null;
    try {
        user = await getUserByName(name);
        logger.debug("Fetched user by name", { name, user });
    } catch (error: any) {
        logger.error("Error fetching user by name", { error });
        return NextResponse.json({ error: "Error fetching user by name" }, { status: 500 });
    }

    if (!user) {
        logger.error("No user found for provided name", { name });
        return NextResponse.json({ error: "Error fetching user" }, { status: 500 });
    }

    logger.info("Returning public identifier for user", {
        publicIdentifier: user.publicIdentifier,
    });
    return NextResponse.json({ publicIdentifier: user.publicIdentifier });
}
