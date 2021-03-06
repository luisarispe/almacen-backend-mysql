const Sequelize = require('sequelize')
require('dotenv').config()
const db = new Sequelize(
  process.env.MYSQL_DATABASE,
  process.env.MYSQL_USER,
  process.env.MYSQL_PASSWORD,
  {
    host: process.env.MYSQL_HOST,
    dialect: 'mysql',
    port: process.env.MYSQL_PORT,
    define: {
      timestamps: true
    },
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  }
)
const testConneccion = async () => {
  try {
    await db.authenticate()
    console.log('DB conectado')
  } catch (error) {
    console.log(error)
  }
}
module.exports = {
  db,
  testConneccion
}
