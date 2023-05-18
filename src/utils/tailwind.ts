import resolveConfig from "tailwindcss/resolveConfig";
import tailwindConfig from "../../tailwind.config";

const fullConfig = resolveConfig(tailwindConfig);

export const getCustomColors = () => {
    const colors = fullConfig.theme?.colors;

    if (!colors) {
        throw new Error("No colors found in tailwind config");
    }

    return {
        primary: colors.primary as string,
        primaryDark: colors.primaryDark as string,
        lighter: colors.lighter as string,
        light: colors.light as string,
    };
};
