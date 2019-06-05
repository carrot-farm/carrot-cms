import { Router } from "express";

const categoryCtrl = require("./category.ctrl");
const tools = require("lib/tools");
import { getUserMiddleware } from "middlewares";

const route = new Router();

// ===== 카테고리 리스트
route.get("/", getUserMiddleware, categoryCtrl.list);

// ===== 카테고리 세부내용
route.get("/:id", getUserMiddleware, categoryCtrl.read);

// ===== 카테고리 작성
route.post("/", getUserMiddleware, categoryCtrl.write);

// ===== 카테고리 업데이트
route.patch(
  "/:id",
  getUserMiddleware,
  tools.checkObjectId,
  categoryCtrl.update
);

// ===== 카테고리 삭제
route.delete(
  "/:id",
  getUserMiddleware,
  tools.checkObjectId,
  categoryCtrl.remove
);

// ===== 카테고리 선택
route.patch("/select/:id", getUserMiddleware, categoryCtrl.selectCategory);

module.exports = route;
