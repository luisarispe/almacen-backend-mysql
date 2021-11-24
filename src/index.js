const app = require('./app')
const { testConneccion } = require('./config/database')

testConneccion()

  // db.sync({
  //   alter: true
  //   force: true
  // })
  .then(function () {
  })
  .catch(function (error) {
    console.log(error)
  })

app.listen(app.get('port'), (err) => {
  if (err) throw new Error(err)
  console.log('SV conectado en el puerto ' + app.get('port'))
})
