var router = require('express').Router()

const { auth } = require('../controllers/index')

module.exports = app => {
  router.post('/get-access-token', auth.getAccessToken)
  router.post('/get-refresh-token', auth.getRefreshToken)

  app.use('/', router)
}