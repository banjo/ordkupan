import { shuffle } from "@banjoanton/utils";
import { Temporal } from "@js-temporal/polyfill";
import combos from "../../words/data/combos.json" assert { type: "json" };
import { Playboard } from "../components/Playboard";
import { Combo } from "../types/types";

export const revalidate = 10;

const COMBOS = combos as Combo[];

export default function Home() {
    const startDate = Temporal.ZonedDateTime.from({
        timeZone: "Europe/Stockholm",
        year: 2023,
        month: 5,
        day: 15,
    });

    console.log({ startDate: JSON.stringify(startDate) });

    const currentDate = Temporal.Now.plainDateISO("Europe/Stockholm").toZonedDateTime({
        timeZone: "Europe/Stockholm",
    });

    console.log({ currentDate: JSON.stringify(currentDate) });

    const { days: daysSinceStart } = currentDate.since(startDate, {
        largestUnit: "day",
    });

    console.log({ daysSinceStart });

    // const combo = await getById(daysSinceStart);
    const combo = COMBOS[daysSinceStart];

    if (!combo) {
        throw new Error("Combo not found");
    }

    combo.otherLetters = shuffle(combo.otherLetters);

    return (
        <main
            className="flex min-h-[100dvh] flex-col items-center justify-center 
        bg-white text-black"
        >
            <Playboard combo={combo} />
        </main>
    );
}
