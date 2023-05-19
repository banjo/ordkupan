import { FC } from "react";
import ConfettiExplosion from "react-confetti-explosion";

type Props = {
    showConfetti: boolean;
    duration: number;
    onComplete: () => void;
};

export const Confetti: FC<Props> = ({ showConfetti, onComplete, duration }) => {
    return (
        <div className="absolute top-[25%]">
            {showConfetti && <ConfettiExplosion duration={duration} onComplete={onComplete} />}
        </div>
    );
};
