import { shuffle } from "@banjoanton/utils";
import { Main } from "../components/Main";
import { Playboard } from "../components/Playboard";
import { getCombos } from "../utils/combo";

export const revalidate = 60;
export const runtime = "edge";

export default function Home() {
    const [combo, previousCombo] = getCombos();
    combo.otherLetters = shuffle(combo.otherLetters);

    return (
        <Main>
            <Playboard combo={combo} previous={previousCombo} localStorageKey="ordkupan" />
        </Main>
    );
}
