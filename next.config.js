const { withPreset } = require("@lightbase/next-preset");

// We used @lightbase/next-preset for shared Next.js configuration,
// you can override these setting if you have to.
const config = withPreset({
  reactStrictMode: true,
  experimental: { esmExternals: true },
  swcMinify: true,
  swcLoader: true,
  preset: {
    transpileModules: [],
    ignoreModules: ["next", "react-dom", "@headlessui/react", "chart.js"],
  },
});

module.exports = config;
