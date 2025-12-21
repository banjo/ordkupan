import { addUser } from "@/utils/database";
import { User } from "@prisma/client";
import { NextResponse } from "next/server";
import { createLogger } from "@/lib/logger";

export type PostUserResponse = {
    uniqueIdentifier: string;
};

const logger = createLogger("api/user");

export async function POST(req: Request) {
    logger.info("POST /api/user called");
    const body = await req.json();

    const { name } = body;

    if (!name) {
        logger.error("Name is required in request body", { body });
        return NextResponse.json({ error: "Name is required" }, { status: 400 });
    }

    let user: User;
    try {
        user = await addUser(name);
        logger.debug("User added", { name, user });
    } catch (error: any) {
        if (error?.message?.includes("Unique constraint failed")) {
            logger.error("Name already exists", { name });
            return NextResponse.json({ error: "Name already exists" }, { status: 409 });
        }
        logger.error("Error creating user", { error });
        return NextResponse.json({ error: "Error creating user" }, { status: 500 });
    }

    if (!user) {
        logger.error("User creation failed unexpectedly", { name });
        return NextResponse.json({ error: "Error creating user" }, { status: 500 });
    }

    const response: PostUserResponse = {
        uniqueIdentifier: user.uniqueIdentifier,
    };

    logger.info("Returning user unique identifier", { uniqueIdentifier: user.uniqueIdentifier });
    return NextResponse.json(response);
}
