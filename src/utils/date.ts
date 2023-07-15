import { Temporal } from "@js-temporal/polyfill";
import { format } from "date-fns";

export const readableDate = (date: Date) => {
    return format(date, "d MMMM, yyyy");
};

export const dateNow = () => {
    const now = Temporal.Now.plainDateISO("Europe/Stockholm")
        .toZonedDateTime({
            timeZone: "Europe/Stockholm",
        })
        .toString()
        .split("T")[0];

    if (!now) {
        throw new Error("Could not get date");
    }

    return now;
};
