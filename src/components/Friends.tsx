import { capitalize } from "@banjoanton/utils";
import ky from "ky";
import { FC, useEffect, useState } from "react";
import { PostFriendResponse, PublicScore } from "../app/api/friends/route";
import { AddFriend } from "./AddFriend";

type Props = {
    friends: string[];
    addFriend: (friend: string) => Promise<string[]>;
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

export const Friends: FC<Props> = ({ friends, addFriend, showFriends }) => {
    const [friendScore, setFriendScore] = useState([] as PublicScore[]);

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

    return (
        <div className="flex flex-col items-center flex-1 max-h-1/12">
            <div className="text-2xl font-bold uppercase">Topplista 🏆</div>
            <div className="flex flex-col items-center justify-betweem h-full my-8 overflow-y-scroll w-full px-10">
                {friendScore.map((friend, index) => (
                    <div key={index} className="flex items-center justify-between w-full">
                        <div className="flex items-center">
                            <div className="text-xl font-semibold">{index + 1}.</div>
                            <div className="ml-2">{capitalize(friend.name)}</div>
                        </div>
                        <div className="text-xl font-semibold">{friend.score}</div>
                    </div>
                ))}

                {friendScore.length === 0 && (
                    <div className="text-xl font-semibold">Inga vänner än 😢</div>
                )}
            </div>
            <div className="flex flex-col items-center justify-center mb-4">
                <AddFriend addFriend={addFriend} />
            </div>
        </div>
    );
};
