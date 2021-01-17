import express from "express";
require("dotenv").config();
import morgan from "morgan";
import cors from "cors";

//app express
const app = express();

//para ver las rutas
app.use(morgan("dev"));

app.use(cors());

app.set("port", process.env.PUERTO || 4000);

export default app;
