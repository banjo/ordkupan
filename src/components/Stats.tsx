import { PostUserStatsResponse } from "@/app/api/stats/route";
import { Spinner } from "@/components/Spinner";
import { useSocialStore } from "@/stores/useSocialStore";
import { Maybe } from "@banjoanton/utils";
import ky from "ky";
import { FC, useEffect, useState } from "react";

const fetchStats = async (internalUserId: Maybe<string>): Promise<PostUserStatsResponse | null> => {
    if (!internalUserId) return null;

    try {
        const res: PostUserStatsResponse = await ky
            .post("/api/stats", {
                body: JSON.stringify({ internalUserId }),
            })
            .json();

        return res;
    } catch (error) {
        console.log(error);
        return null;
    }
};

export const Stats: FC<{ showStats: boolean }> = ({ showStats }) => {
    const { id } = useSocialStore();
    const [isLoading, setIsLoading] = useState(false);
    const [stats, setStats] = useState<PostUserStatsResponse | null>(null);

    useEffect(() => {
        const getStats = async () => {
            setIsLoading(true);
            const statsResponse = await fetchStats(id);
            setIsLoading(false);
            if (statsResponse) setStats(statsResponse);
        };

        if (showStats) {
            getStats();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [showStats]);

    return (
        <>
            <div className="flex flex-col items-center flex-1 max-h-1/12">
                <div className="text-2xl font-bold uppercase">Statistik</div>
                <div className="uppercase text-gray-400 font-bold">Din statistik</div>

                <div className="flex flex-col items-start justify-betweem h-80 mx-4 mt-4 overflow-y-scroll w-full">
                    {!isLoading && stats && (
                        <div className="flex flex-col gap-4">
                            <div>
                                <div className="text-xl font-bold">Antal spelade dagar</div>
                                <div className="text-gray-600">{stats.daysPlayed}</div>
                            </div>

                            <div>
                                <div className="text-xl font-bold">Antal förstaplatser</div>
                                <div className="text-gray-600">{stats.totalWins}</div>
                            </div>

                            <div>
                                <div className="text-xl font-bold">Antal gissningar</div>
                                <div className="text-gray-600">{stats.totalGuesses}</div>
                            </div>
                        </div>
                    )}

                    {isLoading && (
                        <div className="flex w-full h-full items-start justify-center mt-8">
                            <Spinner size="medium" />
                        </div>
                    )}

                    {!stats && !isLoading && (
                        <div className="text-xl font-semibold">Hittade ingen statistik</div>
                    )}
                </div>
            </div>
        </>
    );
};
