import { Router } from "express";

// import admin from "./admin";
// import auth from "./auth";
import member from "./member";
// import { authMiddleware } from "../middlewares";
// import user from "./user";

const router = new Router();

// router.use("/admin", admin);
// router.use("/auth", auth);
router.use("/member", member);

export default router;
