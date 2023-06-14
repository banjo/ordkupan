import { FC, ReactNode } from "react";

type Props = {
    children?: ReactNode;
};

export const Main: FC<Props> = ({ children }) => {
    return (
        <main className="flex min-h-[100dvh] flex-col items-center justify-center bg-white text-black">
            {children}
        </main>
    );
};
