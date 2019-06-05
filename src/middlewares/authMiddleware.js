/*
  토큰이 유효한지 검사하는 미들웨어
  성공시 req.isAuth=true
*/
import { authToken } from "lib/tools";

const authMiddleware = async (req, res, next) => {
  if (!req.headers["x-access-token"]) {
    return next();
  }
  try {
    const tokenData = await authToken(req);
    req.isAuth = tokenData ? true : false;
    next();
  } catch (e) {
    next();
  }
};

export default authMiddleware;
