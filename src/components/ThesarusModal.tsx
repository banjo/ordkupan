import { motion } from "framer-motion";
import { ReactNode } from "react";
import { LuX } from "react-icons/lu";

type Props = {
    show: boolean;
    onCancel: () => void;
    reactNode: ReactNode;
    word: string | null;
};

const getUrl = (url: string | null) => `https://www.svenska.se/tre/?sok=${url}&pz=1`;

export const ThesaurusModal = ({ show, onCancel, reactNode, word }: Props) => {
    if (!show) {
        return null;
    }

    return (
        <motion.div
            id="thesaurusModal"
            className="overflow-y-auto h-full overflow-x-hidden fixed inset-0 z-50 bg-slate-800/40 flex justify-center items-center"
            tabIndex={-1}
            aria-hidden="true"
            onClick={onCancel}
        >
            <motion.div
                className="relative flex flex-col justify-end p-4 text-center bg-white rounded-lg shadow sm:p-5 w-72"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
            >
                <button
                    type="button"
                    className="text-gray-400 absolute top-2.5 right-2.5 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 inline-flex items-center"
                    data-modal-toggle="thesaurusModal"
                >
                    <LuX className="w-5 h-5" />
                </button>

                <div className="my-4 px-4">{reactNode}</div>
                <div className="flex justify-end items-center space-x-4">
                    <a
                        href={getUrl(word)}
                        target="_blank"
                        rel="noreferrer"
                        className="py-2 px-3 text-sm font-medium text-gray-500 bg-white rounded-lg border-gray-200 hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-primary-300 hover:text-gray-900 focus:z-10 cursor-pointer"
                    >
                        Besök SAOL
                    </a>

                    <button
                        data-modal-toggle="thesaurusModal"
                        type="button"
                        className="py-2 px-3 text-sm font-medium text-gray-500 bg-white rounded-lg border border-gray-200 hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-primary-300 hover:text-gray-900 focus:z-10"
                    >
                        Ok
                    </button>
                </div>
            </motion.div>
        </motion.div>
    );
};
