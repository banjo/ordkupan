import { motion } from "framer-motion";
import { LuX } from "react-icons/lu";

type Props = {
    show: boolean;
    onConfirm: () => void;
    onCancel: () => void;
    confirmText?: string;
    cancelText?: string;
    confirmStatus?: "danger" | "success";
    text?: string;
    textIcon?: React.ReactNode;
};

export const ConfirmModal = ({
    show,
    onCancel,
    onConfirm,
    confirmStatus,
    confirmText,
    text,
    textIcon,
    cancelText,
}: Props) => {
    if (!show) {
        return null;
    }

    return (
        <motion.div
            id="deleteModal"
            className="overflow-y-auto h-full overflow-x-hidden fixed inset-0 z-50 bg-slate-800 bg-opacity-40 flex justify-center items-center"
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
                    className="text-gray-400 absolute top-2.5 right-2.5 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center"
                    data-modal-toggle="deleteModal"
                >
                    <LuX className="w-5 h-5" />
                </button>
                {textIcon && (
                    <div className="flex justify-center items-center mt-6">{textIcon}</div>
                )}
                <p className="my-4 text-gray-500 px-4">{text}</p>
                <div className="flex justify-center items-center space-x-4">
                    <button
                        data-modal-toggle="deleteModal"
                        type="button"
                        className="py-2 px-3 text-sm font-medium text-gray-500 bg-white rounded-lg border border-gray-200 hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-primary-300 hover:text-gray-900 focus:z-10"
                    >
                        {cancelText || "Avbryt"}
                    </button>
                    <button
                        type="submit"
                        onClick={onConfirm}
                        className={`py-2 px-3 text-sm font-medium text-center text-white rounded-lg 
                        ${
                            confirmStatus === "danger"
                                ? "bg-red-600  hover:bg-red-700 focus:ring-red-300"
                                : "bg-green-600 hover:bg-green-700 focus:ring-green-300"
                        }focus:ring-4 focus:outline-none`}
                    >
                        {confirmText || "Ja"}
                    </button>
                </div>
            </motion.div>
        </motion.div>
    );
};
