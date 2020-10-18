const path = require('path')
const isProd = process.env.NODE_ENV === 'production'
module.exports = {
  devServer: {
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:7001',
        // pathRewrite: { '^/api': '' },
        changeOrigin: true,
        secure: false,
      },
    },
  },
}
