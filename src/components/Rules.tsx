import { FC } from "react";

export const Rules: FC = () => {
    return (
        <div className="flex flex-col items-center">
            <div className="text-2xl font-bold uppercase">Regler</div>
            <div className="mt-4 flex flex-col gap-4">
                <div>
                    <div className="mb-1 text-xl font-bold">Så här spelar du</div>
                    <div className="text-gray-600">
                        Med hjälp av de 7 bokstäverna på skärmen ska du bilda så många ord som
                        möjligt. Mittenbokstaven måste användas i varje ord. Varje bokstav får
                        användas hur många gånger som helst. Orden måste vara minst 4 bokstäver.
                        Varje dag publiceras ett nytt spel.
                    </div>
                </div>

                <div>
                    <div className="mb-1 mt-2 text-xl font-bold">Poäng</div>
                    <div className="text-gray-600">
                        <ul className="list-inside list-disc">
                            <li>Ord med 4 bokstäver ger 1 poäng.</li>
                            <li>För varje extra bokstav utöver det får du 1 poäng.</li>
                            <li>
                                Det finns alltid minst ett ord som innehåller alla bokstäver, det
                                ger 7 poäng extra.
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};
