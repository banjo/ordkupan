import { useRef } from "react";

type Out = {
    ref: React.RefObject<HTMLInputElement>;
    focus: () => void;
};

export const useInputFocus = (): Out => {
    const inputRef = useRef<HTMLInputElement>(null);

    const focus = () => {
        console.log(inputRef);
        setTimeout(() => {
            inputRef.current?.focus();
        }, 0);
    };

    return {
        ref: inputRef,
        focus: focus,
    };
};
