import { shuffle } from "@banjoanton/utils";
import { Playboard } from "../components/Playboard";
import { getById } from "../utils/database";

export default async function Home() {
    const startDate = new Date("2023-05-14T22:00:00.000Z").toLocaleDateString("sv-SE", {
        timeZone: "Europe/Stockholm",
    });
    const now = new Date().toLocaleDateString("sv-SE", {
        timeZone: "Europe/Stockholm",
    });

    const daysSinceStart = Math.floor(
        (new Date(now).getTime() - new Date(startDate).getTime()) / (1000 * 60 * 60 * 24)
    );

    const combo = await getById(daysSinceStart);

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
