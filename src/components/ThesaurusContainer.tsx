import { PostSaolResponse } from "@/app/api/saol/route";
import { Spinner } from "@/components/Spinner";
import { ThesaurusModal } from "@/components/ThesarusModal";
import { useSimpleFetch } from "@/hooks/useSimpleFetch";
import { useThesaurusModalStore } from "@/stores/useThesarusModalStore";
import { FC } from "react";

const ThesaurusNode = (saol: PostSaolResponse | null, isLoading: boolean) => {
    const first = saol?.[0];

    if (isLoading) {
        return (
            <div className="flex w-full h-full items-start justify-center mt-8">
                <Spinner size="medium" />
            </div>
        );
    }

    if (!first) return null;

    return (
        <div className="flex flex-col overflow-y-scroll items-start justify-center text-left">
            <div>
                <span className="text-xl font-bold mr-2">{first.grundform}</span>
                <span className="text-gray-600 italic mr-2">{first.ordklass}</span>
                <span className="text-gray-600">{first.bojning}</span>
            </div>

            <div className="mt-1">
                {first.lexem.map(lexem => (
                    <div key={lexem} className="text-gray-600 text-sm">
                        {lexem}
                    </div>
                ))}
            </div>

            <div className="mt-4">
                {first.exempel.map(exempel => (
                    <div key={exempel.title} className="text-gray-600 text-sm mt-1">
                        <span className="font-bold">{exempel.title}</span>
                        <span className="italic ml-2">{exempel.text}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export const ThesarusContainer: FC = () => {
    const { show, word, setWord, setShow } = useThesaurusModalStore();

    const { data, isLoading, clear } = useSimpleFetch<PostSaolResponse>({
        url: "/api/saol",
        method: "POST",
        body: { word },
        dependsOn: [word],
    });

    const onClose = () => {
        setWord(null);
        setShow(false);
        clear();
    };

    return (
        <div>
            <ThesaurusModal
                show={show}
                word={word}
                reactNode={ThesaurusNode(data, isLoading)}
                onCancel={onClose}
            />
        </div>
    );
};
