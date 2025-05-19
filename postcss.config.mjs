/** @type {import('postcss-load-config').Config} */
const config = {
  plugins: {
    "tailwindcss/nesting": "postcss-nested",
    tailwindcss: {},
  },
};

export default config;
