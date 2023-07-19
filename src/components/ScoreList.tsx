import { Spinner } from "@/components/Spinner";
import { useGameStore } from "@/stores/useGameStore";
import { useSocialStore } from "@/stores/useSocialStore";
import { FetchScoreResponse, PublicScore } from "@/types/types";
import { dateNow, readableDate } from "@/utils/date";
import { capitalize, isDefined } from "@banjoanton/utils";
import { Temporal } from "@js-temporal/polyfill";
import { FC, ReactNode, useEffect, useMemo, useState } from "react";
import { LuArrowLeft, LuArrowRight } from "react-icons/lu";

type Props = {
    title: string;
    subTitle?: string;
    emptyText: string;
    additionalEntries?: ((entry: PublicScore) => ReactNode)[];
    fetchFunction: (date: string) => Promise<FetchScoreResponse>;
    trigger?: boolean;
    fetchRankFunction?: (() => Promise<number | null>) | undefined;
};

export const ScoreList: FC<Props> = ({
    title,
    emptyText,
    additionalEntries,
    fetchFunction,
    subTitle,
    trigger,
    fetchRankFunction,
}) => {
    const user = useSocialStore();
    const { score: userScore } = useGameStore();
    const [rank, setRank] = useState<number | null>(null);
    const [isLoadingRank, setIsLoadingRank] = useState<boolean>(false);

    const [data, setData] = useState<PublicScore[]>([]);
    const [maxScore, setMaxScore] = useState<number>(0);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const [selectedDate, setSelectedDate] = useState<string>(dateNow());
    const canIncreaseDate = selectedDate !== dateNow();

    const hasFullScore = (score: number) => {
        return score === maxScore;
    };

    const increaseDateByOneDay = () => {
        const increasedDate = Temporal.PlainDate.from(selectedDate).add({ days: 1 });
        setSelectedDate(increasedDate.toString());
    };

    const decreaseDateByOneDay = () => {
        const decreasedDate = Temporal.PlainDate.from(selectedDate).add({ days: -1 });
        setSelectedDate(decreasedDate.toString());
    };

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            const sorted = await fetchFunction(selectedDate);
            setData(sorted.score);
            setMaxScore(sorted.maxScore);
            setIsLoading(false);
        };

        if (!isDefined(trigger)) {
            fetchData();
        } else if (trigger) {
            fetchData();
        }
    }, [fetchFunction, selectedDate, trigger]);

    useEffect(() => {
        const fetchRank = async () => {
            if (!fetchRankFunction) return;

            setIsLoadingRank(true);
            const rankData = await fetchRankFunction();
            if (!rankData) return;
            setRank(rankData);
            setIsLoadingRank(false);
        };

        fetchRank();
    }, [fetchRankFunction]);

    const shouldShowRank = useMemo(() => {
        return (
            rank !== null &&
            !isLoadingRank &&
            !isLoading &&
            data.length > 0 &&
            rank !== 0 &&
            rank > 5 &&
            selectedDate === Temporal.PlainDate.from(dateNow()).toString()
        );
    }, [data.length, isLoading, isLoadingRank, rank, selectedDate]);

    return (
        <div className="flex flex-col items-center flex-1 max-h-1/12">
            <div className="text-2xl font-bold uppercase">{title}</div>
            <div className="uppercase text-gray-400 font-bold">{subTitle}</div>
            <div className="flex gap-4 mt-4 items-center">
                <LuArrowLeft className="h-5 w-5 cursor-pointer" onClick={decreaseDateByOneDay} />
                <div>{readableDate(new Date(selectedDate))}</div>
                <LuArrowRight
                    className={`h-5 w-5 ${canIncreaseDate ? "cursor-pointer" : "opacity-30"}`}
                    onClick={canIncreaseDate ? increaseDateByOneDay : undefined}
                />
            </div>
            <div className="flex flex-col items-center justify-betweem h-80 mx-4 mt-4 overflow-y-scroll w-full">
                {!isLoading &&
                    data.map((score, index) => (
                        <div key={index} className="flex items-center justify-start w-full px-4">
                            <div className="text-xl font-semibold w-6">{index + 1}.</div>
                            <div className="ml-2">{capitalize(score.name)}</div>

                            <div className="ml-auto flex items-center">
                                {hasFullScore(score.score) && <div className="mr-2">💯</div>}
                                <div className="text-xl font-semibold">{score.score}</div>
                            </div>

                            {additionalEntries?.map(entry => entry(score))}
                        </div>
                    ))}

                {shouldShowRank && (
                    <>
                        <div className="my-2" />
                        <div className="flex items-center justify-start w-full px-4">
                            <div className="text-xl font-semibold w-6">{rank}.</div>
                            <div className="ml-2">{capitalize(user.name)}</div>

                            <div className="ml-auto flex items-center">
                                {hasFullScore(userScore) && <div className="mr-2">💯</div>}
                                <div className="text-xl font-semibold">{userScore}</div>
                            </div>
                        </div>
                    </>
                )}

                {isLoading && (
                    <div className="flex w-full h-full items-start justify-center mt-8">
                        <Spinner size="medium" />
                    </div>
                )}

                {data.length === 0 && !isLoading && (
                    <div className="text-xl font-semibold">{emptyText}</div>
                )}
            </div>
        </div>
    );
};
