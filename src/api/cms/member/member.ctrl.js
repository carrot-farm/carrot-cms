import jwt from "jsonwebtoken";
import pbkdf2Password from "pbkdf2-password";
import passport from "passport";

import { userValidate } from "lib/validator";
import { pbkdf2Async, getUserIp } from "lib/helper";

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

// ========== 가입 요청
export const register = async (req, res) => {
  const { email, password } = req.body;
  let insertData = {};

  // 유효성 검사
  const validationResult = userValidate(email, password);
  if (validationResult.error) {
    return res.status(401).json({
      error: true,
      message: `${validationResult.error.field} 에러.`
    });
  }
  console.log(">>> validationResult \n", validationResult);

  // query start
  try {
    console.log(">>> run");
    // 해당 유저가 있는지 확인.
    const memberInfo = await req.mysql
      .table("bd_member", "select")
      .select("mem_userid, mem_password, mem_salt")
      .exec();
    if (memberInfo.length) {
      throw new Error("해당 유저는 이미 가입되어 있습니다.");
    }
    console.log(">>> memberInfo \n", memberInfo);

    // 총 회원 수
    const totalMemberCnt = await req.mysql
      .table("bd_member", "select")
      .count()
      .exec();
    console.log(">>> totalMember \n", totalMemberCnt);

    // 아이피 확인.
    const userIp = getUserIp(req);
    console.log(">>> userIp \n", userIp);

    // 암호화
    const encResult = await pbkdf2Async({ password });
    console.log(">>> encResult \n", encResult);

    // insert data
    await req.mysql
      .table("bd_member", "insert")
      .data({
        mem_userid: email,
        mem_password: encResult.hash,
        mem_salt: encResult.salt
      })
      .save();

    // return
    res.json({
      error: false,
      message: "가입이 완료되었습니다. 로그인을 해주십시요."
    });
  } catch (e) {
    res.status(401).json({
      error: true,
      message: e.message
    });
  }
};

// ========== 관리자 로그인
export const login = async (req, res) => {
  const { email, password } = req.body;
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

  // email, password validate
  const validationResult = userValidate(email, password);
  if (validationResult.error) {
    return res.status(401).json({
      error: true,
      message: `${validationResult.error.field} 에러.`
    });
  }

  // 미리 정의된 adminStrategy 실행 후 user 로 지정된 정보를 넘긴다.
  passport.authenticate("adminStrategy", (e, user, error) => {
    if (error) {
      return res.status(401).json({
        error: true,
        message: error.message
      });
    }
    let token;
    let refreshToken;

    // 토큰에 저장 할 유저 정보
    const tokenUser = {
      email: user.email,
      admin: true
    };

    // 로그인 처리
    req.login(tokenUser, { session: false }, async _err => {
      try {
        if (_err) {
          throw new Error(_err.message);
        }
        // 토큰 생성
        token = jwt.sign(tokenUser, tokenSecret, {
          ...tokenOptions,
          expiresIn: tokenExp
        });
        // 리프레시 토큰 생성
        refreshToken = jwt.sign(tokenUser, tokenRefreshSecret, {
          ...tokenOptions,
          expiresIn: tokenRefreshExp
        });
        // 리프레시 토큰 저장.
        await req.mysql
          .table("bd_config", "update")
          .data({
            cf_admin_refresh_token: refreshToken
          })
          .save();
        // 리프레시 토큰 저장
        res.json({
          userInfo: tokenUser,
          token,
          refreshToken
        });
      } catch (e) {
        return res.status(401).json({
          error: true,
          message: e.message
        });
      }
    });
  })(req, res);
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
