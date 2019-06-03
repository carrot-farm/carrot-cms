import { Router } from "express";
import passport from "passport";

import { mysqlMiddleware } from "middlewares";
import { register, login } from "./member.ctrl";

const router = new Router();

// 가입
router.post("/register", mysqlMiddleware, register);
// 로그인
// router.post("/login", mysqlMiddleware, login);

// token 유효성 검증
// router.get(
//   "/check",
//   passport.authenticate("token", { session: false }),
//   mysqlMiddleware,
//   check
// );

// // token 재발행
// router.get(
//   "/refreshToken",
//   passport.authenticate("refreshToken", { session: false }),
//   mysqlMiddleware,
//   refreshToken
// );

export default router;
