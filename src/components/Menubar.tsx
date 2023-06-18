// eslint-disable-next-line import/no-duplicates

import { FC, useState } from "react";
import { useSocialStore } from "../stores/useSocialStore";
import { BasicComboWithWords } from "../types/types";
import { dateNow, readableDate } from "../utils/date";
import { Dropdown } from "./Dropdown";
import { Friends } from "./Friends";
import { HighScore } from "./HighScore";
import { Overlay } from "./Overlay";
import { PreviousDay } from "./PreviousDay";
import { Rules } from "./Rules";

type Props = {
    previous: BasicComboWithWords;
};

export const Menubar: FC<Props> = ({ previous }) => {
    const [showPrevious, setShowPrevious] = useState(false);
    const [showRules, setShowRules] = useState(false);
    const [showFriends, setShowFriends] = useState(false);
    const [showHighscore, setShowHighscore] = useState(false);
    const { streak } = useSocialStore();
    const today = readableDate(new Date(dateNow()));

    return (
        <>
            <Overlay show={showPrevious} close={() => setShowPrevious(false)}>
                <PreviousDay previous={previous} />
            </Overlay>

            <Overlay show={showRules} close={() => setShowRules(false)}>
                <Rules />
            </Overlay>

            <Overlay show={showFriends} close={() => setShowFriends(false)}>
                <Friends showFriends={showFriends} />
            </Overlay>

            <Overlay show={showHighscore} close={() => setShowHighscore(false)}>
                <HighScore />
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
                        {
                            title: "Vänner",
                            onClick: () => setShowFriends(true),
                        },
                        {
                            title: "Topplista",
                            onClick: () => setShowHighscore(true),
                        },
                    ]}
                />
            </div>
        </>
    );
};
