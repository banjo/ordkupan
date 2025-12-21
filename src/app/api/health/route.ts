import { NextResponse } from "next/server";
import { isDatabaseHealthy } from "@/utils/database";

export async function GET() {
    const isHealthy = await isDatabaseHealthy();

    if (!isHealthy) {
        return NextResponse.json({ status: "error" }, { status: 500 });
    }

    return NextResponse.json({ status: "ok" });
}
