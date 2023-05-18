import { FC } from "react";
import { Hexagon } from "./Hexagon";

type Props = {
    mainLetter: string;
    otherLetters: string[];
    onClick: (char: string) => void;
};

const hexGridPositions = [
    "absolute left-[70px] top-[40px]",
    "absolute left-[70px] bottom-[40px]",
    "absolute left-[0px] top-[80px]",
    "absolute right-[70px] top-[40px]",
    "absolute right-[70px] bottom-[40px]",
    "absolute right-[0px] bottom-[80px]",
];

export const Hexgrid: FC<Props> = ({ mainLetter, otherLetters, onClick }) => {
    const handleClick = (char: string) => {
        onClick(char);
    };

    return (
        <div className="relative flex justify-center items-center mt-14">
            <Hexagon text={mainLetter} color="yellow" textColor="black" onClick={handleClick} />
            {otherLetters.map((letter, index) => (
                <Hexagon
                    key={index}
                    text={letter}
                    color="white"
                    textColor="black"
                    onClick={handleClick}
                    className={hexGridPositions[index] || "absolute"}
                />
            ))}
        </div>
    );
};
