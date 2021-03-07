const app = require('./app')
const { testConneccion } = require('./database/config')

testConneccion()

// db.sync({
//   // alter: true,
//   // force: true,
// })
//   .then(function () {
//     console.log("DB conectado");
//   })
//   .catch(function (error) {
//     console.log(error);
//   });

app.listen(app.get('port'), (err) => {
  if (err) throw new Error(err)
  console.log('SV conectado en el puerto ' + app.get('port'))
})
