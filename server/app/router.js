module.exports = (app) => {
  const { router, controller } = app
  router.get('/api/public/title', controller.publicData.title)
  router.get('/api/getList', controller.homeData.getList)
}
