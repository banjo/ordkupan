import { NextResponse } from "next/server";
import { isDatabaseHealthy } from "@/utils/database";
import { createLogger } from "@/lib/logger";

const logger = createLogger("api/health");

export async function GET() {
    logger.info("Health check requested");
    const isHealthy = await isDatabaseHealthy();

    if (!isHealthy) {
        logger.error("Database health check failed");
        return NextResponse.json({ status: "error" }, { status: 500 });
    }

    return NextResponse.json({ status: "ok" });
}
