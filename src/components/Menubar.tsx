import { shuffle } from "@banjoanton/utils";
// eslint-disable-next-line import/no-duplicates

import { FC, useMemo, useState } from "react";
import { Combo } from "../types/types";
import { readableDate } from "../utils/date";
import { Overlay } from "./Overlay";
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
        setShowPrevious(true);
    };

    const close = () => {
        setShowPrevious(false);
    };

    return (
        <>
            <Overlay show={showPrevious} close={close}>
                <div className="flex flex-col items-center">
                    <div className="text-2xl font-bold uppercase">Gårdagens ord</div>
                    <div className="font-semi text-xl text-gray-600">{yesterday}</div>
                    <div className="mt-2">{letters}</div>
                </div>
                <div className="flex items-center justify-center pb-4">
                    <WordDisplay words={sortedWords} />
                </div>
            </Overlay>

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
