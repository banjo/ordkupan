import { Main } from "@/components/Main";
import { Playboard } from "@/components/Playboard";
import { getCombos } from "@/utils/combo";
import { shuffle } from "@banjoanton/utils";

export const dynamic = "force-dynamic";

export default async function Home() {
    const [combo, previousCombo] = await getCombos();
    combo.otherLetters = shuffle(combo.otherLetters);

    const comboAsBase64 = Buffer.from(JSON.stringify(combo)).toString("base64");

    return (
        <Main>
            <Playboard
                combo64={comboAsBase64}
                previous={previousCombo}
                localStorageKey="ordkupan"
            />
        </Main>
    );
}
