import jsdom from "jsdom";
const { JSDOM } = jsdom;

export type SaulResponse = {
    grundform: string;
    ordklass: string;
    bojning: string;
    lexem: string[];
};

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

export const getWord = async (word: string): Promise<SaulResponse | null> => {
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

    const element = parts[0];

    if (!element) {
        console.log("No element found");
        return null;
    }

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
