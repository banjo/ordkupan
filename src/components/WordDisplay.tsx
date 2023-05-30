import { capitalize } from "@banjoanton/utils";
import { FC } from "react";

type Props = {
    words: string[];
};

export const WordDisplay: FC<Props> = ({ words }) => {
    return (
        <div className="mt-4 grid grid-cols-2 gap-2 text-xl">
            {[...words].reverse().map((word, index) => (
                <div className="mr-2d ml-2 w-10/12 border-b border-black" key={index}>
                    {capitalize(word)}
                </div>
            ))}
        </div>
    );
};
