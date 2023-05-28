import { Temporal } from "@js-temporal/polyfill";
import { Combo } from "../types/types";

export const getCombos = (combos: Combo[]): [Combo, Combo, number] => {
    const startDate = Temporal.ZonedDateTime.from({
        timeZone: "Europe/Stockholm",
        year: 2023,
        month: 5,
        day: 15,
    });

    const currentDate = Temporal.Now.plainDateISO("Europe/Stockholm").toZonedDateTime({
        timeZone: "Europe/Stockholm",
    });

    const { days: daysSinceStart } = currentDate.since(startDate, {
        largestUnit: "day",
    });

    const combo = combos[daysSinceStart]; // add modulo so it does not break after 3000 days
    const previousCombo = combos[daysSinceStart - 1];

    if (!combo || !previousCombo) {
        throw new Error("Combo not found");
    }

    return [combo, previousCombo, daysSinceStart];
};
