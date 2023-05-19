"use client";

import { FC, useState } from "react";

type Props = {
    text: string;
    color: string;
    clickedColor?: string;
    textColor: string;
    className?: string;
    onClick: (char: string) => void;
    fadeOut: boolean;
};

export const Hexagon: FC<Props> = ({
    text,
    color,
    textColor,
    className,
    onClick,
    clickedColor,
    fadeOut,
}) => {
    const [clicked, setClicked] = useState(false);

    const mouseUp = () => {
        setClicked(false);
    };

    const mouseDown = () => {
        onClick(text);
        setClicked(true);

        document.addEventListener("mouseup", mouseUp, { once: true });
    };

    return (
        <div
            className={`transform uppercase cursor-pointer
                        ${clicked ? "scale-[50%]" : " scale-[53%]"}
                        transition-scale duration-100 ease-in-out 
                        ${className}`}
            onMouseDown={mouseDown}
        >
            <svg
                fill={clicked && clickedColor ? clickedColor : color}
                height="200px"
                width="200px"
                version="1.1"
                id="Capa_1"
                xmlns="http://www.w3.org/2000/svg"
                xmlnsXlink="http://www.w3.org/1999/xlink"
                viewBox="0 0 184.751 184.751"
                xmlSpace="preserve"
            >
                <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
                <g id="SVGRepo_iconCarrier">
                    <path d="M0,92.375l46.188-80h92.378l46.185,80l-46.185,80H46.188L0,92.375z"></path>
                    <text
                        x="50%"
                        y="55%"
                        dominantBaseline="middle"
                        textAnchor="middle"
                        fill={textColor}
                        fontSize="60"
                        fontWeight="500"
                        className={`${fadeOut ? "opacity-0" : "opacity-100"}
                    transition-opacity duration-500 ease-in-out`}
                    >
                        {text}
                    </text>
                </g>
            </svg>
        </div>
    );
};
