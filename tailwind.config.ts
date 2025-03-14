/** @type {import('tailwindcss').Config} */
module.exports = {
	darkMode: ["class"],
	content: [
	  "./pages/**/*.{ts,tsx}",
	  "./components/**/*.{ts,tsx}",
	  "./app/**/*.{ts,tsx}",
	  "./src/**/*.{ts,tsx}",
	  "*.{js,ts,jsx,tsx,mdx}",
	],
	theme: {
	  extend: {
		fontFamily: {
		  sans: ["Exo 2", "sans-serif"],
		},
		colors: {
		  "club-primary": "#D81E05",
		  "club-secondary": "#FFFFFF",
		  "club-accent": "#11214B",
		  "club-dark": "#1A1A1A",
		},
	  },
	},
	plugins: [require("tailwindcss-animate")],
  };
  