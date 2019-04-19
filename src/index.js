require("dotenv").config();
import Express, { Router } from "express";
import bodyParser from "body-parser";

import basicRouter from "./router";

const app = Express();
const router = Router();

// app.use('/basic', )

const server = app.listen(3000, () => {
  console.log("server listen 3000");
});
