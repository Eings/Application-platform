'use strict'
const Controller = require('egg').Controller
class homeData extends Controller {
  async getList() {
    try {
      this.ctx.body = 'hello world'
      return { code: 1, res: this.ctx.body, msg: '成功！' }
    } catch (error) {
      console.log('getList方法报错：' + error)
      return { code: 0, msg: '失败！' }
    }
  }
}
module.exports = homeData
