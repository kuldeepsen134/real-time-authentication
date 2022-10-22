const Sequelize = require('sequelize')

const sequelize = new Sequelize(process.env.DB, process.env.DBUSER, process.env.DBPASSWORD, {
  host: process.env.DBHOST,
  dialect: 'mysql',
  operatorsAliases: 0,
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
})

const db = {
  sequelize: sequelize,
  User: require('./user')(sequelize, Sequelize),
  Session: require('./session')(sequelize, Sequelize),
}

module.exports = db

db.User.hasOne(db.Session, { foreignKey: { name: 'user_id', allowNull: false } })
db.Session.belongsTo(db.User, { foreignKey: { name: 'user_id', allowNull: false } })


db.sequelize.sync({ alter: true, }).then(() => { console.log('Yes re-sync') })
