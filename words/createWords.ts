import { exportJsonFile, importJsonFile } from "./helpers";

const main = () => {
    const arrayOfWords = importJsonFile("./words/data/svenska-ord.json");
    const cleanedArray = cleanup(arrayOfWords);
    exportJsonFile("./words/data/words.json", cleanedArray);
};

function cleanup(array: string[]) {
    const cleanedArray = array.filter(word => {
        const wordConditionToExclude = [
            word.includes("-"),
            word.includes(" "),
            word.includes("."),
            word.includes(","),
            word.includes("è"),
            word.includes("é"),
            word.length < 4,
        ];

        return !wordConditionToExclude.some(Boolean);
    });
    return cleanedArray;
}

main();
