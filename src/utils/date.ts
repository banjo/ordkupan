import { Temporal } from "@js-temporal/polyfill";
import { format } from "date-fns";

export const readableDate = (date: Date) => {
    return format(date, "d MMMM, yyyy");
};

export const dateNow = () => {
    return Temporal.Now.plainDateISO("Europe/Stockholm")
        .toZonedDateTime({
            timeZone: "Europe/Stockholm",
        })
        .toPlainDate()
        .toString();
};
