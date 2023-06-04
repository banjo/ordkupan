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
            spellCheck="false"
            onChange={event => setWord(event.target.value.toLowerCase())}
            className="h-14 w-80 select-none border-none
                            bg-white text-center text-3xl
                            font-bold uppercase text-black
                            caret-primary
                            outline-none"
            onKeyDown={keyDown}
        />
    );
};

export const InputField = forwardRef(InputFieldComponent);
