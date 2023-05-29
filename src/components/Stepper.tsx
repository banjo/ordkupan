import { range } from "@banjoanton/utils";
import { motion } from "framer-motion";
import { FC, ReactNode } from "react";

type Props = {
    steps: number;
    active: number;
    display: number;
    maxScore: number;
};

type StepProps = {
    active: boolean;
    passed: boolean;
    isLast: boolean;
    label?: string;
    children?: ReactNode;
};

const DURATION = 0.2;

const lineVariants = {
    hidden: {
        width: 0,
    },
    visible: {
        width: "100%",
    },
};

const circleVariants = {
    default: {
        width: "1rem",
        height: "1rem",
    },
    active: {
        width: "3rem",
        height: "3rem",
    },
};
const Step = ({ active, passed, children, isLast }: StepProps) => {
    const color = passed || active ? "bg-primary" : "bg-gray-300";

    return (
        <div className="relative flex items-center justify-center">
            <motion.div
                variants={circleVariants}
                animate={active || isLast ? "active" : "default"}
                transition={{ duration: DURATION }}
                className={`h-4 w-4 rounded-full
                ${color}`}
            >
                <div
                    className="flex h-full w-full items-center justify-center 
                    text-sm text-gray-900"
                >
                    {children}
                </div>
            </motion.div>
            {!isLast && (
                <div className={`relative h-[2px] w-[14px] bg-gray-300`}>
                    <motion.div
                        variants={lineVariants}
                        initial="hidden"
                        animate={passed ? "visible" : "hidden"}
                        transition={{ duration: DURATION }}
                        className="absolute h-full bg-primary"
                    ></motion.div>
                </div>
            )}
        </div>
    );
};

export const Stepper: FC<Props> = ({ steps, active, display, maxScore }) => {
    return (
        <div className="flex items-center justify-center">
            {range(steps).map((_, i) => {
                const isLast = i + 1 === steps;
                const hasPassed = active > i + 1;
                const isActive = active === i + 1;

                let text = "";
                if (isLast) {
                    text = `${maxScore}`;
                } else if (isActive) {
                    text = `${display}`;
                }

                return (
                    <Step key={i} active={isActive} passed={hasPassed} isLast={isLast}>
                        {text}
                    </Step>
                );
            })}
        </div>
    );
};
