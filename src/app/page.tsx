import { shuffle } from "@banjoanton/utils";
import combos from "../../words/data/combos.json" assert { type: "json" };
import { Main } from "../components/Main";
import { Playboard } from "../components/Playboard";
import { Combo } from "../types/types";
import { getCombos } from "../utils/combo";

export const revalidate = 0;

const COMBOS = combos as Combo[];

export default function Home() {
    const [combo, previousCombo] = getCombos(COMBOS);
    combo.otherLetters = shuffle(combo.otherLetters);

    return (
        <Main>
            <Playboard combo={combo} previous={previousCombo} localStorageKey="ordkupan" />
        </Main>
    );
}
