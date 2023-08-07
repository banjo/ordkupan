import { PostUserStatsResponse } from "@/app/api/stats/route";
import { Spinner } from "@/components/Spinner";
import { useSimpleFetch } from "@/hooks/useSimpleFetch";
import { useSocialStore } from "@/stores/useSocialStore";
import { FC } from "react";

export const Stats: FC<{ showStats: boolean }> = ({ showStats }) => {
    const { id } = useSocialStore();

    const { data, isLoading } = useSimpleFetch<PostUserStatsResponse>({
        url: "/api/stats",
        method: "POST",
        dependsOn: [id, showStats],
        body: { internalUserId: id },
    });

    return (
        <>
            <div className="flex flex-col items-center flex-1 max-h-1/12">
                <div className="text-2xl font-bold uppercase">Statistik</div>
                <div className="uppercase text-gray-400 font-bold">Din statistik</div>

                <div className="flex flex-col items-start justify-betweem h-80 mx-4 mt-4 overflow-y-scroll w-full">
                    {!isLoading && data && (
                        <div className="flex flex-col gap-4">
                            <div>
                                <div className="text-xl font-bold">Antal spelade dagar</div>
                                <div className="text-gray-600">{data.daysPlayed}</div>
                            </div>

                            <div>
                                <div className="text-xl font-bold">Antal förstaplatser</div>
                                <div className="text-gray-600">{data.totalWins}</div>
                            </div>

                            <div>
                                <div className="text-xl font-bold">Antal gissningar</div>
                                <div className="text-gray-600">{data.totalGuesses}</div>
                            </div>
                        </div>
                    )}

                    {isLoading && (
                        <div className="flex w-full h-full items-start justify-center mt-8">
                            <Spinner size="medium" />
                        </div>
                    )}

                    {!data && !isLoading && (
                        <div className="text-xl font-semibold">Hittade ingen statistik</div>
                    )}
                </div>
            </div>
        </>
    );
};
