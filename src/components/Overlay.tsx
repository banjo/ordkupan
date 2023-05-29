import { motion } from "framer-motion";
import { FC, ReactNode } from "react";
import { FiX } from "react-icons/fi";

type Props = {
    show: boolean;
    close: () => void;
    children?: ReactNode;
};

const variants = {
    hidden: {
        y: "-150%",
    },
    visible: {
        y: 0,
    },
};

export const Overlay: FC<Props> = ({ show, children, close }) => {
    console.log("Overlay rendered", show);
    return (
        <>
            <motion.div
                variants={variants}
                initial="hidden"
                animate={show ? "visible" : "hidden"}
                transition={{ duration: 0.5, ease: "easeInOut" }}
                className={`absolute inset-0 z-20  
                flex
                flex-col
                overflow-y-scroll bg-white
                px-8 py-4`}
            >
                <div className="flex h-10 w-full items-center justify-end">
                    <FiX onClick={close} size={25} />
                </div>
                {children}
            </motion.div>
        </>
    );
};
