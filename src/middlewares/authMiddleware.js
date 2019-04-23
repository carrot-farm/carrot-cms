/*
  jwt 토큰 검증을 한뒤 req.decoded에 유저 정보를 붙여서 넘긴다.
*/
import jwt from "jsonwebtoken";

import { secret } from "../../config";

const authMiddleware = async (req, res, next) => {
  // 토큰 정보 가져오기
  const token = req.headers["x-access-token"] || req.query.token;

  // 토큰 정보가 없을 경우.
  if (!token) {
    return res.status(403).json({
      error: true,
      success: false,
      message: "로그인을 해주십시요."
    });
  }

  try {
    // eslint-disable-next-line no-param-reassign
    req.decoded = await jwt.verify(token, secret);
    next();
  } catch (error) {
    res.status(403).json({
      error: true,
      message: error.message
    });
  }
};

export default authMiddleware;
