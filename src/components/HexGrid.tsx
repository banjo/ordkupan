import { FC } from "react";
import { getCustomColors } from "../utils/tailwind";
import { Hexagon } from "./Hexagon";

type Props = {
    mainLetter: string;
    otherLetters: string[];
    onClick: (char: string) => void;
    fadeOut: boolean;
};

const hexGridPositions = [
    "absolute left-[87px] bottom-[50px]",
    "absolute left-[87px] top-[50px]",
    "absolute left-[0px] top-[100px]",
    "absolute right-[87px] top-[50px]",
    "absolute right-[87px] bottom-[50px]",
    "absolute right-[0px] bottom-[100px]",
];

export const Hexgrid: FC<Props> = ({ mainLetter, otherLetters, onClick, fadeOut }) => {
    const { light, lighter, primary, primaryDark } = getCustomColors();

    const handleClick = (char: string) => {
        onClick(char);
    };

    return (
        <div className="relative flex justify-center items-center my-24 w-[200px] h-[174px]">
            <Hexagon
                text={mainLetter}
                color={primary}
                clickedColor={primaryDark}
                textColor="black"
                onClick={handleClick}
                fadeOut={fadeOut}
            />
            {otherLetters.map((letter, index) => (
                <Hexagon
                    key={index}
                    text={letter}
                    color={lighter}
                    clickedColor={light}
                    textColor="black"
                    onClick={handleClick}
                    className={hexGridPositions[index]}
                    fadeOut={fadeOut}
                />
            ))}
        </div>
    );
};
