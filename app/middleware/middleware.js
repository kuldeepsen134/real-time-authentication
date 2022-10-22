const { Session, User } = require('../models')
const { strings } = require('../utils/string')

module.exports = middleware = async (req, res, next) => {

    const publicRoutes = ['/register', '/get-refresh-token', '/get-access-token']

    if (publicRoutes.includes(req.path)) return next()

    if (req.headers.authorization) {

        const session = await Session.findOne({
            where: { access_token: req.headers.authorization },
            include: User
        })

        if (session && session.user.id) {

            if ((new Date() - session.created_at) < 60000) {

                req.headers.user_id = session.user.id

                return next()
            }
        }
    }

    res.status(401).send({ error: true, message: strings.unauthorizedAccess })
}  
