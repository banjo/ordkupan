import { shuffle } from "@banjoanton/utils";
import { Dispatch, FC, SetStateAction } from "react";
import { FiRefreshCw } from "react-icons/fi";
import { Button } from "./Button";

type Props = {
    setFadeOut: Dispatch<SetStateAction<boolean>>;
    setOtherLetters: Dispatch<SetStateAction<string[]>>;
    setWord: Dispatch<SetStateAction<string>>;
    submitWord: () => void;
};

export const GameButtons: FC<Props> = ({ setFadeOut, setOtherLetters, setWord, submitWord }) => {
    const shuffleLetters = () => {
        setFadeOut(true);

        setTimeout(() => {
            setOtherLetters(letters => shuffle(letters));
            setFadeOut(false);
        }, 500);
    };

    const deleteLastLetter = () => {
        setWord(w => w.slice(0, -1));
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
