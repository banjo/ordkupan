import { shuffle } from "@banjoanton/utils";
import combos from "../../../words/data/combos.json" assert { type: "json" };
import { Main } from "../../components/Main";
import { Playboard } from "../../components/Playboard";
import { Combo } from "../../types/types";
import { getCombos } from "../../utils/combo";

export const revalidate = 0;

const COMBOS = combos as Combo[];

export default function Home() {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [_, previousCombo, daysSinceStart] = getCombos();
    const combo = COMBOS[daysSinceStart + 1000];
    combo.otherLetters = shuffle(combo.otherLetters);

    return (
        <Main>
            <Playboard combo={combo} previous={previousCombo} localStorageKey="maddekupan" />
        </Main>
    );
}
