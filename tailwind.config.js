/** @type {import('tailwindcss').Config} */

const defaultTheme = require("tailwindcss/defaultTheme");

// Custom color with css variable color in __theme_color.scss
function customColors(cssVar) {
  return ({ opacityVariable, opacityValue }) => {
    if (opacityValue !== undefined) {
      return `rgba(var(${cssVar}), ${opacityValue})`;
    }
    if (opacityVariable !== undefined) {
      return `rgba(var(${cssVar}), var(${opacityVariable}, 1))`;
    }
    return `rgb(var(${cssVar}))`;
  };
}

module.exports = {
  // Optimized content paths - be specific to reduce CSS output
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
    "./src/container/**/*.{js,ts,jsx,tsx}",
    "./src/wp-templates/**/*.{js,ts,jsx,tsx}",
    "./src/wp-blocks/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "selector",
  
  // Minimal safelist - only what's actually used dynamically
  safelist: [
    // Grid columns used in responsive layouts
    'grid-cols-1',
    'grid-cols-2', 
    'grid-cols-3',
    'grid-cols-4',
    // Category/tag colors that come from WordPress
    {
      pattern: /bg-(green|blue|red|indigo|pink|rose|yellow|purple)-(50|500|600)/,
    },
    // Padding variations
    'pb-5',
    'pb-6',
    'pb-8',
    'pb-10',
  ],
  
  theme: {
    container: {
      center: true,
      padding: {
        DEFAULT: "1rem",
        "2xl": "128px",
      },
    },

    extend: {
      colors: {
        primary: {
          50: customColors("--c-primary-50"),
          100: customColors("--c-primary-100"),
          200: customColors("--c-primary-200"),
          300: customColors("--c-primary-300"),
          400: customColors("--c-primary-400"),
          500: customColors("--c-primary-500"),
          600: customColors("--c-primary-600"),
          700: customColors("--c-primary-700"),
          800: customColors("--c-primary-800"),
          900: customColors("--c-primary-900"),
        },
        secondary: {
          50: customColors("--c-secondary-50"),
          100: customColors("--c-secondary-100"),
          200: customColors("--c-secondary-200"),
          300: customColors("--c-secondary-300"),
          400: customColors("--c-secondary-400"),
          500: customColors("--c-secondary-500"),
          600: customColors("--c-secondary-600"),
          700: customColors("--c-secondary-700"),
          800: customColors("--c-secondary-800"),
          900: customColors("--c-secondary-900"),
        },
        neutral: {
          50: customColors("--c-neutral-50"),
          100: customColors("--c-neutral-100"),
          200: customColors("--c-neutral-200"),
          300: customColors("--c-neutral-300"),
          400: customColors("--c-neutral-400"),
          500: customColors("--c-neutral-500"),
          600: customColors("--c-neutral-600"),
          700: customColors("--c-neutral-700"),
          800: customColors("--c-neutral-800"),
          900: customColors("--c-neutral-900"),
        },
      },
      animation: {
        "spin-slow": "spin 3s linear infinite",
      },
    },
  },
  
  // Only include plugins that are actually used
  plugins: [
    require("@tailwindcss/typography"),
    require("@tailwindcss/forms"),
    require("@tailwindcss/aspect-ratio"),
  ],
};
