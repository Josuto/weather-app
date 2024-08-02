const path = require("path");

module.exports = {
  webpack: {
    alias: {
      "@components": path.resolve(__dirname, "src/components"),
      "@hooks": path.resolve(__dirname, "src/hooks"),
      "@type": path.resolve(__dirname, "src/types"),
      "@styles": path.resolve(__dirname, "src/styles"),
      "@util": path.resolve(__dirname, "src/util"),
    },
  },
  jest: {
    configure: (jestConfig) => {
      jestConfig.moduleNameMapper = {
        ...jestConfig.moduleNameMapper,
        "^@components(.*)$": "<rootDir>/src/components$1",
        "^@hooks(.*)$": "<rootDir>/src/hooks$1",
        "^@type(.*)$": "<rootDir>/src/types$1",
        "^@styles(.*)$": "<rootDir>/src/styles$1",
        "^@util(.*)$": "<rootDir>/src/util$1",
      };
      return jestConfig;
    },
  },
};
