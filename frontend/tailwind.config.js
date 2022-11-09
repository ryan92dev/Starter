/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      backgroundColor: {
        primary: "var(--bg-primary)",
        secondary: "var(--bg-secondary)",
        tertiary: "var(--bg-tertiary)",

        "button-primary": "var(--button-primary)",
        "button-hover": "var(--button-hover)",
        "button-active": "var(--button-active)",
        // 'button-disabled': "var(--button-disabled)",
      },

      textColor: {
        primary: "var(--text-primary)",
        secondary: "var(--text-secondary)",
        tertiary: "var(--text-tertiary)",

        "button-text": "var(--button-text)",
      },
    },
  },
  plugins: [],
};
