"use client";

import { FC, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { DisableFocus } from "../hooks/useInputFocus";
import { Overlay } from "./Overlay";

type Props = {
    setDisableFocus: DisableFocus;
    createUser: (name: string) => Promise<boolean>;
    id: string | undefined;
};

export const AddName: FC<Props> = ({ setDisableFocus, createUser, id }) => {
    const [isOpen, setIsOpen] = useState(() => !id);

    const [name, setName] = useState("");

    useEffect(() => {
        setDisableFocus(isOpen);
    }, [isOpen, setDisableFocus]);

    const submit = async () => {
        if (name.length === 0) {
            toast.error("Du måste ange ett namn");
            return;
        }

        const success = await createUser(name);

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
                        <button
                            className="w-full
                            bg-primary text-white 
                            font-bold uppercase rounded 
                            px-4 py-2 mt-4"
                            onClick={submit}
                        >
                            Spara
                        </button>
                    </div>
                </div>
            </div>
        </Overlay>
    );
};
