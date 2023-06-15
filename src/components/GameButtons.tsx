import { Dispatch, FC, SetStateAction } from "react";
import { FiRefreshCw } from "react-icons/fi";
import { useSingletonInputFocus } from "../hooks/useSingletonInputFocus";
import { useGameStore } from "../stores/useGameStore";
import { Button } from "./Button";

type Props = {
    setFadeOut: Dispatch<SetStateAction<boolean>>;
    submitWord: () => Promise<boolean>;
};

export const GameButtons: FC<Props> = ({ setFadeOut, submitWord }) => {
    const { focus } = useSingletonInputFocus();
    const { setWord, word, shuffleOtherLetters } = useGameStore();
    const shuffleLetters = () => {
        setFadeOut(true);

        setTimeout(() => {
            shuffleOtherLetters();
            setFadeOut(false);
        }, 500);
    };

    const deleteLastLetter = () => {
        const updatedWord = word.slice(0, -1);
        setWord(updatedWord);
        focus();
    };

    return (
        <div className="relative flex w-9/12 items-center justify-center gap-3">
            <Button text="Delete" onClick={deleteLastLetter} />
            <Button onClick={shuffleLetters} icon={FiRefreshCw} />
            <Button text="Enter" onClick={submitWord} />
        </div>
    );
};
