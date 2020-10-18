'use strict'
const Controller = require('egg').Controller
class homeData extends Controller {
  async getList() {
    try {
      const { app, ctx } = this
      let AreaCode = '120200'
      ctx.body = await app.mysql.query(
        `select * from area where AreaCode=${AreaCode}`
      )
      return { code: 1, res: ctx.body, msg: '成功！' }
    } catch (error) {
      console.log('getList方法报错：' + error)
      return { code: 0, msg: '失败！' }
    }
  }
}
module.exports = homeData
