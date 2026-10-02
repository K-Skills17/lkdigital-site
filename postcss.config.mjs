/** @type {import('postcss-load-config').Config} */
const config = {
  plugins: {
    tailwindcss: {},
    // Isolates each free tool's CSS (src/tools/<slug>/) under `.tool-<slug>`.
    "./postcss-tool-scope.cjs": {},
  },
};

export default config;
