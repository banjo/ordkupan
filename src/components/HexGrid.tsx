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
    "relative left-[87px] bottom-[50px]",
    "relative left-[87px] top-[50px]",
    "relative left-[0px] top-[100px]",
    "relative right-[87px] top-[50px]",
    "relative right-[87px] bottom-[50px]",
    "relative right-[0px] bottom-[100px]",
];

export const Hexgrid: FC<Props> = ({ mainLetter, otherLetters, onClick, fadeOut }) => {
    const { light, lighter, primary, primaryDark } = getCustomColors();

    const handleClick = (char: string) => {
        onClick(char);
    };

    return (
        <div className="relative mb-20 mt-14 grid grid-cols-1">
            <Hexagon
                text={mainLetter}
                color={primary}
                clickedColor={primaryDark}
                textColor="black"
                onClick={handleClick}
                fadeOut={fadeOut}
                className={"hexagon"}
            />
            {otherLetters.map((letter, index) => (
                <Hexagon
                    key={index}
                    text={letter}
                    color={lighter}
                    clickedColor={light}
                    textColor="black"
                    onClick={handleClick}
                    className={`hexagon ${hexGridPositions[index]}`}
                    fadeOut={fadeOut}
                />
            ))}
        </div>
    );
};
