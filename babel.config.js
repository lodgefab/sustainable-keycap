module.exports = {
  presets: [
    [
      'next/babel',
      {
        'preset-react': {
          runtime: 'automatic',
          importSource: '@emotion/react',
        },
      },
    ],
  ],
  plugins: ['@emotion/babel-plugin'],
  env: {
    test: {
      plugins: [
        // 同じモジュール内の関数への参照を f() から exports.f() に変換する。テスト時にそのような関数をモックするために使用する。
        'explicit-exports-references',
      ],
    },
  },
}
