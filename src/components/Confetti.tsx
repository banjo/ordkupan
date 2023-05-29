import { FC } from "react";
import ConfettiExplosion from "react-confetti-explosion";

type Props = {
    showConfetti: boolean;
    duration: number;
    onComplete: () => void;
    className?: string;
};

export const Confetti: FC<Props> = ({ showConfetti, onComplete, duration, className }) => {
    return (
        <div className={`absolute ${className}`}>
            {showConfetti && <ConfettiExplosion duration={duration} onComplete={onComplete} />}
        </div>
    );
};
