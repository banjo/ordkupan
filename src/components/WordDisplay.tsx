import { capitalize } from "@banjoanton/utils";
import { FC } from "react";

type Props = {
    words: string[];
};

export const WordDisplay: FC<Props> = ({ words }) => {
    return (
        <div className="mt-4 flex flex-row flex-wrap justify-around gap-y-3 text-xl">
            {[...words].reverse().map((word, index) => (
                <div className="w-5/12 border-b border-black pl-4" key={index}>
                    {capitalize(word)}
                </div>
            ))}
        </div>
    );
};
