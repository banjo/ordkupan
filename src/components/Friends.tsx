import { capitalize } from "@banjoanton/utils";
import ky from "ky";
import { FC, useEffect, useState } from "react";
import { LuArrowLeft, LuArrowRight, LuTrash2, LuUserX } from "react-icons/lu";
import { PostFriendResponse, PublicScore } from "../app/api/friends/route";
import { useSocialStore } from "../stores/useSocialStore";
import { readableDate } from "../utils/date";
import { AddFriend } from "./AddFriend";
import { ConfirmModal } from "./ConfirmModal";

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
    const [friendScore, setFriendScore] = useState([] as PublicScore[]);
    const { removeFriend, friends, name } = useSocialStore();
    const [friendToRemove, setFriendToRemove] = useState<PublicScore | null>(null);
    const [showModal, setShowModal] = useState<boolean>(false);

    // for score
    const [selectedDate, setSelectedDate] = useState<Date>(new Date());
    const canIncreaseDate = selectedDate.toDateString() !== new Date().toDateString();

    const increaseDateByOneDay = () => {
        const newDate = new Date(selectedDate);
        newDate.setDate(newDate.getDate() + 1);
        setSelectedDate(newDate);
    };

    const decreaseDateByOneDay = () => {
        const newDate = new Date(selectedDate);
        newDate.setDate(newDate.getDate() - 1);
        setSelectedDate(newDate);
    };

    useEffect(() => {
        const fetchFriendScores = async () => {
            const sorted = await fetchFriends(friends, selectedDate.toISOString());
            setFriendScore(sorted);
        };

        if (showFriends) {
            fetchFriendScores();
        }
    }, [friends, selectedDate, showFriends]);

    useEffect(() => {
        const fetchFriendScores = async () => {
            const sorted = await fetchFriends(friends, selectedDate.toISOString());
            setFriendScore(sorted);
        };

        if (friends.length > 0) {
            fetchFriendScores();
        }
    }, [friends, selectedDate]);

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
                <div className="flex gap-4 mt-4 items-center">
                    <LuArrowLeft
                        className="h-5 w-5 cursor-pointer"
                        onClick={decreaseDateByOneDay}
                    />
                    <div>{readableDate(selectedDate)}</div>
                    <LuArrowRight
                        className={`h-5 w-5 ${canIncreaseDate ? "cursor-pointer" : "opacity-30"}`}
                        onClick={canIncreaseDate ? increaseDateByOneDay : undefined}
                    />
                </div>
                <div className="flex flex-col items-center justify-betweem h-full mx-8 mt-4 overflow-y-scroll w-full px-4">
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
