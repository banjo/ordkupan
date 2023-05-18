import { FC, useState } from "react";
import { IconType } from "react-icons/lib";

type Props = {
    text?: string;
    onClick: () => void;
    icon?: IconType;
};

export const Button: FC<Props> = ({ text, onClick, icon }) => {
    const [clicked, setClicked] = useState(false);

    const mouseUp = () => {
        setClicked(false);
    };

    const mouseDown = () => {
        onClick();
        setClicked(true);
        document.addEventListener("mouseup", mouseUp, { once: true });
    };

    return (
        <button
            type="button"
            className={`text-gray-900 border border-gray-300 outline-none
            ${clicked ? "bg-lighter" : "bg-white"}
            ${icon ? "p-3.5" : "px-8 py-3.5"}
            font-medium rounded-full text-sm
            flex items-center justify-center align-center`}
            onMouseDown={mouseDown}
        >
            {icon && <span>{icon({ size: 20 })}</span>}
            {icon ? "" : text}
        </button>
    );
};
