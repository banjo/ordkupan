"use client";

import { isEmpty } from "@banjoanton/utils";
import { FC, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useSingletonInputFocus } from "../hooks/useSingletonInputFocus";
import { useSocialStore } from "../stores/useSocialStore";
import { Overlay } from "./Overlay";
import { PrimaryButton } from "./PrimaryButton";

export const AddName: FC = () => {
    const { createUser, id } = useSocialStore();
    const [isOpen, setIsOpen] = useState(false);
    const [name, setName] = useState("");
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const { setIsFocusDisabled } = useSingletonInputFocus();

    useEffect(() => {
        if (id) {
            setIsOpen(false);
        } else {
            setIsOpen(true);
        }
    }, [id]);

    useEffect(() => {
        if (isOpen) {
            setIsFocusDisabled(true);
        } else {
            setIsFocusDisabled(false);
        }
    }, [isOpen, setIsFocusDisabled]);

    const submit = async () => {
        if (name.length === 0) {
            toast.error("Du måste ange ett namn");
            return;
        }

        setIsLoading(true);
        const success = await createUser(name);
        setIsLoading(false);

        if (!success) {
            toast.error("Namnet är upptaget");
            return;
        }

        toast.success(`Nu kör vi, ${name}!`);

        setIsOpen(false);
    };

    return (
        <Overlay show={isOpen} close={() => setIsOpen(false)}>
            <div className="flex flex-col gap-4 mt-8">
                <div className="text-2xl font-bold uppercase">🎉 Spela med vänner</div>
                <div className="mt-4 flex flex-col gap-4">
                    <div>
                        <div className="mb-1 text-xl font-bold">Bäst idag? 🏆</div>
                        <div className="text-gray-600 mt-4">
                            Välj ett passande namn och gå in på
                            <span className="font-bold text-primaryDark"> Vänner</span> i menyn för
                            att lägga till dina vänner och se vem som är bäst idag.
                        </div>
                        <div className="text-gray-600 mt-4">Välj ett unikt namn och kör igång!</div>
                    </div>

                    <div>
                        <input
                            type="text"
                            className="w-full border-slate-800 border h-12 
                            rounded px-4 py-2 focus:outline-none 
                            focus:ring-2 focus:ring-slate-800 
                            focus:border-transparent
                            mt-8"
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
                            Spara
                        </PrimaryButton>
                    </div>
                </div>
            </div>
        </Overlay>
    );
};
