import { capitalize } from "@banjoanton/utils";
import { FC, useMemo, useState } from "react";
import { FiChevronDown } from "react-icons/fi";

type Props = {
    words: string[];
};

const Words = ({ words }: Props) => {
    const str = words.map(w => capitalize(w)).join("  ");
    return <div className="overflow-hidden text-ellipsis whitespace-nowrap">{str}</div>;
};

export const WordField: FC<Props> = ({ words }) => {
    const [active, setActive] = useState(false);
    const [upperClasses, setUpperClasses] = useState("border rounded");
    const [lowerClasses, setLowerClasses] = useState("");

    const hasWords = words.length > 0;

    const onClick = () => {
        if (active) {
            setUpperClasses("border rounded");
            setLowerClasses("");
        } else {
            setUpperClasses("border-x border-t rounded-t");
            setLowerClasses("border-x border-b rounded-b");
        }
        setActive(prev => !prev);
    };

    const title = useMemo(() => {
        if (!hasWords && active) return "Du har ej hittat några ord";

        if (!hasWords) return "Dina ord...";

        if (active) return `Du har hittat ${words.length} ord`;

        return <Words words={words} />;
    }, [active, hasWords, words]);

    return (
        <div className="relative">
            <div
                className={`flex h-14 w-full items-center justify-between 
                border-gray-300 px-4
                ${upperClasses}`}
                onClick={onClick}
            >
                <div
                    className={`flex w-11/12 items-center 
                    ${hasWords ? "text-black" : "text-gray-300"}`}
                >
                    {title}
                </div>
                <div
                    className={`flex h-5 w-5
            origin-center items-center justify-center transition-transform
            duration-200 ease-in-out
            ${active && "rotate-180"}`}
                >
                    <FiChevronDown size={20} />
                </div>
            </div>

            <div
                className={`absolute left-0 right-0
                    ${active ? "h-[500px]" : "h-0"}
                    transition-height
                    z-10 overflow-y-scroll border-gray-300
                    ${lowerClasses}
                    bg-white duration-200 ease-in-out`}
            >
                {active && (
                    <div className=" mt-4 flex flex-row flex-wrap gap-y-3 text-xl">
                        {words.map((word, index) => (
                            <div className="w-1/2 pl-4" key={index}>
                                {capitalize(word)}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};
