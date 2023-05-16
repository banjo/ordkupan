"use client";

import { useState } from "react";
import { toast, Toaster } from "react-hot-toast";
import { Combo } from "../types/types";

export const Playboard = ({ combo }: { combo: Combo }) => {
    const [word, setWord] = useState("");
    const [score, setScore] = useState(0);
    const [matchedWords, setMatchedWords] = useState<string[]>([]);

    const letters = combo.otherLetters.sort(() => Math.random() - 0.5);

    const submitWord = () => {
        const selectedWord = word;
        setWord("");

        const submittedWord = combo.words.find(w => w.word === selectedWord);

        if (!submittedWord) {
            toast.error("Inte ett giltigt ord", {
                icon: "😞",
            });
            console.log("Word not found");
            return;
        }

        if (matchedWords.includes(submittedWord.word)) {
            toast.error("Redan använt", {
                icon: "😲",
            });
            console.log("Word already matched");
            return;
        }

        toast.success(`+${submittedWord.score}`, {
            icon: "🔥",
        });

        setMatchedWords([...matchedWords, submittedWord.word]);
        setScore(s => s + submittedWord.score);
    };

    const keyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === "Enter") {
            submitWord();
        }
    };

    return (
        <>
            <Toaster />
            <div className="flex flex-col items-center justify-center">
                <div className="flex flex-row gap-16">
                    <div className="flex flex-col">
                        <div>Main: {combo.mainLetter}</div>
                        <div>Letters: {letters}</div>
                        <input
                            type="text"
                            value={word}
                            placeholder="Ord..."
                            onChange={event => setWord(event.target.value)}
                            className="text-black"
                            onKeyDown={keyDown}
                        ></input>
                    </div>
                    <div>
                        <div>score: {score}</div>
                        <div>
                            words:
                            {matchedWords.map(w => (
                                <div key={w}>{w}</div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};
