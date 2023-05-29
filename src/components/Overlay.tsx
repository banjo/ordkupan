import { FC, ReactNode } from "react";
import { FiX } from "react-icons/fi";

type Props = {
    show: boolean;
    close: () => void;
    children?: ReactNode;
};

export const Overlay: FC<Props> = ({ show, children, close }) => {
    return (
        <>
            <div
                className={`absolute left-0 right-0 top-0 z-20 h-full w-full max-w-sm transform 
                overflow-y-scroll
                bg-white px-8 py-16 
                transition-transform duration-500 
                ease-in-out ${show ? "" : "-translate-y-[200%]"}`}
            >
                <div className="absolute right-8 top-8 cursor-pointer" onClick={close}>
                    <FiX size={25} />
                </div>
                <div className="justify-top flex h-full w-full flex-col items-center gap-4">
                    {children}
                </div>
            </div>
        </>
    );
};
