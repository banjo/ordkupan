import { useSingletonInputFocus } from "@/hooks/useSingletonInputFocus";
import { motion } from "framer-motion";
import { FC, ReactNode, useEffect } from "react";
import { FiX } from "react-icons/fi";

type Props = {
    show: boolean;
    close: () => void;
    children?: ReactNode;
};

export const Overlay: FC<Props> = ({ show, children, close }) => {
    const { setIsFocusDisabled } = useSingletonInputFocus();
    const { focus } = useSingletonInputFocus();
    useEffect(() => {
        if (show) {
            setIsFocusDisabled(true);
        }

        return () => {
            setIsFocusDisabled(false);
            focus();
        };
    }, [focus, setIsFocusDisabled, show]);

    return (
        <>
            <motion.div
                variants={{
                    hidden: {
                        y: "-150%",
                        opacity: 0,
                        transition: {
                            opacity: { delay: 0.3 },
                        },
                    },
                    visible: {
                        y: 0,
                        opacity: [0, 1, 1],
                    },
                }}
                initial="hidden"
                animate={show ? "visible" : "hidden"}
                transition={{ duration: 0.5, ease: "easeInOut" }}
                className={`absolute inset-0 z-20  
                flex
                flex-col
                overflow-y-scroll bg-white
                px-8 py-4 h-full`}
            >
                <div className="flex h-10 w-full items-center justify-end">
                    <FiX onClick={close} size={25} />
                </div>
                {children}
            </motion.div>
        </>
    );
};
