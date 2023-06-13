// eslint-disable-next-line import/no-duplicates

import { FC, useState } from "react";
import { DisableFocus } from "../hooks/useInputFocus";
import { BasicComboWithWords } from "../types/types";
import { readableDate } from "../utils/date";
import { Dropdown } from "./Dropdown";
import { Friends } from "./Friends";
import { Overlay } from "./Overlay";
import { PreviousDay } from "./PreviousDay";
import { Rules } from "./Rules";

type Props = {
    previous: BasicComboWithWords;
    streak: number;
    addFriend: (friend: string) => Promise<string[]>;
    friends: string[];
    setDisableFocus: DisableFocus;
};

export const Menubar: FC<Props> = ({ previous, streak, addFriend, friends, setDisableFocus }) => {
    const [showPrevious, setShowPrevious] = useState(false);
    const [showRules, setShowRules] = useState(false);
    const [showFriends, setShowFriends] = useState(false);
    const today = readableDate(new Date());

    return (
        <>
            <Overlay show={showPrevious} close={() => setShowPrevious(false)}>
                <PreviousDay previous={previous} />
            </Overlay>

            <Overlay show={showRules} close={() => setShowRules(false)}>
                <Rules />
            </Overlay>

            <Overlay
                setDisableFocus={setDisableFocus}
                show={showFriends}
                close={() => setShowFriends(false)}
            >
                <Friends
                    setDisableFocus={setDisableFocus}
                    addFriend={addFriend}
                    friends={friends}
                    showFriends={showFriends}
                />
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
                    ]}
                />
            </div>
        </>
    );
};
