import app from "./app";

app.listen(app.get("port"), (err) => {
  if (err) throw new Error(err);
  console.log("Servidor corriendo en el puerto " + app.get("port"));
});
