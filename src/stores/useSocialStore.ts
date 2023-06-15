import { uniq } from "@banjoanton/utils";
import ky from "ky";
import toast from "react-hot-toast";
import { create } from "zustand";
import { PostFriendNameBody, PostFriendNameResponse } from "../app/api/friends/name/route";
import { PostUserResponse } from "../app/api/user/route";

type SocialStore = {
    id?: string;
    setID: (id: string) => void;
    name: string;
    setName: (name: string) => void;
    streak: number;
    setStreak: (streak: number) => void;
    createUser: (name: string) => Promise<boolean>;
    friends: string[];
    addFriend: (friend: string) => Promise<void>;
    removeFriend: (publicIdentifier: string) => void;
};
export const useSocialStore = create<SocialStore>(set => ({
    name: "",
    streak: 0,
    id: undefined,
    setName: (name: string) => set({ name }),
    setStreak: (streak: number) => set({ streak }),
    setID: (id: string) => set({ id }),
    createUser: async (name: string) => {
        const body = {
            name,
        };

        try {
            const response = await ky.post("/api/user", {
                body: JSON.stringify(body),
            });
            const data: PostUserResponse = await response.json();
            set({ id: data.uniqueIdentifier, name });
            return true;
        } catch (error) {
            console.log(error);
            return false;
        }
    },
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
