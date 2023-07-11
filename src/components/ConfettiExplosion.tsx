import { Confetti } from "@/components/Confetti";
import { range } from "@banjoanton/utils";
import { FC, useEffect, useState } from "react";

type Props = {
    show: boolean;
    duration: number;
};

const positions = [
    "top-[25%] left-[25%]",
    "top-[25%] right-[25%]",
    "bottom-[25%] left-[25%]",
    "bottom-[25%] right-[25%]",
    "top-[50%] left-[50%]",
];

export const ConfettiExplosion: FC<Props> = ({ show, duration }) => {
    const [showConfetti, setShowConfetti] = useState(false);

    useEffect(() => {
        if (show) {
            setShowConfetti(true);
            setTimeout(() => setShowConfetti(false), duration);
        }
    }, [duration, show]);

    return (
        <div className="relative">
            {range(5).map(i => (
                <Confetti
                    key={i}
                    showConfetti={showConfetti}
                    duration={duration}
                    onComplete={() => setShowConfetti(false)}
                    className={positions[i]}
                />
            ))}
        </div>
    );
};
