import { useThesaurusModalStore } from "@/stores/useThesarusModalStore";
import { capitalize } from "@banjoanton/utils";
import { FC } from "react";

type Props = {
    words: string[];
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
                        className="mr-2d ml-2 w-10/12 border-b border-black cursor-pointer hover:opacity-50"
                        key={index}
                        onClick={() => onClick(word)}
                    >
                        {capitalize(word)}
                    </div>
                ))}
            </div>
        </div>
    );
};
