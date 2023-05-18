"use client";

import { FC, useState } from "react";

type Props = {
    text: string;
    color: string;
    clickedColor?: string;
    textColor: string;
    className?: string;
    onClick: (char: string) => void;
};

export const Hexagon: FC<Props> = ({
    text,
    color,
    textColor,
    className,
    onClick,
    clickedColor,
}) => {
    const [clicked, setClicked] = useState(false);

    const mouseUp = () => {
        setClicked(false);
    };

    const mouseDown = () => {
        onClick(text);
        setClicked(true);

        document.addEventListener(
            "mouseup",
            () => {
                setClicked(false);
            },
            { once: true }
        );
    };

    return (
        <div
            className={`transform uppercase cursor-pointer
                        ${clicked ? "scale-[50%]" : " scale-[53%]"}
                        transition duration-100 ease-in-out 
                        ${className}`}
            onMouseDown={mouseDown}
            onMouseUp={mouseUp}
        >
            <svg
                version="1.1"
                xmlns="http://www.w3.org/2000/svg"
                width="200"
                height="174"
                viewBox="0 0 200 173.20508075688772"
            >
                <path
                    fill={clicked && clickedColor ? clickedColor : color}
                    d="M0 86.60254037844386L50 0L150 0L200 86.60254037844386L150 173.20508075688772L50 173.20508075688772Z"
                ></path>

                <text
                    x="50%"
                    y="55%"
                    dominantBaseline="middle"
                    textAnchor="middle"
                    fill={textColor}
                    fontSize="60"
                    fontWeight="500"
                >
                    {text}
                </text>
            </svg>
        </div>
    );
};
