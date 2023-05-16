import { connect } from "@planetscale/database";
import "dotenv/config";
import { Combo, ComboFromDb } from "../types/types";
const config = {
    host: process.env.DATABASE_HOST,
    username: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASSWORD,
};

const conn = connect(config);

export const addCombo = async (combo: Combo) => {
    try {
        const result = await conn.execute(
            "insert into combos (mainLetter, otherLetters, words, maxScore) values (?, ?, ?, ?)",
            [
                combo.mainLetter,
                combo.otherLetters.join(""),
                JSON.stringify(combo.words),
                combo.maxScore,
            ]
        );
        return result.rowsAffected;
    } catch (error) {
        console.error(error);
        return false;
    }
};

export const getById = async (id: number): Promise<Combo | null> => {
    try {
        const result = await conn.execute("select * from combos where id = ?", [id]);
        const item = result.rows[0] as ComboFromDb;

        if (!item) {
            console.log("No item found");
            return null;
        }

        const combo: Combo & { id: number } = {
            id: item.id,
            mainLetter: item.mainLetter,
            otherLetters: [...item.otherLetters],
            words: JSON.parse(item.words),
            maxScore: item.maxScore,
        };

        return combo;
    } catch (error) {
        console.error(error);
        return null;
    }
};
