import { FC } from "react";

export const FinishedCard: FC = () => {
    return (
        <div
            id="alert-additional-content-3"
            className="mb-4 w-full rounded-lg border border-green-300 bg-green-50 p-4 text-green-800"
            role="alert"
        >
            <div className="flex items-center">
                <h3 className="text-lg font-medium">🎉 Grattis!</h3>
            </div>
            <div className="mb-1 mt-2 text-sm">Du har klarat alla dagens ord.</div>
            <div className="text-sm">Bra jobbat!</div>
        </div>
    );
};
