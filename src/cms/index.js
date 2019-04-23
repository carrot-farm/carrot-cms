import { Router } from "express";
import { mysqlMiddleware } from "../middlewares";
// import { authMiddleware } from "../middlewares";
// import auth from "./auth";
// import user from "./user";

const router = new Router();

router.get("/test", mysqlMiddleware, async (req, res) => {
  try {
    const result = await req.mysql
      .table("bd_member", "update")
      .find({
        mb_no: 3
      })
      .data({
        mb_name: "달나라"
      })
      .save();

    console.log("*** result\n", result);
    res.json(result);
  } catch (e) {
    res.status(400).json({
      error: true,
      message: "에러 테스트"
    });
  }
});

export default router;
