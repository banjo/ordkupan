import { Temporal } from "@js-temporal/polyfill";
import { BasicComboWithWords } from "../types/types";
import { getCombo } from "./database";

export const getCombos = async (): Promise<[BasicComboWithWords, BasicComboWithWords, number]> => {
    const startDate = Temporal.ZonedDateTime.from({
        timeZone: "Europe/Stockholm",
        year: 2023,
        month: 5,
        day: 14, // decreased from 15 to 14 due to changing to database
    });

    const currentDate = Temporal.Now.plainDateISO("Europe/Stockholm").toZonedDateTime({
        timeZone: "Europe/Stockholm",
    });

    const { days: daysSinceStart } = currentDate.since(startDate, {
        largestUnit: "day",
    });

    const [combo, previousCombo] = await Promise.all([
        getCombo(daysSinceStart),
        getCombo(daysSinceStart - 1),
    ]).catch(error => {
        console.error(error);
        throw error;
    });

    if (!combo || !previousCombo) {
        throw new Error("Combo not found");
    }

    return [combo, previousCombo, daysSinceStart];
};
