import Express, { Router } from "express";

// import mongoose from "./config/mongoose";
import mysql from "./config/mysql";
import { appMiddleware } from "./middlewares";
import cms from "./cms";

const { PORT: port } = process.env;
const app = Express();
const router = Router();

// mongodb 접속
// mongoose();

// 미들웨어 적용
appMiddleware(app, mysql);

// mysql 커넥션 미들웨어 적용
// app.use("/", mysql);

// api 라우팅
app.use("/cms", cms);

const server = app.listen(port, () => {
  console.log(`server listen ${port}`);
});
