import { shuffle } from "@banjoanton/utils";
import { Main } from "../components/Main";
import { Playboard } from "../components/Playboard";
import { getCombos } from "../utils/combo";

export const dynamic = "force-dynamic";

export default async function Home() {
    const [combo, previousCombo] = await getCombos();
    combo.otherLetters = shuffle(combo.otherLetters);

    return (
        <Main>
            <Playboard combo={combo} previous={previousCombo} localStorageKey="ordkupan" />
        </Main>
    );
}
