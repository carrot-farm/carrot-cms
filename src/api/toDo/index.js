import { Router } from "express";

import auth from "./auth";
import category from "./category";
import toDos from "./toDos";
import config from "./config";

const router = new Router();

router.use("/auth", auth);
router.use("/category", category);
router.use("/toDos", toDos);
router.use("/config", config);
router.get("/test", (req, res) => {
  res.json({ test: "ccc" });
});

export default router;
