'use strict'
const Controller = require('egg').Controller
class publicData extends Controller {
  async title() {
    try {
      const { app, ctx } = this
      ctx.body = ctx.app.config.Proj.title
      return { state: 1, title: ctx.body }
    } catch (error) {
      return { state: 0, msg: '登录失败！' }
    }
  }
}
module.exports = publicData
