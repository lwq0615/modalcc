const fs = require('fs');
const path = require('path');
const { rimrafSync } = require('rimraf')

module.exports = function (api) {
  api.cache(true);
  const modulesMap = {
    cjs: 'commonjs',
    esm: false,
  };
  const distPath = path.resolve(__dirname, `./dist/${process.env.type}`);
  if (fs.existsSync(distPath)) {
    rimrafSync(distPath);
  }
  return {
    presets: [
      [
        '@babel/preset-env',
        {
          modules: modulesMap[process.env.type],
        },
      ],
      '@babel/preset-typescript',
    ],
    ignore: ['src/types'],
  };
};
