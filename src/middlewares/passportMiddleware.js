import passport from "passport";
import JWTPassport from "passport-jwt";
import localPassport from "passport-local";
import googlePassport from "passport-google-auth";

import { pbkdf2Async } from "lib/helper";

// ===== 설정
const {
  TOKEN_SECRET: tokenSecret,
  TOKEN_REFRESH_SECRET: refreshTokenSecret
} = process.env;

// ========== jwt 인증 전략
const jwtStrategy = () => {
  const { Strategy, ExtractJwt } = JWTPassport;

  passport.use(
    "token",
    new Strategy(
      {
        jwtFromRequest: ExtractJwt.fromHeader("x-access-token"), // 토큰의 헤더 지정.
        secretOrKey: tokenSecret
      },
      (payload, done) => {
        done(null, payload);
      }
    )
  );
};

// ========== refreshToken 인증
const refreshStrategy = () => {
  const { Strategy, ExtractJwt } = JWTPassport;
  passport.use(
    "refreshToken",
    new Strategy(
      {
        jwtFromRequest: ExtractJwt.fromHeader("x-refresh-token"), // 토큰의 헤더 지정.
        secretOrKey: refreshTokenSecret
      },
      (payload, done) => {
        done(null, payload);
      }
    )
  );
};

// ========== 관리자 인증 전략
const adminStrategy = () => {
  const strategy = localPassport.Strategy;
  passport.use(
    "adminStrategy",
    new strategy(
      {
        usernameField: "email",
        passwordField: "password",
        passReqToCallback: true,
        session: false // jwt를 사용할 것이기 때문에 session 사용안함.
      },
      async (req, email, password, done) => {
        try {
          const adminInfo = await req.mysql
            .table("bd_config", "select")
            .find({ cf_admin_email: email })
            .limit(1)
            .select("cf_admin_email, cf_admin_password, cf_admin_salt")
            .exec();
          if (!adminInfo.length) {
            throw new Error("대상을 찾을 수 없습니다.");
          }
          // 비밀번호 점검
          const encResult = await pbkdf2Async({
            password,
            salt: adminInfo[0].cf_admin_salt
          });
          if (encResult.hash !== adminInfo[0].cf_admin_password) {
            throw new Error("아이디 혹은 비밀번호를 확인해 주십시요.");
          }
          done(null, { email });
        } catch (e) {
          done("null", false, {
            error: true,
            message: e.message
          });
        }
      }
    )
  );
};

// ========== 일반 인증 전략
const localStrategy = () => {
  const strategy = localPassport.Strategy;
  passport.use(
    new strategy(
      {
        usernameField: "email",
        passwordField: "password",
        passReqToCallback: false, // 콜백에 req 객체 안넘김.
        session: false // jwt를 사용할 것이기 때문에 session 사용안함.
      },
      async (email, password, done) => {
        try {
          console.log("*** ", email, password);
          return done(null, { email: "eamil" });

          if (!user) {
            throw new Error(
              "대상을 찾을 수 없습니다. 아이디와 비밀번호를 확인하십시요"
            );
          }
          return done(null, user);
        } catch (e) {
          done(null, false, {
            error: true,
            message: e.message
          });
        }
      }
    )
  );
};

// ========== 구글 인증 전략
// local에서 작업을 완료 못했음.
const googleStrategy = () => {
  const strategy = googlePassport.Strategy;
  passport.use(
    "google",
    new strategy(
      {
        clientId: googleClientId,
        clientSecret: googleClientSecret,
        callbackURL: googleCallbackUrl,
        passReqToCallback: true,
        session: false
      },
      (req, token, tokenS, profile, done) => {
        // console.log('***** req', req.query);
        // console.log('***** token', token);
        // console.log('***** tokenSecret', tokenS);
        // console.log('***** profile', profile);
        // console.log('***** done', done);
        done(null, { tes: "test" });
      }
    )
  );
};

export default {
  jwtStrategy,
  refreshStrategy,
  localStrategy,
  googleStrategy,
  adminStrategy
};
