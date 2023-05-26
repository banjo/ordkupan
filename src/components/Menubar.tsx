import { shuffle } from "@banjoanton/utils";
// eslint-disable-next-line import/no-duplicates

import { FC, useMemo, useState } from "react";
import { FiX } from "react-icons/fi";
import { Combo } from "../types/types";
import { readableDate } from "../utils/date";
import { WordDisplay } from "./WordDisplay";

type Props = {
    previous: Combo;
};

export const Menubar: FC<Props> = ({ previous }) => {
    const [showPrevious, setShowPrevious] = useState(false);

    const today = readableDate(new Date());
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

    const handlePreviousWordClick = () => {
        setShowPrevious(prev => !prev);
    };

    const close = () => {
        setShowPrevious(prev => !prev);
    };

    return (
        <>
            <div
                className={`absolute left-0 right-0 top-0 z-20 h-full w-full max-w-sm transform 
                overflow-y-scroll
                bg-white px-8 py-16 transition-transform duration-500 
                ease-in-out ${showPrevious ? "" : "-translate-y-[200%]"}`}
            >
                <div className="absolute right-8 top-8 cursor-pointer" onClick={close}>
                    <FiX size={25} />
                </div>
                <div className="justify-top flex h-full w-full flex-col items-center gap-4">
                    <div className="flex flex-col items-center">
                        <div className="text-2xl font-bold uppercase">Gårdagens ord</div>
                        <div className="font-semi text-xl text-gray-600">{yesterday}</div>
                        <div className="mt-2">{letters}</div>
                    </div>
                    <div className="flex items-center justify-center pb-4">
                        <WordDisplay words={sortedWords} />
                    </div>
                </div>
            </div>
            <div className="mt-3 flex h-2 items-center justify-between font-light">
                <div>{today}</div>
                <div
                    className="align-center flex h-fit w-fit cursor-pointer items-center justify-center
                        py-1 text-sm text-gray-900 outline-none hover:text-gray-700"
                    onClick={handlePreviousWordClick}
                >
                    Gårdagens ord
                </div>
            </div>
        </>
    );
};
