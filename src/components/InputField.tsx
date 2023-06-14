import { motion } from "framer-motion";
import React, { Dispatch, forwardRef, ForwardRefRenderFunction } from "react";
import { useGlobalInputFocus } from "../hooks/useGlobalInputFocus";

type Props = {
    word: string;
    setWord: Dispatch<React.SetStateAction<string>>;
    submitWord: () => Promise<boolean>;
    isWrongGuess: boolean;
};

const InputFieldComponent: ForwardRefRenderFunction<HTMLInputElement, Props> = ({
    word,
    setWord,
    submitWord,
    isWrongGuess,
}) => {
    const { setInputRef } = useGlobalInputFocus();

    const keyDown = async (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === "Enter") {
            await submitWord();
        }
    };

    return (
        <motion.input
            autoFocus
            type="text"
            ref={r => {
                if (r) setInputRef(r);
            }}
            value={word}
            max={15}
            inputMode="none"
            spellCheck="false"
            variants={{
                wrong: { rotate: [0, 10, 0, -10, 0] },
                normal: {},
            }}
            transition={{ duration: 0.3 }}
            animate={isWrongGuess ? "wrong" : "normal"}
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
