const app = require("./app");
const db = require("./database/config");

db.sync()
  .then(function () {
    console.log("DB conectado");
  })
  .catch(function (errror) {
    console.log(errror);
  });

app.listen(app.get("port"), (err) => {
  if (err) throw new Error(err);
  console.log("SV conectado en el puerto " + app.get("port"));
});
