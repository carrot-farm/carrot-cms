import { Router } from "express";
import passport from "passport";

import { mysqlMiddleware } from "middlewares";
import { check, refreshToken } from "./controller";

const router = new Router();

// jwtCheck에서는 성공에 대한 처리만 한다.
router.get(
  "/check",
  passport.authenticate("token", { session: false }),
  mysqlMiddleware,
  check
);

// token 재발행
router.get(
  "/refreshToken",
  passport.authenticate("refreshToken", { session: false }),
  mysqlMiddleware,
  refreshToken
);

export default router;
