import { useCallback, useEffect, useMemo, useState } from "react";

type FetchProps = {
    signal?: AbortSignal;
};

type Out<T> = {
    isLoading: boolean;
    error: string | null;
    errorStatus: number | null;
    data: T | null;
    refetch: (signal?: AbortSignal) => void;
    clear: () => void;
};

type In<T> = {
    url: string;
    method?: "GET" | "POST" | "PUT" | "DELETE";
    headers?: HeadersInit;
    parseAsText?: boolean;
    dependsOn?: any[];
    body?: any;
    onSuccess?: (data: T) => void;
};

export const useSimpleFetch = <T>(props: In<T>): Out<T> => {
    const {
        url,
        method = "GET",
        headers,
        parseAsText,
        dependsOn = [],
        body = {},
        onSuccess,
    } = props;

    const memoizedBody = useMemo(() => JSON.stringify(body), [body]);
    const memoizedHeaders = useMemo(() => headers, [headers]);

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [errorStatus, setErrorStatus] = useState<number | null>(null);
    const [data, setData] = useState<T | null>(null);

    const canRun = useMemo(() => {
        if (dependsOn.length === 0) {
            return true;
        }

        return dependsOn.every(Boolean);
    }, [dependsOn]);

    const fetchData = useCallback(
        async ({ signal }: FetchProps) => {
            try {
                const response = await fetch(url, {
                    signal,
                    headers: memoizedHeaders,
                    method,
                    body: memoizedBody,
                });

                if (!response.ok) {
                    throw response;
                }

                const parsedData = parseAsText ? await response.text() : await response.json();
                setData(parsedData);
                if (onSuccess) {
                    onSuccess(parsedData);
                }
            } catch (error_) {
                if (error_ instanceof DOMException && error_.name === "AbortError") {
                    setError("Request aborted");
                } else if (error_ instanceof Response) {
                    setErrorStatus(error_.status);
                    setError(await (error_.text ? error_.text() : "Unknown response error"));
                } else if (typeof error_ === "string") {
                    setError(error_);
                } else {
                    setError("Unknown error");
                }
            } finally {
                setIsLoading(false);
            }
        },
        [url, memoizedHeaders, method, memoizedBody, parseAsText, onSuccess]
    );

    useEffect(() => {
        const controller = new AbortController();
        const { signal } = controller;

        if (canRun) {
            fetchData({ signal });
        }

        return () => {
            controller.abort();
        };

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [fetchData, canRun]);

    const refetch = async (signal?: AbortSignal) => {
        if (!canRun) {
            console.log("Not all dependencies are met, not refetching");
            return;
        }

        await fetchData({ signal });
    };

    const clear = () => {
        setData(null);
        setError(null);
        setErrorStatus(null);
        setIsLoading(false);
    };

    return {
        isLoading,
        error,
        errorStatus,
        data,
        refetch,
        clear,
    };
};
