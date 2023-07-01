export const calculateStep = (score: number, maxScore: number, maxSteps: number) => {
    if (score < 10) return 1;

    const step = Math.floor((score / maxScore) * maxSteps);

    if (step < 2) return 2;

    return step;
};
