import { Dispatch, useRef, useState } from "react";

export type DisableFocus = Dispatch<React.SetStateAction<boolean>>;

type Out = {
    ref: React.RefObject<HTMLInputElement>;
    focus: () => void;
    setDisableFocus: DisableFocus;
};

export const useInputFocus = (): Out => {
    const inputRef = useRef<HTMLInputElement>(null);
    const [disable, setDisableFocus] = useState(false);

    const focus = () => {
        if (disable) {
            return;
        }
        setTimeout(() => {
            inputRef.current?.focus();
        }, 0);
    };

    return {
        ref: inputRef,
        focus: focus,
        setDisableFocus,
    };
};
