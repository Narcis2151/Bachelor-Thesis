/** @type {import('tailwindcss').Config} */
module.exports = {
  presets: [require("@spartan-ng/ui-core/hlm-tailwind-preset")],
  content: [
    "./src/**/*.{html,ts}",
    "./components/**/*.{html,ts}",
    "./node_modules/flowbite/**/*.js",
  ],
  theme: {
    extend: {},
  },
  plugins: [require("daisyui"), require("flowbite/plugin")],
};
