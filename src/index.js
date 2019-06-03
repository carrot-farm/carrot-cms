import Express, { Router } from "express";

// import mongoose from "./config/mongoose";
import mysql from "./config/mysql";
import { appMiddleware, passportMiddleware } from "./middlewares";
import api from "./api";

const { PORT: port } = process.env;
const app = Express();
const router = Router();

// mongodb 접속
// mongoose();

// 미들웨어 적용
appMiddleware(app, mysql);

// api 라우팅
app.use("/api", api);

// passport
passportMiddleware.jwtStrategy();
passportMiddleware.refreshStrategy();
passportMiddleware.adminStrategy();
passportMiddleware.localStrategy();

const server = app.listen(port, () => {
  console.log(`server listen ${port}`);
});

console.log("git test");
