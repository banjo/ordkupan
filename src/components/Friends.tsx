import { capitalize } from "@banjoanton/utils";
import ky from "ky";
import { FC, useEffect, useState } from "react";
import { LuTrash2, LuUserX } from "react-icons/lu";
import { PostFriendResponse, PublicScore } from "../app/api/friends/route";
import { useSocialStore } from "../stores/useSocialStore";
import { AddFriend } from "./AddFriend";
import { ConfirmModal } from "./ConfirmModal";

type Props = {
    showFriends: boolean;
};

const fetchFriends = async (friends: string[]) => {
    const friendsScore: PostFriendResponse = await ky
        .post("/api/friends", {
            body: JSON.stringify({ friends }),
        })
        .json();

    const sorted = [...friendsScore.score].sort((a, b) => b.score - a.score);

    return sorted;
};

export const Friends: FC<Props> = ({ showFriends }) => {
    const [friendScore, setFriendScore] = useState([] as PublicScore[]);
    const { removeFriend, friends, name } = useSocialStore();
    const [friendToRemove, setFriendToRemove] = useState<PublicScore | null>(null);
    const [showModal, setShowModal] = useState<boolean>(false);

    useEffect(() => {
        const fetchFriendScores = async () => {
            const sorted = await fetchFriends(friends);
            setFriendScore(sorted);
        };

        if (showFriends) {
            fetchFriendScores();
        }
    }, [friends, showFriends]);

    useEffect(() => {
        const fetchFriendScores = async () => {
            const sorted = await fetchFriends(friends);
            setFriendScore(sorted);
        };

        if (friends.length > 0) {
            fetchFriendScores();
        }
    }, [friends]);

    const removeFriendHandler = async () => {
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

    const onRemoveFriendClick = (friend: PublicScore) => {
        setFriendToRemove(friend);
        setShowModal(true);
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
            <div className="flex flex-col items-center flex-1 max-h-1/12">
                <div className="text-2xl font-bold uppercase">Topplista 🏆</div>
                <div className="uppercase text-gray-400 font-bold">{name}</div>
                <div className="flex flex-col items-center justify-betweem h-full my-8 overflow-y-scroll w-full px-4">
                    {friendScore.map((friend, index) => (
                        <div key={index} className="flex items-center justify-start w-full">
                            <div className="text-xl font-semibold w-6">{index + 1}.</div>
                            <div className="ml-2">{capitalize(friend.name)}</div>
                            <div className="text-xl font-semibold ml-auto">{friend.score}</div>
                            <LuUserX
                                onClick={() => onRemoveFriendClick(friend)}
                                className="ml-2 cursor-pointer"
                            />
                        </div>
                    ))}

                    {friendScore.length === 0 && (
                        <div className="text-xl font-semibold">Inga vänner än 😢</div>
                    )}
                </div>
                <div className="flex flex-col items-center justify-center mb-4">
                    <AddFriend />
                </div>
            </div>
        </>
    );
};
