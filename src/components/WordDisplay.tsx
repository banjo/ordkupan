import { PostSaulResponse } from "@/app/api/saul/route";
import { useSimpleFetch } from "@/hooks/useSimpleFetch";
import { useThesaurusModalStore } from "@/stores/useThesarusModalStore";
import { capitalize } from "@banjoanton/utils";
import { FC, useEffect } from "react";

type Props = {
    words: string[];
};

export const WordDisplay: FC<Props> = ({ words }) => {
    const { setShow, setWord, setData, setOnClose, setIsLoading, word } = useThesaurusModalStore();
    const { isLoading, clear } = useSimpleFetch<PostSaulResponse>({
        url: "/api/saul",
        method: "POST",
        body: { word: word },
        dependsOn: [word],
        onSuccess: data => {
            setData(data);
        },
    });

    const onClick = (word: string) => {
        setWord(word);
        setShow(true);
    };

    const onClose = () => {
        setWord(null);
        setShow(false);
        clear();
    };

    useEffect(() => {
        setOnClose(onClose);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        setIsLoading(isLoading);
    }, [isLoading, setIsLoading]);

    return (
        <>
            <div className="mt-4 grid grid-cols-2 gap-2 text-xl">
                {[...words].reverse().map((word, index) => (
                    <div
                        className="mr-2d ml-2 w-10/12 border-b border-black cursor-pointer hover:opacity-50"
                        key={index}
                        onClick={() => onClick(word)}
                    >
                        {capitalize(word)}
                    </div>
                ))}
            </div>
        </>
    );
};
