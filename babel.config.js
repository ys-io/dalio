module.exports = function (api) {
  api.cache(true);
  return {
    presets: ["babel-preset-expo"],
    plugins: [
      [
        "module-resolver",
        {
          alias: {
            "@components": "./src/components",
            "@constans": "./src/constans",
            "@hooks": "./src/hooks",
            "@providers": "./src/providers",
            "@services": "./src/services",
            "@features": "./src/features",
            "@app-types": "./src/types",
          },
        },
      ],
    ],
  };
};
