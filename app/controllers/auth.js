const { User, Session } = require('../models')

const { getAccessToken, getRefreshToken } = require('./validator')

const { handleError, createUUID, handleResponse } = require('../utils/helper')
const { strings } = require('../utils/string')

exports.getAccessToken = async (req, res) => {

  const { error } = getAccessToken.validate(req.body,)

  if (error) {
    handleError(error, req, res)
    return
  }

  const user = await User.findOne({ where: { refresh_token: req.body.refresh_token } })

  if (user) {

    await Session.destroy({ where: { user_id: user.id } })

    const session = await user.createSession({ access_token: createUUID() })

    return res.send({
      message: strings.authSuccessMessage,
      access_token: session.access_token,
      error: false
    })
  }
  handleError(strings.invalidToken, req, res)
}

exports.getRefreshToken = async (req, res) => {

  const { error, } = getRefreshToken.validate(req.body,)

  if (error) {
    handleError(error, req, res)
    return
  }

  const user = await User.findOne({ where: { email: req.body.email, name: req.body.name } })

  if (user) {
    const refresh_token = createUUID()
    User.update({
      email: req.body.email,
      refresh_token: refresh_token
    },
      { where: { id: user.id } })
      .then(data => {
        handleResponse(res, { refresh_token: refresh_token }, strings.refreshToken)
      })
      .catch(err => {
        handleError(err, req, res)
      })
  }
  if (user === null) {
    res.status(400).send({ error: true, message: strings.userNotFound })
  }
}