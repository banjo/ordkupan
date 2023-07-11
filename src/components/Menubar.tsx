// eslint-disable-next-line import/no-duplicates

import { Dropdown } from "@/components/Dropdown";
import { Friends } from "@/components/Friends";
import { HighScore } from "@/components/HighScore";
import { Overlay } from "@/components/Overlay";
import { PreviousDay } from "@/components/PreviousDay";
import { Rules } from "@/components/Rules";
import { useSocialStore } from "@/stores/useSocialStore";
import { BasicComboWithWords } from "@/types/types";
import { dateNow, readableDate } from "@/utils/date";
import { FC, useState } from "react";

type Props = {
    previous: BasicComboWithWords;
};

export const Menubar: FC<Props> = ({ previous }) => {
    const [showPrevious, setShowPrevious] = useState(false);
    const [showRules, setShowRules] = useState(false);
    const [showFriends, setShowFriends] = useState(false);
    const [showHighScore, setShowHighScore] = useState(false);
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

            <Overlay show={showHighScore} close={() => setShowHighScore(false)}>
                <HighScore showHighScore={showHighScore} />
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
                            onClick: () => setShowHighScore(true),
                        },
                    ]}
                />
            </div>
        </>
    );
};
