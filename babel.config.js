module.exports = {
  presets: [
    '@vue/cli-plugin-babel/preset',
    '@babel/preset-env'
  ],
  plugins: [['@babel/plugin-transform-runtime', { useESModules: true }]]
}
