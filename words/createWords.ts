import { exportJsonFile, importJsonFile } from "./helpers";

const main = async () => {
    const arrayOfWords = importJsonFile("./svenska-ord.json");
    const cleanedArray = cleanup(arrayOfWords);
    exportJsonFile("./words.json", cleanedArray);
};

function cleanup(array: string[]) {
    const cleanedArray = array.filter((word) => {
        const wordConditionToExclude = [
            word.includes("-"),
            word.includes(" "),
            word.includes("."),
            word.includes(","),
            word.includes("è"),
            word.includes("é"),
            word.length < 4,
            word.length > 7,
        ];

        return !wordConditionToExclude.some((condition) => condition);
    });
    return cleanedArray;
}

main();
