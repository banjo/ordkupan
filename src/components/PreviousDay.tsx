import { PostWordsResponse } from "@/app/api/words/route";
import { Word, WordColor, WordDisplay } from "@/components/WordDisplay";
import { useSimpleFetch } from "@/hooks/useSimpleFetch";
import { useSocialStore } from "@/stores/useSocialStore";
import { BasicCombo } from "@/types/types";
import { readableDate } from "@/utils/date";
import { Temporal } from "@js-temporal/polyfill";
import { FC, useMemo } from "react";

type Props = {
    previous: BasicCombo;
};

const createWords = (words: string[], color: WordColor) => {
    return words.map(w => {
        return {
            word: w,
            color,
        };
    });
};

export const PreviousDay: FC<Props> = ({ previous }) => {
    const { id } = useSocialStore();
    const yesterday = Temporal.Now.plainDateISO("Europe/Stockholm").add({ days: -1 }).toString();

    const { data: previousDayWordsResponse } = useSimpleFetch<PostWordsResponse>({
        url: `/api/words/`,
        method: "POST",
        body: {
            date: yesterday,
            internalIdentifier: id,
        },
        dependsOn: [id],
    });

    const preparedWords = useMemo<Word[]>(() => {
        const sorted = previous.allWords.map(w => w.word).sort((a, b) => b.length - a.length);

        if (previousDayWordsResponse === null) return createWords(sorted, "neutral");

        if (previousDayWordsResponse.words.length === 0) return createWords(sorted, "neutral");

        return sorted.map(w => {
            const exists = previousDayWordsResponse.words.find(pw => pw === w);

            return {
                word: w,
                color: exists ? "green" : "red",
            };
        });
    }, [previous.allWords, previousDayWordsResponse]);

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
                <WordDisplay words={preparedWords} />
            </div>
        </>
    );
};
