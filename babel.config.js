module.exports = {
  presets: [
    [
      '@babel/preset-env',
      {
        modules: false
      },
    ],
    '@babel/preset-typescript',
  ],
  ignore: [
    "src/types"
  ]
};
