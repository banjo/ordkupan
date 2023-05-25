import { range } from "@banjoanton/utils";
import { FC, ReactNode } from "react";

type Props = {
    steps: number;
    active: number;
    display: number;
};

type StepProps = {
    active: boolean;
    passed: boolean;
    isLast: boolean;
    label?: string;
    children?: ReactNode;
};

const Step = ({ active, passed, children, isLast }: StepProps) => {
    const color = passed ? "bg-primary" : "bg-gray-300";

    return (
        <div className="relative flex items-center justify-center">
            <div
                className={`rounded-full
                ${active ? "h-10 w-10 bg-primary" : "h-4 w-4"} 
                ${color}`}
            >
                <div
                    className="flex h-full w-full items-center justify-center 
                    text-sm text-gray-900"
                >
                    {active && children}
                </div>
            </div>
            {!isLast && <div className={`h-[2px] w-[14px] ${color}`}></div>}
        </div>
    );
};

export const Stepper: FC<Props> = ({ steps, active, display }) => {
    return (
        <div className="flex items-center justify-center">
            {range(steps).map((_, i) => (
                <Step
                    key={i}
                    active={i + 1 === active}
                    passed={active > i + 1}
                    isLast={i + 1 === steps}
                >
                    {display}
                </Step>
            ))}
        </div>
    );
};
