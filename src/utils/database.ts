import prisma from "@/lib/prisma";
import { BasicComboWithWords } from "@/types/types";
import { dateNow } from "@/utils/date";
import { Guess, Score, User } from "@prisma/client";

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
            date: new Date(dateNow()),
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
            date: { equals: new Date(dateNow()) },
        },
    });
};

export const getTodaysGuess = (userId: number): Promise<Guess | null> => {
    return prisma.guess.findFirst({
        where: {
            userId,
            date: { equals: new Date(dateNow()) },
        },
    });
};

export const createNewGuess = (userId: number, word: string): Promise<Guess> => {
    return prisma.guess.create({
        data: {
            userId,
            words: [word],
            guesses: 1,
            date: new Date(dateNow()),
        },
    });
};

export const addToGuess = (id: number, word: string): Promise<Guess | null> => {
    return prisma.guess.update({
        where: { id },
        data: {
            words: { push: word },
            guesses: { increment: 1 },
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
            date: { equals: new Date(dateNow()) },
        },
        include: {
            user: true,
        },
    });
};

export const getScoreByUserIdsAndDate = (
    userIds: number[],
    date: Date
): Promise<ScoreWithUser[]> => {
    return prisma.score.findMany({
        where: {
            userId: { in: userIds },
            date: { equals: date },
        },
        include: {
            user: true,
        },
    });
};

export const getHighScoresByDate = (date: Date): Promise<ScoreWithUser[]> => {
    return prisma.score.findMany({
        where: {
            date: { equals: date },
        },
        include: {
            user: true,
        },
        orderBy: [
            {
                score: "desc",
            },
            {
                updatedAt: "asc",
            },
        ],
        take: 5,
    });
};

export const getUsersByPublicIdentifiers = (publicIdentifiers: string[]): Promise<User[]> => {
    return prisma.user.findMany({
        where: {
            publicIdentifier: { in: publicIdentifiers },
        },
    });
};

export const getCombo = async (id: number): Promise<BasicComboWithWords | null> => {
    const combo = await prisma.combo.findUnique({
        where: { id },
        include: {
            words: true,
        },
    });

    if (!combo) {
        return null;
    }

    const otherLetters = JSON.parse(combo.otherLetters as string) as string[];

    return {
        ...combo,
        otherLetters,
    };
};
