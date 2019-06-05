import { Router } from "express";

const toDosCtrl = require("./toDos.ctrl");
import { getUserMiddleware } from "middlewares";

const route = new Router();

//할일 작성
route.post("/", getUserMiddleware, toDosCtrl.write);

//리스트 및 아이템 정보 가져오기.
route.get("/:categoryId", getUserMiddleware, toDosCtrl.list);

//아이템 정보 가져오기.
route.get("/toDo/:itemId", getUserMiddleware, toDosCtrl.read);

//아이템 업데이트
route.patch("/:itemId", getUserMiddleware, toDosCtrl.update);

// 아이템 삭제
route.delete("/:itemId", getUserMiddleware, toDosCtrl.remove);

module.exports = route;
