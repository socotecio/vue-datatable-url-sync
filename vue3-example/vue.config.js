const path = require("path");

module.exports = {
  configureWebpack: {
    resolve: {
      alias: {
        vue$: path.resolve(__dirname, "./node_modules/vue/index.js"),
        // this is used to be able to use vue-datatbale-url-sync with relative path import
        "vue-demi$": path.resolve(__dirname, "./node_modules/vue/index.js"),
      }
    },
  },
}