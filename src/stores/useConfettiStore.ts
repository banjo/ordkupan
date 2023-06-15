import { create } from "zustand";

type ConfettiStore = {
    showConfetti: boolean;
    setShowConfetti: (show: boolean) => void;
};
export const useConfettiStore = create<ConfettiStore>(set => ({
    showConfetti: false,
    setShowConfetti: (show: boolean) => set({ showConfetti: show }),
}));
