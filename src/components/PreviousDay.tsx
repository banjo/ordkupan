import { WordDisplay } from "@/components/WordDisplay";
import { BasicComboWithWords } from "@/types/types";
import { readableDate } from "@/utils/date";
import { Temporal } from "@js-temporal/polyfill";
import { FC, useMemo } from "react";

type Props = {
    previous: BasicComboWithWords;
};

export const PreviousDay: FC<Props> = ({ previous }) => {
    const yesterday = Temporal.Now.plainDateISO("Europe/Stockholm").add({ days: -1 }).toString();

    const sortedWords = useMemo(() => {
        return previous.words.map(w => w.word).sort((a, b) => b.length - a.length);
    }, [previous]);

    const letters = useMemo(() => {
        return (
            <div className="flex gap-2 font-bold uppercase">
                <div className="text-primaryDark">{previous.mainLetter}</div>
                {previous.otherLetters.map((letter, index) => (
                    <div key={index}>{letter}</div>
                ))}
            </div>
        );
    }, [previous.mainLetter, previous.otherLetters]);

    return (
        <>
            <div className="flex flex-col items-center">
                <div className="text-2xl font-bold uppercase">Gårdagens ord</div>
                <div className="font-semi text-xl text-gray-600">
                    {readableDate(new Date(yesterday))}
                </div>
                <div className="mt-2">{letters}</div>
            </div>
            <div className="flex items-center justify-center pb-4">
                <WordDisplay words={sortedWords} />
            </div>
        </>
    );
};
