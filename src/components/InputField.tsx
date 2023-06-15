import { motion } from "framer-motion";
import React from "react";
import { useSingletonInputFocus } from "../hooks/useSingletonInputFocus";
import { useGameStore } from "../stores/useGameStore";

type Props = {
    submitWord: () => Promise<boolean>;
    isWrongGuess: boolean;
};

export const InputField = ({ submitWord, isWrongGuess }: Props) => {
    const { setInputRef } = useSingletonInputFocus();
    const { setWord, word } = useGameStore();

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
