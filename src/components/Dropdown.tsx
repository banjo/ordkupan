import { motion } from "framer-motion";
import { FC, useState } from "react";

type Props = {
    title: string;
    data: { title: string; onClick: () => void }[];
};

const variants = {
    hidden: {
        opacity: 0,
    },
    visible: {
        opacity: 1,
    },
};

export const Dropdown: FC<Props> = ({ title, data }: Props) => {
    const [show, setShow] = useState(false);
    return (
        <div className="relative">
            <button
                onClick={() => setShow(prev => !prev)}
                className="inline-flex w-fit items-center justify-center px-4 py-2.5 text-center text-sm font-medium text-black focus:outline-none focus:ring-4 focus:ring-gray-400 "
                type="button"
            >
                {title}
                <svg
                    className="ml-2 h-4 w-4"
                    aria-hidden="true"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M19 9l-7 7-7-7"
                    ></path>
                </svg>
            </button>
            <motion.div
                variants={variants}
                initial="hidden"
                animate={show ? "visible" : "hidden"}
                className={`absolute right-0 z-10 mt-2 w-max divide-y divide-gray-100 rounded-lg bg-white shadow`}
            >
                <ul className="py-2 text-sm text-gray-700" onClick={() => setShow(false)}>
                    {data.map((d, i) => (
                        <li key={d.title + i}>
                            <span className="block px-4 py-2 hover:bg-gray-100" onClick={d.onClick}>
                                {d.title}
                            </span>
                        </li>
                    ))}
                </ul>
            </motion.div>
        </div>
    );
};
