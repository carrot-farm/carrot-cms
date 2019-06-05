import { Router } from "express";

import {
  complete,
  auth_google,
  auth_google_callback,
  userInfo,
  check,
  initialData,
  logout
} from "./auth.ctrl";
import { getUserMiddleware } from "middlewares";

const router = new Router();

router.get("/complete", complete);
router.get("/google", auth_google);
router.get("/google/callback", auth_google_callback);
router.get("/userinfo", userInfo);
router.get("/check", check);
router.get("/initialData", getUserMiddleware, initialData);
router.get("/logout", logout);

module.exports = router;
