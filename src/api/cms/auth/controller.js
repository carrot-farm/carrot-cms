import jwt from "jsonwebtoken";
import pbkdf2Password from "pbkdf2-password";
import passport from "passport";

import { userValidate } from "lib/validator";
import { pbkdf2Async } from "lib/helper";

const {
  TOKEN_SECRET: tokenSecret,
  TOKEN_REFRESH_SECRET: tokenRefreshSecret,
  TOKEN_ISSUER: tokenIssuer,
  TOKEN_SUBJECT: tokenSubject,
  TOKEN_EXP: tokenExp,
  TOKEN_REFRESH_EXP: tokenRefreshExp
} = process.env;

const tokenOptions = {
  issuer: tokenIssuer,
  subject: tokenSubject
};

// ========== access token check
export const check = (req, res) => {
  res.json({
    success: true,
    message: "pass check"
  });
};

// ========== access token 재발행
export const refreshToken = async (req, res) => {
  try {
    // 토큰 정보
    let tokenUser = {
      email: req.user.email,
      admin: req.user.admin
    };
    let token;
    let refreshToken;
    // 관리자일 경우
    if (req.user.amidn) {
      // 리프레시 토큰 유효성 검증
      const oldRefreshToken = await req.mysql
        .table("bd_config", "select")
        .find({
          cf_admin_refresh_token: req.headers["x-refresh-token"]
        })
        .select("COUNT (*) as cnt")
        .exec();
      if (oldRefreshToken[0].cnt <= 0) {
        throw new Error("Unauthorized");
      }
    }
    // 일반 유저일 경우.
    else {
    }
    // access token 발행
    token = jwt.sign(tokenUser, tokenSecret, {
      ...tokenOptions,
      expiresIn: tokenExp
    });
    // 리프레시 토큰의 남은 만료시간(일)
    const diffDate = Math.round(
      (req.user.exp * 1000 - new Date().getTime()) / 1000 / 60 / 60 / 24
    );
    // 리프레시 토큰의 유효기간이 2일 이내 일경우 리프레시 토큰 재발행.
    if (diffDate <= 2) {
      refreshToken = jwt.sign(tokenUser, tokenRefreshSecret, {
        ...tokenOptions,
        expiresIn: tokenRefreshExp
      });
    }
    // return
    res.json({
      token,
      refreshToken
    });
  } catch (e) {
    res.status(401).send(e.message);
  }
};
