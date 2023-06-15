import { uniq } from "@banjoanton/utils";
import ky from "ky";
import toast from "react-hot-toast";
import { create } from "zustand";
import { PostFriendNameBody, PostFriendNameResponse } from "../app/api/friends/name/route";

type GameStore = {
    friends: string[];
    addFriend: (friend: string) => Promise<void>;
    removeFriend: (friend: string) => void;
};
export const useGameStore = create<GameStore>(set => ({
    friends: [],
    addFriend: async (friend: string) => {
        try {
            const body: PostFriendNameBody = {
                name: friend,
            };
            const res: PostFriendNameResponse = await ky
                .post(`/api/friends/name`, {
                    body: JSON.stringify(body),
                })
                .json();

            if (!res?.publicIdentifier) {
                toast.error("Kunde inte hitta användaren 😔");
                return;
            }

            set(state => ({ friends: uniq([...state.friends, res.publicIdentifier]) }));

            toast.success("Vän tillagd! 🧑‍🤝‍🧑");
        } catch (error) {
            console.log(error);
            toast.error("Kunde inte hitta användaren 😔");
        }
    },
    removeFriend: (publicIdentifier: string) =>
        set(state => ({ friends: state.friends.filter(f => f !== publicIdentifier) })),
}));
