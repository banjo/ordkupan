"use client";

import { FC } from "react";

type Props = {
    text: string;
    color: string;
    textColor: string;
    className?: string;
    onClick: (char: string) => void;
};

export const Hexagon: FC<Props> = ({ text, color, textColor, className, onClick }) => {
    const handleClick = () => {
        onClick(text);
    };

    return (
        <div className={`transform scale-[40%] uppercase ${className}`} onClick={handleClick}>
            <svg
                version="1.1"
                xmlns="http://www.w3.org/2000/svg"
                width="200"
                height="174"
                viewBox="0 0 200 173.20508075688772"
            >
                <path
                    fill={color}
                    d="M0 86.60254037844386L50 0L150 0L200 86.60254037844386L150 173.20508075688772L50 173.20508075688772Z"
                ></path>

                <text
                    x="50%"
                    y="50%"
                    dominantBaseline="middle"
                    textAnchor="middle"
                    fill={textColor}
                    fontSize="80"
                    fontWeight="bold"
                >
                    {text}
                </text>
            </svg>
        </div>
    );
};
