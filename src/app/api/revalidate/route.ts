import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";
import { createLogger } from "@/lib/logger";

export const runtime = "edge";

const logger = createLogger("api/revalidate");

export function GET(request: NextRequest) {
    logger.info("GET /api/revalidate called");
    const path = request.nextUrl.searchParams.get("path") || "/";
    logger.debug("Revalidating path", { path });
    revalidatePath(path);
    logger.info("Revalidation complete", { path });
    return NextResponse.json({ revalidated: true, now: Date.now() });
}
