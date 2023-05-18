import { FC, useState } from "react";
import { IconType } from "react-icons/lib";

type Props = {
    text: string;
    onClick: () => void;
    icon?: IconType;
};

const getStyle = (
    clicked: boolean,
    hasIcon: boolean
) => `text-gray-900 bg-white border border-gray-300 outline-none 
${clicked ? "bg-lighter" : "bg-white"}
${hasIcon ? "p-3.5" : "px-8 py-3.5"}
font-medium rounded-full text-sm
flex items-center justify-center align-center`;

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
        <button type="button" className={getStyle(clicked, Boolean(icon))} onMouseDown={mouseDown}>
            {icon && <span>{icon({ size: 20 })}</span>}
            {icon ? "" : text}
        </button>
    );
};
