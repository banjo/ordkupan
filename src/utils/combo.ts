import { Temporal } from "@js-temporal/polyfill";
import combos from "../../words/data/combos.json" assert { type: "json" };
import { Combo } from "../types/types";

const COMBOS = combos as Combo[];

export const getCombos = (): [Combo, Combo, number] => {
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

    const combo = COMBOS[daysSinceStart]; // add modulo so it does not break after 3000 days
    const previousCombo = COMBOS[daysSinceStart - 1];

    if (!combo || !previousCombo) {
        throw new Error("Combo not found");
    }

    return [combo, previousCombo, daysSinceStart];
};
