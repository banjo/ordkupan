import { Main } from "@/components/Main";
import { Playboard } from "@/components/Playboard";
import { BasicComboWithWords } from "@/types/types";
import { getCombos } from "@/utils/combo";
import { shuffle } from "@banjoanton/utils";
import combos from "../../../words/data/combos.json" assert { type: "json" };

export const revalidate = 0;

const COMBOS = combos as BasicComboWithWords[];

export default async function Home() {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [_, previousCombo, daysSinceStart] = await getCombos();
    const combo = COMBOS[daysSinceStart + 1000];
    combo.otherLetters = shuffle(combo.otherLetters);

    return (
        <Main>
            <Playboard combo={combo} previous={previousCombo} localStorageKey="maddekupan" />
        </Main>
    );
}
