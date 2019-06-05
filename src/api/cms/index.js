import { Router } from "express";

// import admin from "./admin";
// import auth from "./auth";
import member from "./member";
// import { authMiddleware } from "../middlewares";
// import user from "./user";

const api = new Router();

// api.use("/admin", admin);
// api.use("/auth", auth);
api.use("/member", member);

export default api;
