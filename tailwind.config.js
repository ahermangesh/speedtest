module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html",
  ],
  theme: {
    extend: {
      colors: {
        softpink: "#FDECEC",
        peach: "#FDB8B8",
      },
      borderRadius: {
        xxl: "28px",
      },
      fontFamily: {
        inter: ["Inter", "Poppins", "sans-serif"],
      },
    },
  },
  plugins: [],
};
