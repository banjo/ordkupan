export const calculateStep = (score: number, maxScore: number, maxSteps: number) => {
    if (score < 10) return 1;

    if (score < 20) return 2;

    const step = Math.floor((score / maxScore) * maxSteps);

    if (step < 2) return 2;

    return step;
};
