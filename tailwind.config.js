import {heroui, lightLayout} from "@heroui/theme"

/** @type {import('tailwindcss').Config} */
const config = {
  content: [
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    "./node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-sans)"],
        mono: ["var(--font-mono)"],
      },
    },
  },
  darkMode: "class",
  plugins: [
    heroui({
      themes: {
        light: {
          colors: {
            "primary": "#389092",
            "secondary": "#5FCFC3",
            "content1": "#141E28",
            "background": "#FDD001"
          }
        },
        dark: {
          colors: {
            primary: "#5C58A4",
            secondary: "#9C90BC",
            background: "#110504",
            content1: "#40A231",
            default: "#FA7602"
          }
        }
      }
    })
  ],
};

module.exports = config;