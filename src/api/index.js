import { Router } from "express";

// import cms from "./cms";
import toDo from "./toDo";

const router = new Router();

// router.use("/cms", cms);
router.use("/toDo", toDo);

router.get("/test", (req, res) => {
  //   console.log("hello", req.body);
  res.json({ test: "test" });
});

export default router;
