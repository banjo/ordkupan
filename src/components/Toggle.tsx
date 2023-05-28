import { FC } from "react";

type Props = {
    children?: React.ReactNode;
    show?: boolean;
};

export const Toggle: FC<Props> = ({ children, show }) => {
    if (!show) return null;

    return <>{children}</>;
};
