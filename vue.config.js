const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  publicPath: (process.env.NODE_ENV === 'production') ? `${process.cwd()}/dist/` : '/',
  // configureWebpack: config => {
  //   if (process.env.NODE_ENV === 'production') {
  //     config.output.publicPath = `${process.cwd()}/dist/`
  //   }
  // }
})
