/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            backgroundImage: {
                "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
                "gradient-conic":
                    "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
            },
            colors: {
                primary: "#ffda79",
                primaryDark: "#ccae62",
                lighter: "#e5e5e5",
                light: "#d1d1d1",
            },
        },
    },
    safelist: [
        "left-[87px]",
        "bottom-[50px]",
        "top-[50px]",
        "left-[0px]",
        "top-[100px]",
        "right-[87px]",
        "right-[0px]",
        "bottom-[100px]",
        "border",
        "border-x",
        "border-t",
        "border-b",
    ],
    plugins: [],
};
