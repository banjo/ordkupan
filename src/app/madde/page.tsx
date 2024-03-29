import { Main } from "@/components/Main";
import { Playboard } from "@/components/Playboard";
import { BasicCombo } from "@/types/types";
import { getCombos } from "@/utils/combo";
import { shuffle } from "@banjoanton/utils";
import combos from "../../../words/data/combos.json" assert { type: "json" };

export const revalidate = 0;

const COMBOS = combos as BasicCombo[];

export default async function Home() {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [_, previousCombo, daysSinceStart] = await getCombos();
    const combo = COMBOS[daysSinceStart + 100];

    if (!combo) throw new Error("No combo found");

    combo.otherLetters = shuffle(combo.otherLetters);
    const comboAsBase64 = Buffer.from(JSON.stringify(combo)).toString("base64");

    return (
        <Main>
            <Playboard
                combo64={comboAsBase64}
                previous={previousCombo}
                localStorageKey="maddekupan"
            />
        </Main>
    );
}
