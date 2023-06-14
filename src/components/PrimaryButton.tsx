import { FC, ReactNode } from "react";

type Props = {
    children: ReactNode;
    onClick: () => void;
    isDisabled: boolean;
};

export const PrimaryButton: FC<Props> = ({ children, onClick, isDisabled }) => {
    return (
        <button
            className="w-full
                            bg-primary text-white 
                            font-bold uppercase rounded 
                            px-4 py-2 mt-4
                            hover:opacity-90
                            disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={onClick}
            disabled={isDisabled}
        >
            {children}
        </button>
    );
};
