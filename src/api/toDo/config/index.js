import Router from "express";

const config = require("./config.ctrl");
import { getUserMiddleware } from "middlewares";

const route = new Router();

// 설정 가져오기.
route.get("/", getUserMiddleware, config.getConfig);

// 할일 완료 목록도 같이 보기.
route.patch(
  "/toggleCompleteView",
  getUserMiddleware,
  config.toggleCompleteView
);

module.exports = route;
