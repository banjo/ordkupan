import { PrismaClient, Score, User } from "@prisma/client";

const prisma = new PrismaClient();

export const getUsers = (): Promise<User[]> => {
    return prisma.user.findMany();
};

export const addUser = (name: string): Promise<User> => {
    return prisma.user.create({
        data: {
            name: name.trim().toLowerCase(),
        },
    });
};

export const getUserByName = (name: string): Promise<User | null> => {
    return prisma.user.findFirst({
        where: { name: name.trim().toLowerCase() },
    });
};

export const addScore = (userId: number, score: number, maxScore: number): Promise<Score> => {
    return prisma.score.create({
        data: {
            userId,
            score,
            maxScore,
        },
    });
};

export const setScore = (id: number, score: number): Promise<Score | null> => {
    return prisma.score.update({
        where: { id },
        data: { score },
    });
};

export const getTodaysScore = (userId: number): Promise<Score | null> => {
    return prisma.score.findFirst({
        where: {
            userId,
            date: { equals: new Date() },
        },
    });
};

export const getUserByUserId = (id: number): Promise<User | null> => {
    return prisma.user.findUnique({
        where: { id },
    });
};

export const getUserByUniqueIdentifier = (uniqueIdentifier: string): Promise<User | null> => {
    return prisma.user.findFirst({
        where: { uniqueIdentifier },
    });
};

export type ScoreWithUser = Score & {
    user: User;
};

export const getTodaysScoreByUserIds = (userIds: number[]): Promise<ScoreWithUser[]> => {
    return prisma.score.findMany({
        where: {
            userId: { in: userIds },
            date: { equals: new Date() },
        },
        include: {
            user: true,
        },
    });
};

export const getUsersByPublicIdentifiers = (publicIdentifiers: string[]): Promise<User[]> => {
    return prisma.user.findMany({
        where: {
            publicIdentifier: { in: publicIdentifiers },
        },
    });
};
