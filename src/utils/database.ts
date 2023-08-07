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

export const addScore = ({
    userId,
    score,
    maxScore,
    matchedWords,
}: {
    userId: number;
    score: number;
    maxScore: number;
    matchedWords: string[];
}): Promise<Score> => {
    return prisma.score.create({
        data: {
            userId,
            score,
            maxScore,
            words: matchedWords,
            date: new Date(dateNow()),
        },
    });
};

export const setScoreAndWords = (
    id: number,
    score: number,
    words: string[]
): Promise<Score | null> => {
    return prisma.score.update({
        where: { id },
        data: { score, words },
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

export const getScoreAmountBetterThanScore = (
    score: number,
    date: Date
): Promise<number | null> => {
    return prisma.score.count({
        where: {
            score: { gt: score },
            date: { equals: date },
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

// stats

export const getDaysPlayed = async (userId: number) => {
    return await prisma.score.count({
        where: {
            userId,
        },
    });
};

export const getTotalWins = async (userId: number) => {
    const userScores = await prisma.score.findMany({
        where: {
            userId: userId,
        },
        select: {
            date: true,
            score: true,
        },
        orderBy: {
            date: "asc",
        },
    });

    let wins = 0;

    for (const userScore of userScores) {
        const topScore = await prisma.score.findFirst({
            where: {
                date: userScore.date,
            },
            orderBy: {
                score: "desc",
            },
            select: {
                score: true,
            },
        });

        if (!topScore) {
            continue;
        }

        if (topScore.score === userScore.score) {
            wins++;
        }
    }

    return wins;
};

export const getTotalGuesses = async (userId: number) => {
    const guesses = await prisma.guess.findMany({
        where: {
            userId,
        },
        select: {
            guesses: true,
        },
    });

    let totalGuesses = 0;

    for (const guess of guesses) {
        totalGuesses += guess.guesses;
    }

    return totalGuesses;
};
