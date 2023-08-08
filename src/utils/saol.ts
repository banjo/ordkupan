import { isDefined } from "@banjoanton/utils";
import jsdom from "jsdom";
const { JSDOM } = jsdom;

export type saolResponse = {
    grundform: string;
    ordklass: string;
    bojning: string;
    lexem: string[];
    exempel: { title: string; text: string }[];
}[];

const getUrl = (word: string) => `https://svenska.se/saol/?sok=${word}&pz=1`;

const fetchUrl = async (url: string): Promise<string | null> => {
    try {
        const response = await fetch(url);
        const text = await response.text();
        return text;
    } catch (error) {
        console.log(error);
        return null;
    }
};

const parseElement = (element: Element) => {
    const grundform = element.querySelector(".grundform")?.textContent ?? "";
    const ordklass = element.querySelector(".ordklass")?.textContent ?? "";
    const bojning = element.querySelector(".bojning")?.textContent ?? "";

    const lexem = [...element.querySelectorAll(".lexem")].map(l => {
        return l.querySelector(".lexemid")?.textContent ?? "";
    });

    return {
        grundform,
        ordklass,
        bojning,
        lexem,
    };
};

export const getWord = async (word: string): Promise<saolResponse | null> => {
    const url = getUrl(word);

    const text = await fetchUrl(url);

    if (!text) {
        return null;
    }

    // parse the html to get the word
    const dom = new JSDOM(text);
    let window = dom.window;

    const hasMultipleResults = window.document.querySelector(".debug_seachfn_544");

    if (hasMultipleResults) {
        const href = hasMultipleResults?.getAttribute("href");

        if (!href) {
            console.log("No href found");
            return null;
        }

        const updatedText = await fetchUrl(`https://svenska.se${href}`);

        if (!updatedText) {
            console.log("No updated text found");
            return null;
        }

        const updatedDom = new JSDOM(updatedText);
        window = updatedDom.window;
    }

    const parts = window.document.querySelectorAll(".lemma");

    if (parts.length === 0) {
        console.log("No parts found");
        return null;
    }

    if (parts.length === 1) {
        const mainElement = parts[0];

        if (!mainElement) {
            console.log("No element found");
            return null;
        }

        const parsed = parseElement(mainElement);

        return [{ ...parsed, exempel: [] }];
    }

    // parts longer than 1
    const mainElement = parts[0];

    if (!mainElement) {
        console.log("No element found");
        return null;
    }

    // loop through parts and look in each element, if it has a class called "grundform_ptv" it is a child and should be included. If not, it is a new main element
    const parsed = parseElement(mainElement);

    const children = [...parts].slice(1);

    const examples = children
        .map(child => {
            const isChild = child.querySelector(".grundform_ptv");

            if (isChild) {
                const title = child.querySelector(".grundform_ptv")?.textContent ?? "";
                const text = child.querySelector(".lexemid")?.textContent ?? "";

                return {
                    title,
                    text,
                };
            }

            console.log("New main element, not supported yet");
        })
        // eslint-disable-next-line unicorn/no-array-callback-reference
        .filter(isDefined);

    return [{ ...parsed, exempel: examples }];
};
