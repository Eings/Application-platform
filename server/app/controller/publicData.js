'use strict'
const Controller = require('egg').Controller
class publicData extends Controller {
  // 获取登陆页面标题
  async title() {
    try {
      const { app, ctx } = this
      ctx.body = ctx.app.config.Proj.title
      return { state: 1, title: ctx.body }
    } catch (error) {
      return { state: 0, msg: '登录失败！' }
    }
  }
  // 登录接口
  async login() {
    const { app, ctx } = this
    try {
      let { username, password } = ctx.request.body
      let sql = `SELECT * from userinfo where (EnName='${username}' or CnName='${username}') and PWD='${password}'`
      let res = await app.mysql.query(sql)
      ctx.body = { state: 1, res }
    } catch (error) {
      ctx.body = { state: 0 }
    }
  }
  async writeloginLog() {
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
