import { describe, expect, it } from "vitest";
import { calculateStep } from "../score";

describe("score", () => {
    describe("calculateStep", () => {
        it("should return 1 when score is less than 10", () => {
            expect(calculateStep(9, 100, 9)).toBe(1);
        });

        it("should return 2 when score is less than 20", () => {
            expect(calculateStep(19, 100, 9)).toBe(2);
        });

        it("should return final step only on max score", () => {
            expect(calculateStep(1000, 1000, 9)).toBe(9);
            expect(calculateStep(999, 1000, 9)).toBe(8);
        });
    });
});
