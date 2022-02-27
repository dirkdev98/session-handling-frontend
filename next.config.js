const { withPreset } = require("@lightbase/next-preset");


// We used @lightbase/next-preset for shared Next.js configuration,
// you can override these setting if you have to.
const config = withPreset({
  preset: {
    transpileModules: [],
  },
});

module.exports = config;
