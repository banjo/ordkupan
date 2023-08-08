import { useThesaurusModalStore } from "@/stores/useThesarusModalStore";
import { capitalize } from "@banjoanton/utils";
import { FC } from "react";

export type WordColor = "red" | "green" | "neutral";

export type Word = {
    word: string;
    color: WordColor;
};

type Props = {
    words: Word[];
};

const mapColors = {
    red: "text-red-600",
    green: "text-green-600",
    neutral: "",
};

export const WordDisplay: FC<Props> = ({ words }) => {
    const { setShow, setWord } = useThesaurusModalStore();

    const onClick = (word: string) => {
        setWord(word);
        setShow(true);
    };

    return (
        <div className="flex flex-col mt-2">
            <p className="text-xs text-gray-600 text-center">
                Klicka på ordet för att läsa definitionen
            </p>

            <div className="mt-4 grid grid-cols-2 gap-2 text-xl">
                {[...words].reverse().map((word, index) => (
                    <div
                        className={`mr-2d ml-2 w-10/12 border-b 
                        border-black cursor-pointer hover:opacity-50
                        ${mapColors[word.color]}`}
                        key={index}
                        onClick={() => onClick(word.word)}
                    >
                        {capitalize(word.word)}
                    </div>
                ))}
            </div>
        </div>
    );
};
