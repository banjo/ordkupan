import { PrismaClient } from "@prisma/client";

declare global {
    var prisma: PrismaClient;
}

const getDatabaseUrl = () => {
    const baseUrl = process.env.DATABASE_URL;
    if (!baseUrl) throw new Error("DATABASE_URL not set");

    const url = new URL(baseUrl);
    url.searchParams.set("connection_limit", "20");
    url.searchParams.set("pool_timeout", "10");
    return url.toString();
};

const createPrismaClient = () => {
    const client = new PrismaClient({
        datasources: {
            db: {
                url: getDatabaseUrl(),
            },
        },
    });

    return client;
};

let prisma: PrismaClient;

if (process.env.NODE_ENV === "production") {
    prisma = createPrismaClient();
} else {
    if (!global.prisma) {
        global.prisma = createPrismaClient();
    }
    prisma = global.prisma;
}

export default prisma;
