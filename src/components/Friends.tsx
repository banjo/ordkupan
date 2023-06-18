import { capitalize } from "@banjoanton/utils";
import { Temporal } from "@js-temporal/polyfill";
import ky from "ky";
import { FC, useEffect, useState } from "react";
import { LuArrowLeft, LuArrowRight, LuTrash2, LuUserX } from "react-icons/lu";
import { PostFriendResponse, PublicScore } from "../app/api/friends/route";
import { useSocialStore } from "../stores/useSocialStore";
import { dateNow, readableDate } from "../utils/date";
import { AddFriend } from "./AddFriend";
import { ConfirmModal } from "./ConfirmModal";
import { Spinner } from "./Spinner";

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
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [selectedDate, setSelectedDate] = useState<string>(dateNow());
    const canIncreaseDate = selectedDate !== dateNow();

    const increaseDateByOneDay = () => {
        const increasedDate = Temporal.PlainDate.from(selectedDate).add({ days: 1 });
        setSelectedDate(increasedDate.toString());
    };

    const decreaseDateByOneDay = () => {
        const decreasedDate = Temporal.PlainDate.from(selectedDate).add({ days: -1 });
        setSelectedDate(decreasedDate.toString());
    };

    useEffect(() => {
        const fetchFriendScores = async () => {
            setIsLoading(true);
            const sorted = await fetchFriends(friends, selectedDate);
            setFriendScore(sorted);
            setIsLoading(false);
        };

        if (showFriends) {
            fetchFriendScores();
        }
    }, [friends, selectedDate, showFriends]);

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
                    <div>{readableDate(new Date(selectedDate))}</div>
                    <LuArrowRight
                        className={`h-5 w-5 ${canIncreaseDate ? "cursor-pointer" : "opacity-30"}`}
                        onClick={canIncreaseDate ? increaseDateByOneDay : undefined}
                    />
                </div>
                <div className="flex flex-col items-center justify-betweem h-full mx-4 mt-4 overflow-y-scroll w-full">
                    {!isLoading &&
                        friendScore.map((friend, index) => (
                            <div
                                key={index}
                                className="flex items-center justify-start w-full px-4"
                            >
                                <div className="text-xl font-semibold w-6">{index + 1}.</div>
                                <div className="ml-2">{capitalize(friend.name)}</div>
                                <div className="text-xl font-semibold ml-auto">{friend.score}</div>
                                <LuUserX
                                    onClick={() => onRemoveFriendClick(friend)}
                                    className="ml-2 cursor-pointer"
                                />
                            </div>
                        ))}

                    {isLoading && (
                        <div className="flex w-full h-full items-start justify-center mt-8">
                            <Spinner size="medium" />
                        </div>
                    )}

                    {friendScore.length === 0 && !isLoading && (
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
