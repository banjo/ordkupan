import React, { Dispatch, forwardRef, ForwardRefRenderFunction } from "react";

type Props = {
    word: string;
    setWord: Dispatch<React.SetStateAction<string>>;
    submitWord: () => void;
};

const InputFieldComponent: ForwardRefRenderFunction<HTMLInputElement, Props> = (
    { word, setWord, submitWord },
    ref
) => {
    const keyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === "Enter") {
            submitWord();
        }
    };

    return (
        <input
            autoFocus
            type="text"
            ref={ref}
            value={word}
            max={15}
            inputMode="none"
            onChange={event => setWord(event.target.value.toUpperCase())}
            className="h-16 w-80 border-none bg-white
                            text-center text-3xl font-bold
                            text-black caret-primary
                            outline-none"
            onKeyDown={keyDown}
        />
    );
};

export const InputField = forwardRef(InputFieldComponent);