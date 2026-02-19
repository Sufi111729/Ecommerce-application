/* eslint-disable no-undef */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#0f172a",
        sand: "#f8f5f0",
        accent: "#e11d48",
        moss: "#0f766e"
      }
    }
  },
  plugins: [require("@tailwindcss/forms")]
};
