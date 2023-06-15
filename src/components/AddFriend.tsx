import { isEmpty } from "@banjoanton/utils";
import { FC, useState } from "react";
import { useGameStore } from "../stores/useGameStore";
import { PrimaryButton } from "./PrimaryButton";

export const AddFriend: FC = () => {
    const [name, setName] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const { addFriend } = useGameStore();

    const submit = async () => {
        setIsLoading(true);
        await addFriend(name);
        setName("");
        setIsLoading(false);
    };

    return (
        <div>
            <input
                type="text"
                className="w-full border-slate-800 border h-12 
                            rounded px-4 py-2 focus:outline-none 
                            focus:ring-2 focus:ring-slate-800 
                            focus:border-transparent"
                placeholder="Namn"
                value={name}
                onChange={e => setName(e.target.value)}
                onKeyDown={async e => {
                    if (e.key === "Enter") {
                        await submit();
                    }
                }}
            />

            <PrimaryButton onClick={submit} isDisabled={isLoading || isEmpty(name)}>
                {isLoading ? "Lägger till..." : "Lägg till"}
            </PrimaryButton>
        </div>
    );
};
