const Joi = require('joi')

const createUser = Joi.object().keys({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
})

const updateUser = Joi.object().keys({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
})

const getAccessToken = Joi.object().keys({
  refresh_token: Joi.string().required(),
})

const getRefreshToken = Joi.object().keys({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
})


module.exports = {
  createUser,
  updateUser,
  getAccessToken,
  getRefreshToken,
}
