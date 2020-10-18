module.exports = (app) => {
  const { router, controller } = app
  router.get('/api/getList', controller.homeData.getList)
}
