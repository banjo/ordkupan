import { FC, useState } from "react";

type Props = {
    addFriend: (friend: string) => Promise<string[]>;
};

export const AddFriend: FC<Props> = ({ addFriend }) => {
    const [name, setName] = useState("");

    const submit = async () => {
        await addFriend(name);
        setName("");
    };

    return (
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
    );
};
