import { AnimatePresence, motion } from "framer-motion";
import { FC } from "react";

type Props = {
    children?: React.ReactNode;
    show?: boolean;
    delay?: number;
    duration?: number;
};

export const Toggle: FC<Props> = ({ children, show, delay = 0, duration = 0.5 }) => {
    return (
        <AnimatePresence>
            {show && (
                <motion.div
                    className="w-full"
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration, delay }}
                >
                    {children}
                </motion.div>
            )}
        </AnimatePresence>
    );
};
