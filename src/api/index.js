import { Router } from "express";
import cms from "./cms";

const router = new Router();

router.use("/cms", cms);
router.get("/test", (req, res) => {
  console.log("hello", req.body);
  res.json({ test: "hello" });
});

export default router;
