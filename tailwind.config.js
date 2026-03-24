/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        midnight: "#0b1220",
        dune: "#141b2d",
        oasis: "#22d3ee",
        sand: "#f5d08c",
        mint: "#2dd4bf",
        ember: "#fb923c"
      },
      boxShadow: {
        glow: "0 0 40px rgba(34, 211, 238, 0.25)"
      }
    }
  },
  plugins: []
};
