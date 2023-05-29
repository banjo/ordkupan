import { shuffle } from "@banjoanton/utils";
import { FC, useMemo } from "react";
import { Combo } from "../types/types";
import { readableDate } from "../utils/date";
import { WordDisplay } from "./WordDisplay";

type Props = {
    previous: Combo;
};

export const PreviousDay: FC<Props> = ({ previous }) => {
    const yesterday = readableDate(new Date(Date.now() - 86_400_000));

    const sortedWords = useMemo(() => {
        return previous.words.map(w => w.word).sort((a, b) => b.length - a.length);
    }, [previous]);

    const letters = useMemo(() => {
        return (
            <div className="flex gap-2 font-bold uppercase">
                <div className="text-primaryDark">{previous.mainLetter}</div>
                {shuffle(previous.otherLetters).map((letter, index) => (
                    <div key={index}>{letter}</div>
                ))}
            </div>
        );
    }, [previous.mainLetter, previous.otherLetters]);

    return (
        <>
            <div className="flex flex-col items-center">
                <div className="text-2xl font-bold uppercase">Gårdagens ord</div>
                <div className="font-semi text-xl text-gray-600">{yesterday}</div>
                <div className="mt-2">{letters}</div>
            </div>
            <div className="flex items-center justify-center pb-4">
                <WordDisplay words={sortedWords} />
            </div>
        </>
    );
};
