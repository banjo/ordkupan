import { Playboard } from "../components/Playboard";
import { getById } from "../utils/database";

export default async function Home() {
    const startDate = new Date("2023-05-15T00:00:00.000Z");
    const now = new Date();

    const daysSinceStart = Math.floor(
        (now.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
    );

    const combo = await getById(daysSinceStart);

    if (!combo) {
        throw new Error("Combo not found");
    }

    return (
        <main className="flex h-full flex-col items-center justify-center">
            <Playboard combo={combo} />
        </main>
    );
}
