module.exports = (app) => {
  const { router, controller } = app
  router.get('/api/public/title', controller.publicData.title) // 获取登陆页面标题
  router.post('/api/public/login', controller.publicData.login) // 登录接口
  router.post('/api/public/writeloginLog', controller.publicData.writeloginLog)
  router.get('/api/getList', controller.homeData.getList)
}
