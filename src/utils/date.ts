import { format } from "date-fns";

export const readableDate = (date: Date) => {
    return format(date, "d MMMM, yyyy");
};
