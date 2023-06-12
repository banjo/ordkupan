import { User } from "@prisma/client";
import { NextResponse } from "next/server";
import { addUser } from "../../../utils/database";

export type PostUserResponse = {
    uniqueIdentifier: string;
};

export async function POST(req: Request) {
    const body = await req.json();

    const { name } = body;

    if (!name) {
        return NextResponse.json({ error: "Name is required" }, { status: 400 });
    }

    let user: User;
    try {
        user = await addUser(name);
    } catch (error: any) {
        if (error?.message?.includes("Unique constraint failed")) {
            return NextResponse.json({ error: "Name already exists" }, { status: 409 });
        }
        console.log(error);
        return NextResponse.json({ error: "Error creating user" }, { status: 500 });
    }

    if (!user) {
        return NextResponse.json({ error: "Error creating user" }, { status: 500 });
    }

    const response: PostUserResponse = {
        uniqueIdentifier: user.uniqueIdentifier,
    };

    return NextResponse.json(response);
}
