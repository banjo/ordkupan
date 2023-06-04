// eslint-disable-next-line import/no-duplicates

import { FC, useState } from "react";
import { Combo } from "../types/types";
import { readableDate } from "../utils/date";
import { Dropdown } from "./Dropdown";
import { Overlay } from "./Overlay";
import { PreviousDay } from "./PreviousDay";
import { Rules } from "./Rules";

type Props = {
    previous: Combo;
    streak: number;
};

export const Menubar: FC<Props> = ({ previous, streak }) => {
    const [showPrevious, setShowPrevious] = useState(false);
    const [showRules, setShowRules] = useState(false);
    const today = readableDate(new Date());
    streak = 3;

    return (
        <>
            <Overlay show={showPrevious} close={() => setShowPrevious(false)}>
                <PreviousDay previous={previous} />
            </Overlay>

            <Overlay show={showRules} close={() => setShowRules(false)}>
                <Rules />
            </Overlay>

            <div className="my-2 flex h-2 items-center justify-between font-light">
                <div>{today}</div>
                {streak > 0 && <div className="font-semibold">{streak}🔥</div>}
                <Dropdown
                    title="Meny"
                    data={[
                        {
                            title: "Tidigare ord",
                            onClick: () => setShowPrevious(true),
                        },
                        {
                            title: "Regler",
                            onClick: () => setShowRules(true),
                        },
                    ]}
                />
            </div>
        </>
    );
};
