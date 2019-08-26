'use strict'

module.exports = api => {
  api.cache.forever()

  return {
    plugins: ['react-hot-loader/babel'],
    presets: [
      `@babel/preset-react`,
      [
        `@babel/preset-env`,
        {
          targets: {
            node: `current`,
          },
        },
      ],
    ],
  }
}
