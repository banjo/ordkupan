import { PostSaulResponse } from "@/app/api/saul/route";
import { create } from "zustand";

type ThesaurusModalStore = {
    show: boolean;
    setShow: (show: boolean) => void;
    word: string | null;
    setWord: (word: string | null) => void;
    data: PostSaulResponse | null;
    setData: (data: PostSaulResponse | null) => void;
    isLoading: boolean;
    setIsLoading: (isLoading: boolean) => void;
    onClose: () => void;
    setOnClose: (onClose: () => void) => void;
};
export const useThesaurusModalStore = create<ThesaurusModalStore>(set => ({
    show: false,
    setShow: (show: boolean) => set({ show }),
    word: "",
    setWord: (word: string | null) => set({ word }),
    data: null,
    setData: (data: PostSaulResponse | null) => set({ data }),
    isLoading: false,
    setIsLoading: (isLoading: boolean) => set({ isLoading }),
    onClose: () => 0,
    setOnClose: (onClose: () => void) => set({ onClose }),
}));
