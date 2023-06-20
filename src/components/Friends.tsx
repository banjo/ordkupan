import { capitalize } from "@banjoanton/utils";
import ky from "ky";
import { FC, useState } from "react";
import { LuTrash2, LuUserX } from "react-icons/lu";
import { PostFriendResponse } from "../app/api/friends/route";
import { useSocialStore } from "../stores/useSocialStore";
import { PublicScore } from "../types/types";
import { AddFriend } from "./AddFriend";
import { ConfirmModal } from "./ConfirmModal";
import { ScoreList } from "./ScoreList";

type Props = {
    showFriends: boolean;
};

const fetchFriends = async (friends: string[], date: string) => {
    const friendsScore: PostFriendResponse = await ky
        .post("/api/friends", {
            body: JSON.stringify({ friends, date }),
        })
        .json();

    const sorted = [...friendsScore.score].sort((a, b) => b.score - a.score);

    return sorted;
};

export const Friends: FC<Props> = ({ showFriends }) => {
    const { removeFriend, friends, name } = useSocialStore();
    const [friendToRemove, setFriendToRemove] = useState<PublicScore | null>(null);
    const [showModal, setShowModal] = useState<boolean>(false);

    const removeFriendHandler = () => {
        if (friendToRemove) {
            removeFriend(friendToRemove.publicIdentifier);
            setFriendToRemove(null);
            setShowModal(false);
        }
    };

    const onCancel = () => {
        setFriendToRemove(null);
        setShowModal(false);
    };

    const onRemoveScoreClick = (friend: PublicScore) => {
        setFriendToRemove(friend);
        setShowModal(true);
    };

    const fetchFunction = async (date: string) => {
        if (!showFriends) return [];
        return await fetchFriends(friends, date);
    };

    return (
        <>
            <ConfirmModal
                show={showModal}
                onCancel={onCancel}
                cancelText="Nej"
                confirmText="Ja"
                confirmStatus="danger"
                textIcon={<LuTrash2 className="h-10 w-10" />}
                text={`Ta bort ${capitalize(friendToRemove?.name ?? "")} som vän? 😥`}
                onConfirm={removeFriendHandler}
            />

            <ScoreList
                additionalEntries={[
                    score => (
                        <LuUserX
                            onClick={() => onRemoveScoreClick(score)}
                            className="ml-2 cursor-pointer"
                        />
                    ),
                ]}
                emptyText="Du har inga vänner 😥"
                subTitle={name}
                fetchFunction={fetchFunction}
                title="Vänner"
                trigger={showFriends}
            />

            <div className="flex flex-col items-center justify-center mb-4">
                <AddFriend />
            </div>
        </>
    );
};
